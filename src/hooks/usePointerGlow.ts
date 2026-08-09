import { useEffect } from 'react'

/**
 * Tracks the pointer and writes it to `--px` / `--py` on <html>, which the
 * spotlight overlay reads. Skipped on touch devices and when the user prefers
 * reduced motion.
 */
export function usePointerGlow() {
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reducedMotion) return

    const root = document.documentElement
    let frame = 0

    const onMove = (event: PointerEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--px', `${event.clientX}px`)
        root.style.setProperty('--py', `${event.clientY}px`)
        frame = 0
      })
    }

    root.classList.add('has-glow')
    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
      root.classList.remove('has-glow')
    }
  }, [])
}
