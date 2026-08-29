/**
 * Landing page copy that counts, drawn from the live catalogue.
 *
 * The page used to say "Thirty designs" and "Black or white, S through XL" in
 * hard-coded prose, which had to be re-counted and redeployed every time the
 * run changed. It now follows the catalogue, so adding a piece or a colourway
 * from the Statsig console keeps the copy honest on its own.
 */

import { useMemo } from 'react'
import { offeredColors, productSizes, sortColors, sortSizes } from '../constants/products'
import { useCatalog } from './useCatalog'

const words = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
]

const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

/**
 * Sentence-cased words up to ninety-nine, digits beyond that. A run that large
 * reads better as a numeral anyway.
 */
export function spellCount(count: number): string {
  if (!Number.isFinite(count) || count < 0) return '0'

  const whole = Math.round(count)
  if (whole < 20) return words[whole]
  if (whole > 99) return String(whole)

  const ten = tens[Math.floor(whole / 10)]
  const unit = whole % 10

  return unit === 0 ? ten : `${ten}-${words[unit].toLowerCase()}`
}

/** "Black", "Black or white", "Black, white or sand". */
function listColors(colors: string[]): string {
  const names = colors.map((color) => color.toLowerCase())
  if (names.length === 0) return 'Limited colourways'
  if (names.length === 1) return names[0].replace(/^./, (c) => c.toUpperCase())

  const last = names[names.length - 1]
  const rest = names.slice(0, -1).join(', ')

  return `${rest} or ${last}`.replace(/^./, (c) => c.toUpperCase())
}

export type CatalogSummary = {
  /** e.g. "Thirty" */
  designs: string
  /** e.g. "Black or white" */
  colors: string
  /** e.g. "S through XL" */
  sizeRange: string
}

export function useCatalogSummary(): CatalogSummary {
  const catalog = useCatalog()

  return useMemo(() => {
    const colors = new Set<string>()
    const sizes = new Set<string>()

    for (const product of catalog) {
      for (const color of offeredColors(product)) colors.add(color)
      for (const size of productSizes(product)) sizes.add(size)
    }

    // Chart order, so the ends of the list really are the smallest and the
    // largest size the store cuts.
    const ordered = sortSizes([...sizes])
    const first = ordered[0]
    const last = ordered[ordered.length - 1]

    return {
      designs: spellCount(catalog.length),
      colors: listColors(sortColors([...colors])),
      sizeRange:
        first && last && first !== last ? `${first} through ${last}` : (first ?? 'one size'),
    }
  }, [catalog])
}

/** e.g. "Thirty", following the live catalogue. */
export function useDesignCount(): string {
  return useCatalogSummary().designs
}
