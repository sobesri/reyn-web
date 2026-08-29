/**
 * The live catalogue: products.ts corrected by a Statsig dynamic config, so
 * stock, prices, colourways and whole pieces can change without a deploy.
 *
 * products.ts stays the source of truth. It is typed, it is what the build
 * time sitemap plugin reads, and it is what renders when Statsig is switched
 * off or has not answered yet. This layer edits that list at runtime.
 *
 * The dynamic config is named CATALOG_CONFIG and holds:
 *
 *   {
 *     "products": {
 *       "aurum-hydra": { "stock": { "Black": { "M": 0 } } },
 *       "aurum-lion":  { "price": 2999, "compareAtPrice": null },
 *       "havoc-rift":  {
 *         "name": "Rift",
 *         "collection": "Havoc",
 *         "price": 3299,
 *         "images": { "Sand": ["Rift_sand"] },
 *         "stock":  { "Sand": { "S": 2, "M": 3, "L": 3 } }
 *       }
 *     },
 *     "hidden": ["cipher-retired-piece"],
 *     "colors": { "Sand": "#d9cbb2" }
 *   }
 *
 * A known slug is merged field by field, so the first two entries above sell
 * out one size and reprice one piece without restating anything else.
 * `compareAtPrice: null` clears a was-price, ending an offer.
 *
 * An unknown slug creates a piece, which is why it must carry name,
 * collection, price and stock. `collection` has to be one of the five worlds:
 * their poster art is bundled, so a sixth cannot be invented from the console.
 * Images are Cloudinary public ids, so a new piece needs an upload but no
 * deploy; until one lands the card shows the usual pending placeholder.
 *
 * `hidden` pulls pieces from the store. `colors` gives swatch fills for
 * colourways products.ts has never heard of.
 *
 * Two things still need a deploy: a brand new size label wants a reissued size
 * chart poster and measurement table, and pieces added here are missing from
 * dist/sitemap.xml until the next build, since that is generated from
 * products.ts at build time.
 *
 * Console values are untyped, so everything is parsed defensively: a bad entry
 * is dropped and the local value stands rather than breaking a page.
 */

import { collections, type CollectionName } from '../constants/collections'
import { products, type Product, type ProductColor, type SizeStock } from '../constants/products'

/** Dynamic config name in the Statsig console. */
export const CATALOG_CONFIG = 'product_catalog'

/** Fields a config entry may set. Everything is optional for a known slug. */
export type ProductPatch = {
  name?: string
  collection?: CollectionName
  price?: number
  /** null clears the was-price; undefined leaves it as it is. */
  compareAtPrice?: number | null
  description?: string
  featured?: boolean
  images?: Record<ProductColor, string[] | undefined>
  stock?: Record<ProductColor, SizeStock | undefined>
}

export type Catalog = {
  patches: Record<string, ProductPatch>
  hidden: string[]
  swatches: Record<string, string>
}

export const EMPTY_CATALOG: Catalog = { patches: {}, hidden: [], swatches: {} }

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const asText = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined

/** A whole-rupee amount, or a unit count. Rejects negatives, NaN and Infinity. */
const asAmount = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.round(value) : undefined

const asCollection = (value: unknown): CollectionName | undefined => {
  const name = asText(value)
  return collections.some((c) => c.name === name) ? (name as CollectionName) : undefined
}

/** #rgb or #rrggbb, so a bad value cannot reach the style attribute. */
const asHex = (value: unknown): string | undefined => {
  const text = asText(value)
  return text && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(text) ? text : undefined
}

const asStringList = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined
  const list = value.map(asText).filter((item): item is string => item !== undefined)
  return list.length > 0 ? list : undefined
}

/** { colour: [public id, ...] }, dropping colourways with nothing usable. */
function parseImages(value: unknown): ProductPatch['images'] {
  if (!isObject(value)) return undefined

  const images: Record<string, string[]> = {}
  for (const [color, ids] of Object.entries(value)) {
    const list = asStringList(ids)
    if (asText(color) && list) images[color] = list
  }

  return Object.keys(images).length > 0 ? images : undefined
}

/** { colour: { size: units } }, dropping anything that is not a count. */
function parseStock(value: unknown): ProductPatch['stock'] {
  if (!isObject(value)) return undefined

  const stock: Record<string, SizeStock> = {}
  for (const [color, bySize] of Object.entries(value)) {
    if (!asText(color) || !isObject(bySize)) continue

    const parsed: SizeStock = {}
    for (const [size, units] of Object.entries(bySize)) {
      const count = asAmount(units)
      if (asText(size) && count !== undefined) parsed[size] = count
    }

    if (Object.keys(parsed).length > 0) stock[color] = parsed
  }

  return Object.keys(stock).length > 0 ? stock : undefined
}

function parsePatch(value: unknown): ProductPatch | undefined {
  if (!isObject(value)) return undefined

  const patch: ProductPatch = {}

  const name = asText(value.name)
  if (name) patch.name = name

  const collection = asCollection(value.collection)
  if (collection) patch.collection = collection

  const price = asAmount(value.price)
  if (price !== undefined) patch.price = price

  // null is meaningful here (clear the offer), so it is checked before asAmount.
  if (value.compareAtPrice === null) patch.compareAtPrice = null
  else {
    const compareAtPrice = asAmount(value.compareAtPrice)
    if (compareAtPrice !== undefined) patch.compareAtPrice = compareAtPrice
  }

  const description = asText(value.description)
  if (description) patch.description = description

  if (typeof value.featured === 'boolean') patch.featured = value.featured

  const images = parseImages(value.images)
  if (images) patch.images = images

  const stock = parseStock(value.stock)
  if (stock) patch.stock = stock

  return Object.keys(patch).length > 0 ? patch : undefined
}

export function parseCatalog(value: unknown): Catalog {
  if (!isObject(value)) return EMPTY_CATALOG

  const patches: Record<string, ProductPatch> = {}
  if (isObject(value.products)) {
    for (const [slug, raw] of Object.entries(value.products)) {
      const patch = asText(slug) ? parsePatch(raw) : undefined
      if (patch) patches[slug] = patch
    }
  }

  const swatches: Record<string, string> = {}
  if (isObject(value.colors)) {
    for (const [color, hex] of Object.entries(value.colors)) {
      const fill = asHex(hex)
      if (asText(color) && fill) swatches[color] = fill
    }
  }

  return {
    patches,
    hidden: asStringList(value.hidden) ?? [],
    swatches,
  }
}

/**
 * Merges per colourway and per size, so a patch can name a single size without
 * restating the rest of the run. A colourway that is new to the piece is added
 * whole, which is how a reprint reaches the store without a deploy.
 */
function mergeStock(product: Product, patch: ProductPatch['stock']): Product['stock'] {
  if (!patch) return product.stock

  const merged: Product['stock'] = { ...product.stock }
  for (const [color, bySize] of Object.entries(patch)) {
    if (bySize) merged[color] = { ...product.stock[color], ...bySize }
  }

  return merged
}

function applyPatch(product: Product, patch: ProductPatch | undefined): Product {
  if (!patch) return product

  const merged: Product = {
    ...product,
    name: patch.name ?? product.name,
    collection: patch.collection ?? product.collection,
    price: patch.price ?? product.price,
    description: patch.description ?? product.description,
    featured: patch.featured ?? product.featured,
    images: patch.images ? { ...product.images, ...patch.images } : product.images,
    stock: mergeStock(product, patch.stock),
  }

  if (patch.compareAtPrice === null) delete merged.compareAtPrice
  else if (patch.compareAtPrice !== undefined) merged.compareAtPrice = patch.compareAtPrice

  return merged
}

/**
 * A piece that exists only in the config. Everything a page needs to render
 * has to be present, or there is nothing worth showing and it is dropped.
 */
function newProduct(slug: string, patch: ProductPatch): Product | undefined {
  if (!patch.name || !patch.collection || patch.price === undefined || !patch.stock) {
    return undefined
  }

  const stock: Product['stock'] = {}
  for (const [color, bySize] of Object.entries(patch.stock)) {
    if (bySize) stock[color] = { ...bySize }
  }

  const product: Product = {
    slug,
    name: patch.name,
    collection: patch.collection,
    price: patch.price,
    images: patch.images ?? {},
    stock,
    featured: patch.featured,
  }

  if (typeof patch.compareAtPrice === 'number') product.compareAtPrice = patch.compareAtPrice
  if (patch.description) product.description = patch.description

  return product
}

/**
 * The catalogue as it should render now: bundled pieces patched and hidden
 * ones removed, then anything the config adds, in config order. Returns the
 * bundled array unchanged when there is nothing to apply, so consumers that
 * memoise on identity do no extra work.
 */
export function applyCatalog(catalog: Catalog): Product[] {
  const { patches, hidden } = catalog
  if (Object.keys(patches).length === 0 && hidden.length === 0) return products

  const known = new Set(products.map((product) => product.slug))
  const dropped = new Set(hidden)

  const existing = products
    .filter((product) => !dropped.has(product.slug))
    .map((product) => applyPatch(product, patches[product.slug]))

  const added = Object.entries(patches)
    .filter(([slug]) => !known.has(slug) && !dropped.has(slug))
    .map(([slug, patch]) => newProduct(slug, patch))
    .filter((product): product is Product => product !== undefined)

  return [...existing, ...added]
}
