import aurum from '../assets/collections/aurum.png'
import cipher from '../assets/collections/cipher.png'
import genesis from '../assets/collections/genesis.png'
import havoc from '../assets/collections/havoc.png'
import untamed from '../assets/collections/untamed.png'

/** The five worlds. Product tags are constrained to these. */
export type CollectionName = 'Aurum' | 'Cipher' | 'Genesis' | 'Havoc' | 'Untamed'

export type Collection = {
  name: CollectionName
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
      'Everyone has a beast within. Choose your legend. Wear your power.',
    accent: '#d9a441',
    image: aurum,
  },
  {
    name: 'Cipher',
    triad: ['Decrypt', 'Disrupt', 'Dominate'],
    blurb:
      'Reality was never meant to stay intact. Break the code. Become the anomaly.',
    accent: '#e02128',
    image: cipher,
  },
  {
    name: 'Genesis',
    triad: ['Origin', 'Creation', 'Evolution'],
    blurb:
      'Some calling are older than memory. Choose your origin. Make it yours.',
    accent: '#cdd5db',
    image: genesis,
  },
  {
    name: 'Havoc',
    triad: ['Apathy', 'Chaos', 'Detachment'],
    blurb:
      'Probably shouldn\'t say it? Might as well wear it.',
    accent: '#ee6a1f',
    image: havoc,
  },
  {
    name: 'Untamed',
    triad: ['Wild', 'Free', 'Unleashed'],
    blurb: 'Different by insitnct. Untamed by choice.',
    accent: '#93d926',
    image: untamed,
  },
]

// Flat list for the tag marquee: every collection name and mantra word.
export const collectionTags = collections.flatMap((c) => [c.name.toUpperCase(), ...c.triad])
