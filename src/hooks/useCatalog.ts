/**
 * The product catalogue as it should render right now: products.ts with the
 * live Statsig catalogue applied. See lib/catalog.ts for the config shape.
 *
 * With Statsig switched off this is the bundled catalogue and nothing else —
 * no Statsig hook is called at all, so there is no client to warn about a
 * missing provider. Which of the two implementations is used is decided once,
 * at module load, so the hook call order never changes between renders.
 */

import { useMemo } from 'react'
import { useDynamicConfig } from '@statsig/react-bindings'
import { swatchFor, type Product, type ProductColor } from '../constants/products'
import { statsigEnabled } from '../lib/statsig'
import { applyCatalog, CATALOG_CONFIG, EMPTY_CATALOG, parseCatalog, type Catalog } from '../lib/catalog'

function useNoCatalog(): Catalog {
  return EMPTY_CATALOG
}

function useStatsigCatalog(): Catalog {
  // Before the client finishes initialising this is the config's default — an
  // empty object — so the bundled catalogue renders first and is corrected in
  // place once Statsig answers. The hook re-runs on that update.
  const config = useDynamicConfig(CATALOG_CONFIG)
  const value = config.value

  return useMemo(() => parseCatalog(value), [value])
}

const useLiveCatalog = statsigEnabled ? useStatsigCatalog : useNoCatalog

export function useCatalog(): Product[] {
  const catalog = useLiveCatalog()
  return useMemo(() => applyCatalog(catalog), [catalog])
}

/** One piece by slug, live changes applied. undefined when the slug is unknown. */
export function useProduct(slug: string): Product | undefined {
  const catalog = useCatalog()
  return useMemo(() => catalog.find((product) => product.slug === slug), [catalog, slug])
}

/**
 * Swatch fill for a colourway, including colourways that exist only in the
 * live catalogue.
 */
export function useSwatch(): (color: ProductColor) => string {
  const { swatches } = useLiveCatalog()
  return useMemo(() => (color: ProductColor) => swatchFor(color, swatches), [swatches])
}
