import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createServer, defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Writes dist/sitemap.xml from the real product list at build time, so
 * retiring or adding a piece can never leave a stale sitemap checked in.
 *
 * The list is loaded through a throwaway Vite server rather than a plain
 * import because constants/products.ts reaches an asset import, which Node
 * on its own cannot resolve.
 */
function sitemap(): Plugin {
  return {
    name: 'reyn-sitemap',
    apply: 'build',
    async writeBundle(options) {
      const server = await createServer({
        configFile: false,
        logLevel: 'silent',
        server: { middlewareMode: true },
      })

      try {
        const { products } = await server.ssrLoadModule('/src/constants/products.ts')
        const { SITE_URL } = await server.ssrLoadModule('/src/constants/site.ts')

        const paths = [
          '/',
          '/store',
          ...products.map((product: { slug: string }) => `/store/${product.slug}`),
        ]

        const urls = paths
          .map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`)
          .join('\n')

        writeFileSync(
          resolve(options.dir ?? 'dist', 'sitemap.xml'),
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
            `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        )
      } finally {
        await server.close()
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sitemap()],
})
