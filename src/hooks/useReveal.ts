import { useEffect } from 'react'

/**
 * Adds `.is-revealed` to every `[data-reveal]` element once it scrolls into
 * view. Elements are unobserved after the first hit so the animation only
 * plays once.
 */
export function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((el) => el.classList.add('is-revealed'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
