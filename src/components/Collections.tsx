import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { collections } from '../constants/collections'
import { sectionNumber } from '../constants/sections'
import { trackEvent } from '../lib/analytics'

export function Collections() {
  return (
    <section className="section collections" id="collections">
      <div className="section__head">
        <div>
          <p className="eyebrow" data-reveal>
            {sectionNumber('collections')} / Our collections
          </p>
          <h2 className="section__title display" data-reveal>
            One vision. Five worlds.
          </h2>
        </div>
        <p className="section__note" data-reveal>
          Each drop belongs to one of five worlds, and each world has its own rules. Find yours.
        </p>
      </div>

      <ul className="worlds">
        {collections.map((collection, i) => (
          <li
            className="world"
            key={collection.name}
            data-reveal
            style={{ '--tint': collection.accent, '--delay': `${i * 0.06}s` } as CSSProperties}
          >
            {/* The whole card is the target, so the label names the destination
                rather than reading out the poster, blurb and triad in turn. */}
            <Link
              className="world__link"
              to={`/store?collection=${collection.name}`}
              aria-label={`View ${collection.name} designs`}
              onClick={() =>
                trackEvent('select_content', {
                  content_type: 'collection',
                  item_id: collection.name,
                })
              }
            >
              <div className="world__poster">
                <img
                  className="world__img"
                  src={collection.image}
                  alt={`${collection.name} collection poster`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="world__cta" aria-hidden="true">
                  View designs
                </span>
                <p className="world__blurb">{collection.blurb}</p>
              </div>

              <div className="world__meta">
                <span className="world__index">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="world__name display">{collection.name}</h3>
                <p className="world__triad">{collection.triad.join(' · ')}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
