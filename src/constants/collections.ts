export const collections = [
  { name: 'Day-to-Day', theme: 'Everyday wearable' },
  { name: 'Streetwise', theme: 'Urban' },
  { name: 'Roots',      theme: 'Cultural & heritage' },
  { name: 'Loud Hours', theme: 'Party' },
  { name: 'Deadpan',    theme: 'Humour' },
  { name: 'City',    theme: 'Colombo Night Life' },
]

// Flat list of all tags for the tag cloud
export const collectionTags = collections.flatMap(c => [c.name, c.theme])
