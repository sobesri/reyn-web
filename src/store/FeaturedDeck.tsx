import { useCallback, useMemo, useRef, useState, type CSSProperties } from 'react'
import { isSoldOut, type Product } from '../constants/products'
import { ProductCard } from './ProductCard'
import { useCatalog } from '../hooks/useCatalog'

const FEATURED_COUNT = 15

/** How many cards are left visible either side of the one in front. */
const DEPTH = 3

/** Pixels of horizontal drag before a swipe counts as a move. */
const SWIPE_THRESHOLD = 48

function shuffle<T>(items: T[]) {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Fifteen pieces at random, in-stock first — a sold-out sleeve only appears
 * when there are not fifteen buyable ones to show.
 */
function pickFeatured(catalog: Product[]) {
  const buyable = shuffle(catalog.filter((p) => !isSoldOut(p)))
  const rest = shuffle(catalog.filter(isSoldOut))
  return [...buyable, ...rest].slice(0, FEATURED_COUNT)
}

/**
 * The featured rail: a crate of sleeves with one pulled to the front and the
 * rest stacked behind it, blurred back. Swipe on a touch screen, or use the
 * arrows — on screen or on the keyboard — anywhere else.
 */
export function FeaturedDeck() {
  const catalog = useCatalog()
  const [index, setIndex] = useState(0)
  // The live offset is state because it has to paint; the distance itself is
  // a ref, because a flick can deliver every pointermove inside one React
  // batch and the release would then read a drag of zero.
  const [drag, setDrag] = useState(0)
  const dragFrom = useRef<number | null>(null)
  const dragBy = useRef(0)
  const moved = useRef(false)

  // The selection is drawn once, on the bundled catalogue, and then held by
  // slug: a live catalogue update corrects prices and stock without
  // reshuffling the rail underneath someone halfway through it. A piece the
  // update withdraws simply drops out of the fan below.
  const [slugs] = useState(() => pickFeatured(catalog).map((product) => product.slug))

  const featured = useMemo(
    () =>
      slugs
        .map((slug) => catalog.find((product) => product.slug === slug))
        .filter((product): product is Product => Boolean(product)),
    [slugs, catalog],
  )

  const count = featured.length

  const go = useCallback(
    (delta: number) => {
      if (count === 0) return
      setIndex((current) => (current + delta + count) % count)
    },
    [count],
  )

  if (count === 0) return null

  /** Shortest signed distance from the front card, so the crate wraps around. */
  const offsetOf = (i: number) => {
    let offset = i - index
    if (offset > count / 2) offset -= count
    if (offset < -count / 2) offset += count
    return offset
  }

  const endDrag = () => {
    if (dragFrom.current === null) return
    if (dragBy.current <= -SWIPE_THRESHOLD) go(1)
    else if (dragBy.current >= SWIPE_THRESHOLD) go(-1)
    dragFrom.current = null
    dragBy.current = 0
    setDrag(0)
  }

  return (
    <section className="section featured" aria-labelledby="featured-title">
      <div className="featured__head">
        <p className="eyebrow">Featured</p>
      </div>

      <div className="featured__controls">
        <button type="button" className="featured__arrow" onClick={() => go(-1)} aria-label="Previous piece">
          ‹
        </button>
        <span className="featured__count" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <button type="button" className="featured__arrow" onClick={() => go(1)} aria-label="Next piece">
          ›
        </button>
      </div>

      <div
        className="featured__stage"
        role="group"
        aria-roledescription="carousel"
        aria-label={`Featured pieces, ${index + 1} of ${count}`}
        tabIndex={0}
        style={{ '--drag': `${drag}px` } as CSSProperties}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            go(-1)
          } else if (event.key === 'ArrowRight') {
            event.preventDefault()
            go(1)
          }
        }}
        onPointerDown={(event) => {
          // Let the mouse keep its text/link behaviour; drag is for touch and pen.
          if (event.pointerType === 'mouse') return
          dragFrom.current = event.clientX
          dragBy.current = 0
          moved.current = false
          // Keep following the finger even once it leaves the stage.
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (dragFrom.current === null) return
          const dx = event.clientX - dragFrom.current
          dragBy.current = dx
          if (Math.abs(dx) > 6) moved.current = true
          setDrag(dx)
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={(event) => {
          // A click on a sleeve is that sleeve's business: the front one opens,
          // and one behind brings itself forward. Everything else is the bare
          // stage, where which side you clicked is the whole instruction.
          if ((event.target as HTMLElement).closest('.featured__card')) return
          if (moved.current) return
          const { left, width } = event.currentTarget.getBoundingClientRect()
          go(event.clientX - left < width / 2 ? -1 : 1)
        }}
      >
        {featured.map((product, i) => {
          const offset = offsetOf(i)
          const depth = Math.abs(offset)
          const isFront = offset === 0

          return (
            <ProductCard
              key={product.slug}
              product={product}
              listName="Featured"
              as="div"
              className={`featured__card${isFront ? ' is-front' : ''}${depth > DEPTH ? ' is-stowed' : ''}`}
              style={{ '--o': offset, '--depth': depth } as CSSProperties}
              inert={!isFront}
              onNavigate={() => {
                // A card behind the front one comes forward instead of opening,
                // and a tap that was really a swipe opens nothing at all.
                if (!isFront) {
                  go(offset)
                  return false
                }
                if (moved.current) return false
              }}
            />
          )
        })}
      </div>
    </section>
  )
}
