export type ArtworkMeta = {
  title?: string
  collection?: string
}

/**
 * Optional per-file overrides, keyed by filename (including extension).
 * Anything not listed here falls back to a title derived from the filename.
 */
const overrides: Record<string, ArtworkMeta> = {
  // '01-neon-rain.png': { title: 'Neon Rain, 3am', collection: 'City' },
}

// Vite resolves this at build time, so every matching file in src/assets/artwork
// is bundled and hashed. Adding a piece is a drag-and-drop, not a code edit.
const files = import.meta.glob<{ default: string }>(
  '../assets/artwork/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP,AVIF}',
  { eager: true },
)

function titleFromFilename(filename: string) {
  return filename
    .replace(/\.[^.]+$/, '') // extension
    .replace(/^\d+[-_\s]*/, '') // leading sort number
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export type Artwork = {
  src: string
  title: string
  collection?: string
}

export const artworks: Artwork[] = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, module]) => {
    const filename = path.split('/').pop() ?? path
    const meta = overrides[filename] ?? {}

    return {
      src: module.default,
      title: meta.title ?? titleFromFilename(filename),
      collection: meta.collection,
    }
  })
