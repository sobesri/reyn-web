import type { CollectionName } from './collections'
import { sizes } from './sizing'

export type Size = (typeof sizes)[number]

/** The only two colourways REYN produces. */
export const productColors = ['Black', 'White'] as const
export type ProductColor = (typeof productColors)[number]

/** Swatch fills for the colour selector. */
export const colorSwatch: Record<ProductColor, string> = {
  Black: '#101014',
  White: '#f2f0eb',
}

/** Units on hand for one colourway, keyed by size. */
export type SizeStock = Record<Size, number>

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
  images: Partial<Record<ProductColor, string[]>>
  /** Stock per colourway, per size. A colour not printed is omitted. */
  stock: Partial<Record<ProductColor, SizeStock>>
  /** Surfaces the piece at the top of the store listing. */
  featured?: boolean
}

/** Launch pricing: everything ships at the launch price against the usual RRP. */
export const LAUNCH_PRICE = 3299
export const RRP = 3799

/**
 * First stock plan: 30 designs, 180 units (106 black, 74 white).
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
      White: { S: 1, M: 1, L: 1, XL: 0 },
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
      White: { S: 1, M: 1, L: 1, XL: 0 },
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
      White: { S: 1, M: 1, L: 1, XL: 0 },
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
      White: { S: 1, M: 1, L: 1, XL: 0 },
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
      Black: { S: 0, M: 1, L: 1, XL: 1 },
      White: { S: 1, M: 1, L: 1, XL: 0 },
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

/** Colourways this piece is made in and still has stock for. */
export function availableColors(product: Product): ProductColor[] {
  return productColors.filter((color) => {
    const bySize = product.stock[color]
    return bySize ? sizes.some((size) => bySize[size] > 0) : false
  })
}

/** Colourways the piece is printed in at all, sold out or not. */
export function offeredColors(product: Product): ProductColor[] {
  return productColors.filter((color) => product.stock[color] !== undefined)
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
  return sizes.filter((size) => bySize[size] > 0)
}

/** Sizes with stock in at least one colourway, for listing cards. */
export function sizesInStock(product: Product): Size[] {
  return sizes.filter((size) =>
    offeredColors(product).some((color) => (product.stock[color]?.[size] ?? 0) > 0),
  )
}

export function totalStock(product: Product) {
  return offeredColors(product).reduce(
    (sum, color) => sum + sizes.reduce((n, size) => n + (product.stock[color]?.[size] ?? 0), 0),
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

export function findProduct(slug: string) {
  return products.find((product) => product.slug === slug)
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(amount)
}
