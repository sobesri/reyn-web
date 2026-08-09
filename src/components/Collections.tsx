import type { CSSProperties } from 'react'
import { collections } from '../constants/collections'

export function Collections() {
  return (
    <section className="section collections" id="collections">
      <div className="section__head">
        <div>
          <p className="eyebrow" data-reveal>
            02 / Our collections
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
            <div className="world__poster">
              <img
                className="world__img"
                src={collection.image}
                alt={`${collection.name} collection poster`}
                loading="lazy"
                decoding="async"
              />
              <p className="world__blurb">{collection.blurb}</p>
            </div>

            <div className="world__meta">
              <span className="world__index">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="world__name display">{collection.name}</h3>
              <p className="world__triad">{collection.triad.join(' · ')}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
