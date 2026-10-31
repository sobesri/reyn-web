import { useMemo, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router-dom'
import { collections, type CollectionName } from '../constants/collections'
import { FeaturedDeck } from './FeaturedDeck'
import { ProductCard } from './ProductCard'
import { StoreShell } from './StoreShell'
import { useCatalog } from '../hooks/useCatalog'
import { useTint } from '../hooks/useTint'
import { usePageView } from '../hooks/usePageView'

type Filter = CollectionName | 'All'

const isCollection = (value: string): value is CollectionName =>
  collections.some((c) => c.name === value)

export function StoreIndex() {
  // The filter lives in the URL so a collection card on the landing page can
  // link straight to its own world, and so a filtered store stays shareable
  // and survives the back button.
  const [params, setParams] = useSearchParams()
  const requested = params.get('collection') ?? ''
  const filter: Filter = isCollection(requested) ? requested : 'All'

  const setFilter = (next: Filter) => {
    // Replace, not push, so the chips do not fill the history stack: one back
    // press from the store returns to wherever the visitor came from.
    if (next === 'All') setParams({}, { replace: true })
    else setParams({ collection: next }, { replace: true })
  }

  usePageView('Reyn Atelier - Store', { exact: true })

  // Statsig can correct stock and pricing here between deploys; the bundled
  // catalogue is what renders until it does.
  const catalog = useCatalog()
  const tintFor = useTint()

  const visible = useMemo(
    () => (filter === 'All' ? catalog : catalog.filter((p) => p.collection === filter)),
    [catalog, filter],
  )

  return (
    <StoreShell>
      <h1 className="sr-only">Reyn Atelier — Store</h1>

      <FeaturedDeck />

      <section className="section store-list" aria-labelledby="browse-title">
        <h2 className="section__title store-list__title" id="browse-title">
          Browse our collection
        </h2>

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
            {visible.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                listName={`Store · ${filter}`}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="section store-note">
        <p className="store-note__text">
          Every piece is a 240GSM oversized tee with a dropped shoulder, cut the same way across
          all five worlds. Limited runs, so when a size is gone it is gone.
        </p>
      </section>
    </StoreShell>
  )
}
