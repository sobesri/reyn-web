import aurum from '../assets/collections/aurum.jpg'
import cipher from '../assets/collections/cipher.jpg'
import genesis from '../assets/collections/genesis.jpg'
import havoc from '../assets/collections/havoc.jpg'
import untamed from '../assets/collections/untamed.jpg'

export type Collection = {
  name: string
  /** The three-word mantra from the poster art. */
  triad: [string, string, string]
  blurb: string
  /** Pulled from each poster so a card lights up in its own world's colour. */
  accent: string
  image: string
}

export const collections: Collection[] = [
  {
    name: 'Aurum',
    triad: ['Myth', 'Power', 'Legacy'],
    blurb:
      'Gold-standard pieces for people who intend to be remembered. Heavy, deliberate, built like an heirloom.',
    accent: '#d9a441',
    image: aurum,
  },
  {
    name: 'Cipher',
    triad: ['Decrypt', 'Disrupt', 'Dominate'],
    blurb:
      'Encoded graphics for the ones who read between the lines. Technical, precise, nothing decorative.',
    accent: '#e8b44c',
    image: cipher,
  },
  {
    name: 'Genesis',
    triad: ['Origin', 'Creation', 'Evolution'],
    blurb:
      'Where it starts. Clean forms and first principles. The blank page before the noise.',
    accent: '#d8cbaa',
    image: genesis,
  },
  {
    name: 'Havoc',
    triad: ['Apathy', 'Chaos', 'Detachment'],
    blurb:
      'For the days you have run out of things to explain. Loud, unbothered, deliberately unhinged.',
    accent: '#d03a32',
    image: havoc,
  },
  {
    name: 'Untamed',
    triad: ['Wild', 'Free', 'Unleashed'],
    blurb: 'No leash, no apology. Raw brushwork for whoever refuses to be handled.',
    accent: '#bfc08e',
    image: untamed,
  },
]

// Flat list for the tag marquee: every collection name and mantra word.
export const collectionTags = collections.flatMap((c) => [c.name.toUpperCase(), ...c.triad])
