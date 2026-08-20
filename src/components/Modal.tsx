import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/**
 * Content modal. Portalled to <body> for the same reason as Lightbox: section
 * elements set `z-index: 1`, which would otherwise trap it under the nav.
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="lightbox modal" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <button className="lightbox__close" type="button" aria-label="Close" onClick={onClose}>
        ✕
      </button>

      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal__title">{title}</h2>
        {children}
      </div>
    </div>,
    document.body,
  )
}
