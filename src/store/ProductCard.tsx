import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  availableColors,
  coverImages,
  formatPrice,
  isSoldOut,
  offeredColors,
  sizesInStock,
  type Product,
} from '../constants/products'
import { StoreImage } from './StoreImage'
import { useSwatch } from '../hooks/useCatalog'
import { useTint } from '../hooks/useTint'
import { itemFor, trackEvent } from '../lib/analytics'

type ProductCardProps = {
  product: Product
  /** Names the surface in analytics, e.g. "Store · Aurum" or "Featured". */
  listName: string
  /** Wrapper element, so the grid can keep its <li> and the deck its own. */
  as?: 'li' | 'div'
  className?: string
  /** Extra inline custom properties, merged over the card's own --tint. */
  style?: CSSProperties
  /**
   * Returning false from here cancels the navigation — the deck uses it to
   * bring a side card to the front instead of opening it.
   */
  onNavigate?: () => boolean | void
  /** Pulled out of the tab order while the card is parked behind the deck. */
  inert?: boolean
  /** Rendered inside the media frame, above the artwork. */
  children?: ReactNode
}

/** One piece as it appears in a listing: artwork, name, price and what is left. */
export function ProductCard({
  product,
  listName,
  as: Wrapper = 'li',
  className = '',
  style,
  onNavigate,
  inert,
  children,
}: ProductCardProps) {
  const swatch = useSwatch()
  const tintFor = useTint()

  const soldOut = isSoldOut(product)
  const colorsLeft = availableColors(product)
  const colorways = offeredColors(product)
  const sizesLeft = sizesInStock(product)

  return (
    <Wrapper
      className={`product-card${className ? ` ${className}` : ''}`}
      style={{ '--tint': tintFor(product.collection), ...style } as CSSProperties}
    >
      <Link
        to={`/store/${product.slug}`}
        tabIndex={inert ? -1 : undefined}
        aria-hidden={inert || undefined}
        onClick={(event) => {
          if (onNavigate?.() === false) {
            event.preventDefault()
            return
          }
          trackEvent('select_item', {
            item_list_name: listName,
            items: [itemFor(product)],
          })
        }}
      >
        <div className="product-card__media">
          <StoreImage publicId={coverImages(product)} alt={product.name} label={product.name} />
          <span className="product-card__collection">{product.collection}</span>
          {soldOut && <span className="product-card__flag">Sold out</span>}
          {children}
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
                style={{ '--swatch': swatch(colorway) } as CSSProperties}
              />
            ))}
          </ul>
        </div>
      </Link>
    </Wrapper>
  )
}
