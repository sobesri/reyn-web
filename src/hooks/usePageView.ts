import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../lib/analytics'

const SITE_NAME = 'Reyn Atelier'

/**
 * Sets the document title for a route and reports its page_view.
 *
 * Both happen in one effect, called from the page component itself, so the
 * view is never recorded against the previous route's title. Firing this from
 * a shared listener higher up the tree would run before the page had a chance
 * to name itself, and every product would report as "Reyn Atelier".
 */
export function usePageView(title: string) {
  const { pathname, search } = useLocation()
  const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} · ${SITE_NAME}`

  useEffect(() => {
    document.title = fullTitle
    trackPageView(pathname + search, fullTitle)
  }, [fullTitle, pathname, search])
}
