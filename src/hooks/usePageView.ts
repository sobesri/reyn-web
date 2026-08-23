import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_URL } from '../constants/site'
import { trackPageView } from '../lib/analytics'

const SITE_NAME = 'Reyn Atelier'

/** Points an existing head tag at the current route, if the tag is there. */
function setUrlTag(selector: string, attribute: string, url: string) {
  document.head.querySelector(selector)?.setAttribute(attribute, url)
}

/**
 * Sets the document title, canonical URL and og:url for a route, and reports
 * its page_view.
 *
 * All of it happens in one effect, called from the page component itself, so
 * the view is never recorded against the previous route's title. Firing this
 * from a shared listener higher up the tree would run before the page had a
 * chance to name itself, and every product would report as "Reyn Atelier".
 */
export function usePageView(title: string) {
  const { pathname, search } = useLocation()
  const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} · ${SITE_NAME}`

  useEffect(() => {
    document.title = fullTitle

    // index.html ships the landing page's URL. Without this every route would
    // declare itself a duplicate of the homepage.
    const canonical = `${SITE_URL}${pathname}`
    setUrlTag('link[rel="canonical"]', 'href', canonical)
    setUrlTag('meta[property="og:url"]', 'content', canonical)

    trackPageView(pathname + search, fullTitle)
  }, [fullTitle, pathname, search])
}
