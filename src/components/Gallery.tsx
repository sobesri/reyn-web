import { useCallback, useEffect, useState } from 'react'
import { artworks } from '../constants/artworks'

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const step = useCallback((delta: number) => {
    setOpenIndex((current) => {
      if (current === null) return current
      return (current + delta + artworks.length) % artworks.length
    })
  }, [])

  useEffect(() => {
    if (openIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenIndex(null)
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openIndex, step])

  // Nothing to show until artwork is dropped into src/assets/artwork.
  if (artworks.length === 0) return null

  const active = openIndex === null ? null : artworks[openIndex]

  return (
    <section className="section gallery" id="gallery">
      <div className="section__head">
        <div>
          <p className="eyebrow" data-reveal>
            03 / The artwork
          </p>
          <h2 className="section__title" data-reveal>
            Every tee starts as a drawing.
          </h2>
        </div>
        <p className="section__note" data-reveal>
          A look at the pieces going to print. Tap any one to see it full size.
        </p>
      </div>

      <div className="gallery__grid">
        {artworks.map((artwork, i) => (
          <figure className="art" key={artwork.src} data-reveal>
            <button
              className="art__button"
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`View ${artwork.title} full size`}
            >
              <img className="art__img" src={artwork.src} alt={artwork.title} loading="lazy" decoding="async" />
            </button>
            <figcaption className="art__meta">
              <span className="art__title">{artwork.title}</span>
              {artwork.collection && <span className="art__collection">{artwork.collection}</span>}
            </figcaption>
          </figure>
        ))}
      </div>

      {active && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={() => setOpenIndex(null)}
        >
          <button className="lightbox__close" type="button" aria-label="Close" onClick={() => setOpenIndex(null)}>
            ✕
          </button>

          {artworks.length > 1 && (
            <button
              className="lightbox__nav lightbox__nav--prev"
              type="button"
              aria-label="Previous artwork"
              onClick={(e) => {
                e.stopPropagation()
                step(-1)
              }}
            >
              ‹
            </button>
          )}

          <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
            <img className="lightbox__img" src={active.src} alt={active.title} />
            <figcaption className="lightbox__caption">
              <span>{active.title}</span>
              <span className="lightbox__count">
                {(openIndex ?? 0) + 1} / {artworks.length}
              </span>
            </figcaption>
          </figure>

          {artworks.length > 1 && (
            <button
              className="lightbox__nav lightbox__nav--next"
              type="button"
              aria-label="Next artwork"
              onClick={(e) => {
                e.stopPropagation()
                step(1)
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </section>
  )
}
