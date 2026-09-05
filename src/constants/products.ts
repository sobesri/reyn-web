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
 * First stock plan: 29 designs, 160 units on hand (89 black, 71 white).
 * Generated from the stock spreadsheet; quantities are units on hand.
 *
 * Cipher shipped a fourth design, Synapse, which was pulled over a print
 * fault. It is gone from this list, and `hidden` in the Statsig catalogue
 * pulls it from any build still carrying it.
 */
export const products: Product[] = [
  {
    slug: 'aurum-hydra',
    name: 'Hydra',
    collection: 'Aurum',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['AU-H1', 'AU-H1-F', 'Hydra_black'] },
    stock: {
      Black: { S: 1, M: 2, L: 1, XL: 1 },
    },
  },
  {
    slug: 'aurum-wolf',
    name: 'Lupus',
    collection: 'Aurum',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['AU-W1', 'AU-W1-F', 'Lupus_black'] },
    stock: {
      Black: { S: 1, M: 2, L: 1, XL: 1 },
    },
  },
  {
    slug: 'aurum-lion',
    name: 'Leo',
    collection: 'Aurum',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['AU-L2', 'AU-L2-F', 'Leo_black'], White: ['AU-L1', 'AU-L1-F', 'Leo_white'] },
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
    images: { Black: ['GS-MT1', 'GS-MT1-F', 'Medusa_black'] },
    stock: {
      Black: { S: 0, M: 2, L: 1, XL: 1 },
    },
  },
  {
    slug: 'genesis-angel-city',
    name: 'Angel City',
    collection: 'Genesis',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { White: ['GS-AC1', 'GS-AC1-F', 'Angel_City_white'] },
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
    images: { Black: ['GS-SO1', 'GS-SO1-F', 'Susanoo_black'] },
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
    images: { White: ['CX-GG1', 'CX-GG1-F', 'Glitch_God_white'] },
    stock: {
      White: { S: 1, M: 2, L: 1, XL: 1 },
    },
  },
  {
    slug: 'cipher-over-ride',
    name: 'Override',
    collection: 'Cipher',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: { Black: ['CX-OR1', 'CX-OR1-F', 'Override_black'] },
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
    images: { White: ['HC-JC1', 'HC-JC1-F', 'Julius_Online_white'] },
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
    images: {
      Black: ['HC-SR1', 'HC-SR1-F', 'Sir_Rendered_black'],
      White: ['HC-SR2', 'HC-SR2-F', 'Sir_Rendered_white'],
    },
    stock: {
      Black: { S: 0, M: 1, L: 0, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'havoc-angel',
    name: 'Wings and Horns',
    collection: 'Havoc',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: {
      Black: ['HC-WH2', 'HC-WH2-F', 'Wings_and_Horns_black'],
      White: ['HC-WH1', 'HC-WH1-F', 'Wings_and_Horns_white'],
    },
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
    images: {
      Black: ['HC-BY1', 'HC-BY1-F', 'Busy_black'],
      White: ['HC-BY2', 'HC-BY2-F', 'Busy_white'],
    },
    stock: {
      Black: { S: 0, M: 1, L: 0, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'havoc-emotional',
    name: 'Emotionally Available',
    collection: 'Havoc',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: {
      Black: ['HC-EA1', 'HC-EA1-F', 'Emotionally_Available_black'],
      White: ['HC-EA2', 'HC-EA2-F', 'Emotionally_Available_white'],
    },
    stock: {
      Black: { S: 0, M: 1, L: 0, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'havoc-inner-peace',
    name: 'Inner Peace',
    collection: 'Havoc',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: {
      Black: ['HC-IP1', 'HC-IP1-F', 'Inner_Peace_black'],
      White: ['HC-IP2', 'HC-IP2-F', 'Inner_Peace_white'],
    },
    stock: {
      Black: { S: 0, M: 1, L: 0, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
    },
  },
  {
    slug: 'untamed-limitless',
    name: 'Limitless',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: {
      Black: ['UD-LS1', 'UD-LS1-F', 'Limitless_black'],
      White: ['UD-LS2', 'UD-LS2-F', 'Limitless_white'],
    },
    stock: {
      Black: { S: 0, M: 1, L: 0, XL: 1 },
      White: { S: 1, M: 1, L: 0, XL: 0 },
    },
  },
  {
    slug: 'untamed-grft-loyalty',
    name: 'Loyalty',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: {
      Black: ['UD-LT1', 'UD-LT1-F', 'Loyalty_black'],
      White: ['UD-LT2', 'UD-LT2-F', 'Loyalty_white'],
    },
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
    images: {
      Black: ['UD-DP1', 'UD-DP1-F', 'Discipline_black'],
      White: ['UD-DP2', 'UD-DP2-F', 'Discipline_white'],
    },
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
    images: {
      Black: ['UD-FT1', 'UD-FT1-F', 'Faith_black'],
      White: ['UD-FT2', 'UD-FT2-F', 'Faith_white'],
    },
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
    images: {
      Black: ['UD-BT1', 'UD-BT1-F', 'Beast_black'],
      White: ['UD-BT2', 'UD-BT2-F', 'Beast_white'],
    },
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
    images: {
      Black: ['UD-BF1', 'UD-BF1-F', 'Broken_Pink_black'],
      White: ['UD-BF2', 'UD-BF2-F', 'Broken_Pink_white'],
    },
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
    images: {
      Black: ['UD-BM1', 'UD-BM1-F', 'Broken_Orange_black'],
      White: ['UD-BM2', 'UD-BM2-F', 'Broken_Orange_white'],
    },
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
    images: {
      Black: ['UD-IT1', 'UD-IT1-F', 'Innocent_black'],
      White: ['UD-IT2', 'UD-IT2-F', 'Innocent_white'],
    },
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
    images: {
      Black: ['UD-RL1', 'UD-RL1-F', 'Rebel_black'],
      White: ['UD-RL2', 'UD-RL2-F', 'Rebel_white'],
    },
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
    images: { Black: ['UD-RM', 'UD-RM-F', 'Rave_Mode_black'] },
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
    images: { Black: ['UD-HE', 'UD-HE-F', 'Hustle_black'] },
    stock: {
      Black: { S: 1, M: 2, L: 1, XL: 1 },
    },
  },
  {
    slug: 'untamed-freedom',
    name: 'Freedom',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: {
      Black: ['UD-FM1', 'UD-FM1-F', 'Freedom_black'],
      White: ['UD-FM2', 'UD-FM2-F', 'Freedom_white'],
    },
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
    images: {
      Black: ['UD-CS1', 'UD-CS1-F', 'Chaos_black'],
      White: ['UD-CS2', 'UD-CS2-F', 'Chaos_white'],
    },
    stock: {
      Black: { S: 0, M: 1, L: 2, XL: 0 },
      White: { S: 1, M: 2, L: 0, XL: 0 },
    },
  },
  {
    slug: 'untamed-focus',
    name: 'Focus',
    collection: 'Untamed',
    price: LAUNCH_PRICE,
    compareAtPrice: RRP,
    images: {
      Black: ['UD-FS1', 'UD-FS1-F', 'Focus_black'],
      White: ['UD-FS2', 'UD-FS2-F', 'Focus_white'],
    },
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
    images: {
      Black: ['UD-LY1', 'UD-LY1-F', 'Loyalty_II_black'],
      White: ['UD-LY2', 'UD-LY2-F', 'Loyalty_II_white'],
    },
    stock: {
      Black: { S: 0, M: 1, L: 1, XL: 0 },
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
 * The second view of each colourway, in the same order as coverImages, for
 * the listing card to reveal on hover. Every piece is shot back then front,
 * so this is the front of the tee where one has been uploaded. Empty for a
 * piece with a single image per colourway, and the card then shows no
 * hover state at all rather than cross-fading to the same photo.
 */
export function hoverImages(product: Product): string[] {
  return offeredColors(product)
    .map((color) => product.images[color]?.[1])
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
