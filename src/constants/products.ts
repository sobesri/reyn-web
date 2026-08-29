import type { CollectionName } from './collections'
import { sizes } from './sizing'

/**
 * Sizes and colourways are plain strings, not closed unions, because the live
 * catalogue in lib/catalog.ts can introduce a colourway or a size that this
 * file has never heard of. The lists below stay the canonical ones: they are
 * what the local catalogue is written in and they fix the display order, with
 * anything new sorted after them.
 */
export type Size = string
export type ProductColor = string

/** The colourways REYN prints as standard. */
export const productColors = ['Black', 'White'] as const

/** Swatch fills for the colour selector. The live catalogue can add more. */
export const colorSwatch: Record<string, string> = {
  Black: '#101014',
  White: '#f2f0eb',
}

/** Neutral fill for a colourway with no swatch on record. */
export const FALLBACK_SWATCH = '#7a7a80'

export function swatchFor(color: ProductColor, extra?: Record<string, string>): string {
  return extra?.[color] ?? colorSwatch[color] ?? FALLBACK_SWATCH
}

/** Units on hand for one colourway, keyed by size. */
export type SizeStock = Record<Size, number>

/** Canonical entries first, in their listed order, then anything new. */
function inCanonicalOrder(values: string[], canonical: readonly string[]): string[] {
  const known = canonical.filter((value) => values.includes(value))
  const extra = values.filter((value) => !canonical.includes(value)).sort()
  return [...known, ...extra]
}

export type Product = {
  /** URL segment: /store/<slug> */
  slug: string
  name: string
  /** Which of the five worlds this piece belongs to. */
  collection: CollectionName
  /** Price in LKR, before any discount. */
  price: number
  /** Original price, set only when the piece is on offer. */
  compareAtPrice?: number
  /** Optional copy. Nothing renders until it is written. */
  description?: string
  /**
   * Cloudinary public IDs per colourway, without extension.
   * The first entry for the selected colour is the one shown on the card.
   */
  images: Record<ProductColor, string[] | undefined>
  /** Stock per colourway, per size. A colour not printed is omitted. */
  stock: Record<ProductColor, SizeStock | undefined>
  /** Surfaces the piece at the top of the store listing. */
  featured?: boolean
}

/** Launch pricing: everything ships at the launch price against the usual RRP. */
export const LAUNCH_PRICE = 3299
export const RRP = 3799

/**
 * First stock plan: 30 designs, 178 units on hand (106 black, 72 white).
 * Generated from the stock spreadsheet; quantities are units on hand.
 */
export const products: Product[] = [
  {
    slug: 'aurum-hydra',
    name: 'Hydra',
    collection: 'Aurum',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Hydra_black'] },
    stock: {
      Black: { S: 1, M: 2, L: 2, XL: 1 },
    },
  },
  {
    slug: 'aurum-wolf',
    name: 'Lupus',
    collection: 'Aurum',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Lupus_black'] },
    stock: {
      Black: { S: 1, M: 2, L: 2, XL: 1 },
    },
  },
  {
    slug: 'aurum-lion',
    name: 'Leo',
    collection: 'Aurum',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Leo_black'], White: ['Leo_white'] },
    stock: {
      Black: { S: 1, M: 1, L: 1, XL: 1 },
      White: { S: 0, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'genesis-medusa',
    name: 'Medusa',
    collection: 'Genesis',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Medusa_black'] },
    stock: {
      Black: { S: 1, M: 2, L: 2, XL: 1 },
    },
  },
  {
    slug: 'genesis-angel-city',
    name: 'Angel City',
    collection: 'Genesis',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { White: ['Angel_City_white'] },
    stock: {
      White: { S: 1, M: 2, L: 2, XL: 1 },
    },
  },
  {
    slug: 'genesis-susanoo',
    name: 'Susanoo',
    collection: 'Genesis',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Susanoo_black'] },
    stock: {
      Black: { S: 1, M: 2, L: 2, XL: 1 },
    },
  },
  {
    slug: 'cipher-glitch-god',
    name: 'Glitch God',
    collection: 'Cipher',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { White: ['Glitch_God_white'] },
    stock: {
      White: { S: 1, M: 2, L: 2, XL: 1 },
    },
  },
  {
    slug: 'cipher-over-ride',
    name: 'Override',
    collection: 'Cipher',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Override_black'] },
    stock: {
      Black: { S: 1, M: 2, L: 2, XL: 1 },
    },
  },
  {
    slug: 'cipher-synapse',
    name: 'Synapse',
    collection: 'Cipher',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Synapse_black'] },
    stock: {
      Black: { S: 1, M: 2, L: 2, XL: 1 },
    },
  },
  {
    slug: 'havoc-screen',
    name: 'Julius Online',
    collection: 'Havoc',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { White: ['Julius_Online_white'] },
    stock: {
      White: { S: 1, M: 2, L: 2, XL: 1 },
    },
  },
  {
    slug: 'havoc-knight',
    name: 'Sir Rendered',
    collection: 'Havoc',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Sir_Rendered_black'], White: ['Sir_Rendered_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'havoc-angel',
    name: 'Wings and Horns',
    collection: 'Havoc',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Wings_and_Horns_black'], White: ['Wings_and_Horns_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'havoc-busy',
    name: 'Busy?',
    collection: 'Havoc',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Busy_black'], White: ['Busy_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'havoc-emotional',
    name: 'Emotionally Available',
    collection: 'Havoc',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Emotionally_Available_black'], White: ['Emotionally_Available_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'havoc-inner-peace',
    name: 'Inner Peace',
    collection: 'Havoc',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Inner_Peace_black'], White: ['Inner_Peace_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'untamed-limitless',
    name: 'Limitless',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Limitless_black'], White: ['Limitless_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 0, XL: 0 },
    },
  },
  {
    slug: 'untamed-grft-loyalty',
    name: 'Loyalty',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Loyalty_black'], White: ['Loyalty_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'untamed-discipline',
    name: 'Discipline',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Discipline_black'], White: ['Discipline_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'untamed-faith',
    name: 'Faith',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Faith_black'], White: ['Faith_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'untamed-beast',
    name: 'Beast',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Beast_black'], White: ['Beast_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'untamed-broken-pink',
    name: 'Broken - Pink',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Broken_Pink_black'], White: ['Broken_Pink_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'untamed-broken-orange',
    name: 'Broken - Orange',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Broken_Orange_black'], White: ['Broken_Orange_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'untamed-innocent',
    name: 'Innocent',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Innocent_black'], White: ['Innocent_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 0, XL: 0 },
    },
  },
  {
    slug: 'untamed-rebel',
    name: 'Rebel',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Rebel_black'], White: ['Rebel_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'untamed-rave-mode',
    name: 'Rave Mode',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Rave_Mode_black'] },
    stock: {
      Black: { S: 1, M: 2, L: 2, XL: 1 },
    },
  },
  {
    slug: 'untamed-hustle',
    name: 'Hustle',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Hustle_black'] },
    stock: {
      Black: { S: 1, M: 2, L: 2, XL: 1 },
    },
  },
  {
    slug: 'untamed-freedom',
    name: 'Freedom',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Freedom_black'], White: ['Freedom_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 2, L: 0, XL: 0 },
    },
  },
  {
    slug: 'untamed-chaos',
    name: 'Chaos',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Chaos_black'], White: ['Chaos_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 2, L: 0, XL: 0 },
    },
  },
  {
    slug: 'untamed-focus',
    name: 'Focus',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Focus_black'], White: ['Focus_white'] },
    stock: {
      Black: { S: 0, M: 2, L: 1, XL: 0 },
      White: { S: 1, M: 2, L: 0, XL: 0 },
    },
  },
  {
    slug: 'untamed-loyalty',
    name: 'Loyalty II',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['Loyalty_II_black'], White: ['Loyalty_II_white'] },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
]

/** Sizes in chart order, with any the chart has never heard of sorted last. */
export function sortSizes(values: Size[]): Size[] {
  return inCanonicalOrder(values, sizes)
}

/** Colourways in house order, with any new ones sorted last. */
export function sortColors(values: ProductColor[]): ProductColor[] {
  return inCanonicalOrder(values, productColors)
}

/** Every size this piece is cut in, canonical sizes first. */
export function productSizes(product: Product): Size[] {
  const found = new Set<Size>()
  for (const color of offeredColors(product)) {
    for (const size of Object.keys(product.stock[color] ?? {})) found.add(size)
  }
  return inCanonicalOrder([...found], sizes)
}

/** Colourways this piece is made in and still has stock for. */
export function availableColors(product: Product): ProductColor[] {
  return offeredColors(product).filter((color) => {
    const bySize = product.stock[color]
    return bySize ? Object.values(bySize).some((units) => units > 0) : false
  })
}

/** Colourways the piece is printed in at all, sold out or not. */
export function offeredColors(product: Product): ProductColor[] {
  const printed = Object.keys(product.stock).filter((color) => product.stock[color] !== undefined)
  return inCanonicalOrder(printed, productColors)
}

export function stockFor(product: Product, color: ProductColor | null, size: Size | null) {
  if (!color || !size) return 0
  return product.stock[color]?.[size] ?? 0
}

/** Sizes with at least one unit on hand in the given colourway. */
export function availableSizes(product: Product, color: ProductColor | null): Size[] {
  if (!color) return []
  const bySize = product.stock[color]
  if (!bySize) return []
  return inCanonicalOrder(
    Object.keys(bySize).filter((size) => bySize[size] > 0),
    sizes,
  )
}

/** Sizes with stock in at least one colourway, for listing cards. */
export function sizesInStock(product: Product): Size[] {
  return productSizes(product).filter((size) =>
    offeredColors(product).some((color) => (product.stock[color]?.[size] ?? 0) > 0),
  )
}

export function totalStock(product: Product) {
  return offeredColors(product).reduce(
    (sum, color) =>
      sum + Object.values(product.stock[color] ?? {}).reduce((n, units) => n + units, 0),
    0,
  )
}

export function isSoldOut(product: Product) {
  return totalStock(product) === 0
}

/**
 * Cover candidates for a listing card: the first image of each colourway, in
 * order. The card tries each in turn, so a piece still shows a photo while
 * some colourways are yet to be uploaded.
 */
export function coverImages(product: Product): string[] {
  return offeredColors(product)
    .map((color) => product.images[color]?.[0])
    .filter((id): id is string => Boolean(id))
}

/**
 * Looks up a piece in the *bundled* catalogue only. Anything rendering to a
 * visitor should use the useProduct hook instead, so live catalogue changes
 * are included.
 */
export function findProduct(slug: string) {
  return products.find((product) => product.slug === slug)
}

/** ISO 4217 code, shared by formatPrice and the analytics ecommerce events. */
export const CURRENCY = 'LKR'

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount)
}
