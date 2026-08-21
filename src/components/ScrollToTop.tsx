import { useEffect, useState } from 'react'

/** Distance scrolled before the control appears. */
const REVEAL_AT = 500

type ScrollToTopProps = {
  /** Extra class, e.g. to lift it clear of the floating store button. */
  className?: string
}

export function ScrollToTop({ className }: ScrollToTopProps) {
  // Lazy initial read so a reload part-way down the page shows it immediately.
  const [visible, setVisible] = useState(() => window.scrollY > REVEAL_AT)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > REVEAL_AT)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={['scroll-top', visible ? 'is-visible' : '', className].filter(Boolean).join(' ')}
      onClick={toTop}
      aria-label="Scroll back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <span aria-hidden="true">↑</span>
    </button>
  )
}
