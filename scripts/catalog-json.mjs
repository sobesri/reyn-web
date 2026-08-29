/**
 * Prints the bundled catalogue in the shape lib/catalog.ts expects, ready to
 * paste into the Statsig `product_catalog` dynamic config.
 *
 *   npm run catalog:json            > writes catalog.json
 *   npm run catalog:json -- --stdout  prints it instead
 *
 * Run it once to seed the config, and again after a deploy changes
 * products.ts, so the console starts from what the site actually ships.
 *
 * The list is loaded through a throwaway Vite server rather than a plain
 * import for the same reason the sitemap plugin does it: constants/products.ts
 * reaches an asset import, which Node on its own cannot resolve.
 */

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createServer } from 'vite'

const OUT = 'catalog.json'

const server = await createServer({
  configFile: false,
  logLevel: 'silent',
  server: { middlewareMode: true },
})

try {
  const { products, colorSwatch } = await server.ssrLoadModule('/src/constants/products.ts')

  const entries = {}
  for (const product of products) {
    const entry = {
      name: product.name,
      collection: product.collection,
      price: product.price,
      images: product.images,
      stock: product.stock,
    }

    // Only carry the optional fields that are actually set, so the config
    // stays readable in the console.
    if (product.compareAtPrice !== undefined) entry.compareAtPrice = product.compareAtPrice
    if (product.description) entry.description = product.description
    if (product.featured) entry.featured = product.featured

    entries[product.slug] = entry
  }

  const catalog = {
    products: entries,
    hidden: [],
    colors: { ...colorSwatch },
  }

  const json = `${JSON.stringify(catalog, null, 2)}\n`

  if (process.argv.includes('--stdout')) {
    process.stdout.write(json)
  } else {
    writeFileSync(resolve(OUT), json)
    const count = Object.keys(entries).length
    process.stderr.write(`Wrote ${OUT}: ${count} products\n`)
  }
} finally {
  await server.close()
}
