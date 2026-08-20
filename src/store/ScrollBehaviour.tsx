import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Jumps to the top on route change, and honours `/#section` hash links coming
 * from the store back into the landing page.
 */
export function ScrollBehaviour() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Let the target route render before looking for the anchor.
      const id = hash.slice(1)
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start' })
      })
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
