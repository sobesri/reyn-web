import { useState } from 'react'
import { artworks } from '../constants/artworks'
import { sectionNumber } from '../constants/sections'
import { Lightbox } from './Lightbox'

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Nothing to show until artwork is dropped into src/assets/artwork.
  if (artworks.length === 0) return null

  return (
    <section className="section gallery" id="gallery">
      <div className="section__head">
        <div>
          <p className="eyebrow" data-reveal>
            {sectionNumber('gallery')} / The artwork
          </p>
          <h2 className="section__title" data-reveal>
            Every tee starts as a drawing.
          </h2>
        </div>
        <p className="section__note" data-reveal>
          A look at the pieces going to print. Tap any one to see it full size.
        </p>
      </div>

      <div className="gallery__grid">
        {artworks.map((artwork, i) => (
          <figure className="art" key={artwork.src} data-reveal>
            <button
              className="art__button"
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`View ${artwork.title} full size`}
            >
              <img className="art__img" src={artwork.src} alt={artwork.title} loading="lazy" decoding="async" />
            </button>
            <figcaption className="art__meta">
              <span className="art__title">{artwork.title}</span>
              {artwork.collection && <span className="art__collection">{artwork.collection}</span>}
            </figcaption>
          </figure>
        ))}
      </div>

      <Lightbox
        items={artworks}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </section>
  )
}
