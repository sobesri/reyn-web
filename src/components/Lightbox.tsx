import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

export type LightboxItem = {
  src: string
  title: string
}

type LightboxProps = {
  items: LightboxItem[]
  /** null closes the overlay. */
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  /** Extra class on the overlay, e.g. to allow panning a wide chart. */
  className?: string
}

/** Full-screen image viewer. Escape closes, arrows step when there is more than one item. */
export function Lightbox({ items, index, onIndexChange, onClose, className }: LightboxProps) {
  const step = useCallback(
    (delta: number) => {
      if (index === null) return
      onIndexChange((index + delta + items.length) % items.length)
    },
    [index, items.length, onIndexChange],
  )

  useEffect(() => {
    if (index === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
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
  }, [index, step, onClose])

  if (index === null) return null

  const active = items[index]
  const multiple = items.length > 1

  return createPortal(
    <div
      className={['lightbox', className].filter(Boolean).join(' ')}
      role="dialog"
      aria-modal="true"
      aria-label={active.title}
      onClick={onClose}
    >
      <button className="lightbox__close" type="button" aria-label="Close" onClick={onClose}>
        ✕
      </button>

      {multiple && (
        <button
          className="lightbox__nav lightbox__nav--prev"
          type="button"
          aria-label="Previous"
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
          {multiple && (
            <span className="lightbox__count">
              {index + 1} / {items.length}
            </span>
          )}
        </figcaption>
      </figure>

      {multiple && (
        <button
          className="lightbox__nav lightbox__nav--next"
          type="button"
          aria-label="Next"
          onClick={(e) => {
            e.stopPropagation()
            step(1)
          }}
        >
          ›
        </button>
      )}
    </div>,
    document.body,
  )
}
