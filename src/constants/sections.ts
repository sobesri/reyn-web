import { artworks } from './artworks'

/**
 * Ordered list of the numbered sections that actually render, so the eyebrow
 * numbers never skip. The gallery only appears once artwork exists.
 */
const order = [
  'manifesto',
  'collections',
  ...(artworks.length > 0 ? ['gallery'] : []),
  'sizing',
  'connect',
]

export function sectionNumber(id: string) {
  const index = order.indexOf(id)
  return String(index + 1).padStart(2, '0')
}
