/**
 * Google Analytics 4.
 *
 * The tag is injected here rather than hard-coded into index.html so that it
 * only ever loads in a production build with VITE_GA_MEASUREMENT_ID set. A
 * `npm run dev` session therefore never reports into the live property.
 *
 * Route changes are reported by hand from usePageView, because the default
 * snippet only counts the first load of a single-page app.
 */

import type { Product } from '../constants/products'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? ''

export const analyticsEnabled = import.meta.env.PROD && MEASUREMENT_ID.length > 0

/** One item as GA4's ecommerce reports expect it. */
export type AnalyticsItem = {
  item_id: string
  item_name: string
  item_category: string
  item_variant?: string
  price: number
  quantity?: number
}

let started = false

/** Loads gtag.js once. Safe to call again; later calls do nothing. */
export function startAnalytics() {
  if (!analyticsEnabled || started) return
  started = true

  window.dataLayer = window.dataLayer ?? []
  // gtag reads its own `arguments` object, so this cannot be an arrow or a
  // rest parameter: the tag expects the raw arguments to land in dataLayer.
  window.gtag = function gtag() {
    // gtag.js reads the raw Arguments object back out of dataLayer, so a
    // rest array is not an equivalent substitute here.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }

  window.gtag('js', new Date())
  // usePageView sends every page_view, including the first one. Also turn off
  // "page changes based on browser history events" under Enhanced Measurement
  // in the GA4 admin, or each route change is counted twice.
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (!analyticsEnabled) return
  window.gtag?.('event', name, params)
}

export function trackPageView(path: string, title: string) {
  trackEvent('page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  })
}

/**
 * Maps a product to the item shape GA4 ecommerce reports expect. Shared so
 * the store grid and the product page emit identical ids and categories,
 * which is what lets GA join a listing click to the order it produced.
 */
export function itemFor(product: Product, extra: Partial<AnalyticsItem> = {}): AnalyticsItem {
  return {
    item_id: product.slug,
    item_name: product.name,
    item_category: product.collection,
    price: product.price,
    ...extra,
  }
}
