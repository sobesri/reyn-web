import { useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { collections, type CollectionName } from '../constants/collections'
import {
  availableColors,
  colorSwatch,
  coverImages,
  formatPrice,
  isSoldOut,
  offeredColors,
  products,
  sizesInStock,
} from '../constants/products'
import { StoreImage } from './StoreImage'
import { StoreShell } from './StoreShell'
import { usePageView } from '../hooks/usePageView'
import { itemFor, trackEvent } from '../lib/analytics'

type Filter = CollectionName | 'All'

const tintFor = (name: CollectionName) =>
  collections.find((c) => c.name === name)?.accent ?? 'var(--accent)'

export function StoreIndex() {
  const [filter, setFilter] = useState<Filter>('All')
  usePageView('Store')

  const visible = useMemo(
    () => (filter === 'All' ? products : products.filter((p) => p.collection === filter)),
    [filter],
  )

  return (
    <StoreShell>
      <section className="section store-head">
        <div className="section__head">
          <div>
            <p className="eyebrow">The store</p>
            <h1 className="section__title">Wear your world.</h1>
          </div>
          <p className="section__note store-head__note">
            Every piece is a 240GSM oversized tee with a dropped shoulder, cut the same way across
            all five worlds. Limited runs, so when a size is gone it is gone.
          </p>
        </div>
      </section>

      <section className="section store-list">
        <div className="store-filters" role="group" aria-label="Filter by collection">
          {(['All', ...collections.map((c) => c.name)] as Filter[]).map((option) => (
            <button
              key={option}
              type="button"
              className={`store-filter${filter === option ? ' is-active' : ''}`}
              style={option === 'All' ? undefined : { '--tint': tintFor(option as CollectionName) } as CSSProperties}
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="store-empty">Nothing in this world yet. Check back soon.</p>
        ) : (
          <ul className="store-grid">
            {visible.map((product) => {
              const soldOut = isSoldOut(product)
              const colorsLeft = availableColors(product)
              const colorways = offeredColors(product)
              const sizesLeft = sizesInStock(product)

              return (
                <li
                  className="product-card"
                  key={product.slug}
                  style={{ '--tint': tintFor(product.collection) } as CSSProperties}
                >
                  <Link
                    to={`/store/${product.slug}`}
                    onClick={() =>
                      trackEvent('select_item', {
                        item_list_name: `Store · ${filter}`,
                        items: [itemFor(product)],
                      })
                    }
                  >
                    <div className="product-card__media">
                      <StoreImage
                        publicId={coverImages(product)}
                        alt={product.name}
                        label={product.name}
                      />
                      <span className="product-card__collection">{product.collection}</span>
                      {soldOut && <span className="product-card__flag">Sold out</span>}
                    </div>

                    <div className="product-card__body">
                      <h2 className="product-card__name">{product.name}</h2>
                      <p className="product-card__price">
                        {formatPrice(product.price)}
                        {product.compareAtPrice && (
                          <s className="product-card__was">{formatPrice(product.compareAtPrice)}</s>
                        )}
                      </p>
                      <p className="product-card__sizes">
                        {soldOut ? 'Restocking soon' : sizesLeft.join(' · ')}
                      </p>

                      <ul className="product-card__swatches" aria-hidden="true">
                        {colorways.map((colorway) => (
                          <li
                            key={colorway}
                            className={colorsLeft.includes(colorway) ? '' : 'is-out'}
                            style={{ '--swatch': colorSwatch[colorway] } as CSSProperties}
                          />
                        ))}
                      </ul>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </StoreShell>
  )
}
