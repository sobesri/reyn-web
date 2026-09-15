/**
 * The cart panel: everything picked up so far, and a single order for the
 * lot. Portalled to <body> for the same reason as Modal and Lightbox —
 * section elements set `z-index: 1` and would otherwise trap it under the
 * store nav.
 */

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { CURRENCY, formatPrice } from '../constants/products'
import {
  BULK_PROMO_MIN,
  BULK_PROMO_RATE,
  cartOrderMessage,
  qualifiesForBulkPromo,
  whatsappLink,
} from '../constants/shop'
import { itemFor, trackEvent } from '../lib/analytics'
import { lineKey, useCart, useCartItems } from './cart'
import { StoreImage } from './StoreImage'

const PROMO_PERCENT = Math.round(BULK_PROMO_RATE * 100)

export function CartDrawer() {
  const { isOpen } = useCart()
  return isOpen ? <CartPanel /> : null
}

function CartPanel() {
  const { close, setQuantity, remove, clear } = useCart()
  const { items, totals, dropped } = useCartItems()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [close])

  const message = cartOrderMessage(
    items.map((item) => ({
      productName: item.product.name,
      collection: item.product.collection,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    })),
    totals,
    formatPrice,
  )

  const canOrder = items.length > 0

  // The order is completed off-site, so this click is the last thing we can
  // measure. One begin_checkout for the whole cart, with every line as an
  // item, is what GA4's ecommerce reports expect.
  const trackOrder = (channel: string) => {
    trackEvent('begin_checkout', {
      currency: CURRENCY,
      value: totals.total,
      order_channel: channel,
      order_type: 'cart',
      discount: totals.discount,
      items: items.map((item) =>
        itemFor(item.product, {
          item_variant: `${item.color} / ${item.size}`,
          quantity: item.quantity,
        }),
      ),
    })
  }

  const shortOfPromo = BULK_PROMO_MIN - totals.units

  return createPortal(
    <div className="cart" role="dialog" aria-modal="true" aria-label="Your cart" onClick={close}>
      <div className="cart__panel" onClick={(event) => event.stopPropagation()}>
        <header className="cart__head">
          <div>
            <h2 className="cart__title">Your cart</h2>
            <p className="cart__count">
              {totals.units === 0
                ? 'Nothing in it yet'
                : `${totals.units} ${totals.units === 1 ? 'piece' : 'pieces'}`}
            </p>
          </div>

          <button className="cart__close" type="button" aria-label="Close the cart" onClick={close}>
            ✕
          </button>
        </header>

        {/* Introductory promo. Reads as an offer below the threshold and as a
            confirmation above it, so the same strip does both jobs. */}
        <p
          className={`cart__promo${qualifiesForBulkPromo(totals.units) ? ' is-earned' : ''}`}
          role="status"
        >
          <span className="cart__promo-tag">Intro offer</span>
          {qualifiesForBulkPromo(totals.units) ? (
            <span>
              {PROMO_PERCENT}% off applied — you saved {formatPrice(totals.discount)}.
            </span>
          ) : (
            <span>
              Order {BULK_PROMO_MIN} or more pieces and take an extra {PROMO_PERCENT}% off the
              total.
              {totals.units > 0 && (
                <>
                  {' '}
                  {shortOfPromo} more {shortOfPromo === 1 ? 'piece' : 'pieces'} to go.
                </>
              )}
            </span>
          )}
        </p>

        {dropped > 0 && (
          <p className="cart__notice" role="status">
            {dropped === 1 ? 'One piece has' : `${dropped} pieces have`} sold out since you added{' '}
            {dropped === 1 ? 'it' : 'them'}, and {dropped === 1 ? 'it is' : 'they are'} no longer in
            this order.
          </p>
        )}

        {items.length === 0 ? (
          <div className="cart__empty">
            <p>Add a few pieces and order them together in one message.</p>
            <Link className="btn btn--solid" to="/store" onClick={close}>
              Browse the store
            </Link>
          </div>
        ) : (
          <ul className="cart__lines">
            {items.map((item) => {
              const key = lineKey(item)
              return (
                <li className="cart__line" key={key}>
                  <Link
                    className="cart__thumb"
                    to={`/store/${item.slug}`}
                    onClick={close}
                    aria-label={`View ${item.product.name}`}
                  >
                    <StoreImage
                      publicId={item.product.images[item.color] ?? []}
                      alt=""
                      label={item.product.name}
                      sizes="72px"
                    />
                  </Link>

                  <div className="cart__line-body">
                    <Link className="cart__line-name" to={`/store/${item.slug}`} onClick={close}>
                      {item.product.name}
                    </Link>
                    <p className="cart__line-variant">
                      {item.color} / {item.size}
                    </p>
                    <p className="cart__line-price">{formatPrice(item.product.price)} each</p>
                    {item.inStock <= 3 && (
                      <p className="cart__line-low">Only {item.inStock} left</p>
                    )}
                  </div>

                  <div className="cart__line-side">
                    <div className="cart__stepper">
                      <button
                        type="button"
                        aria-label={`Remove one ${item.product.name}`}
                        onClick={() => setQuantity(key, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Add one ${item.product.name}`}
                        disabled={item.quantity >= item.inStock}
                        onClick={() => setQuantity(key, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <p className="cart__line-total">{formatPrice(item.lineTotal)}</p>

                    <button
                      className="cart__remove"
                      type="button"
                      onClick={() => remove(key)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {items.length > 0 && (
          <footer className="cart__foot">
            <dl className="cart__totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatPrice(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="cart__totals-promo">
                  <dt>Intro offer ({PROMO_PERCENT}% off)</dt>
                  <dd>−{formatPrice(totals.discount)}</dd>
                </div>
              )}
              <div className="cart__totals-due">
                <dt>Total</dt>
                <dd>{formatPrice(totals.total)}</dd>
              </div>
            </dl>

            <p className="cart__delivery">Delivery quoted when the order is confirmed.</p>

            <div className="cart__actions">
              <a
                className="btn btn--solid cart__order"
                href={canOrder ? whatsappLink(message) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOrder('WhatsApp')}
              >
                Order all on WhatsApp
              </a>
            </div>

            <div className="cart__foot-links">
              <button type="button" className="cart__clear" onClick={clear}>
                Empty cart
              </button>
              <span>Confirmed over WhatsApp</span>
            </div>
          </footer>
        )}
      </div>
    </div>,
    document.body,
  )
}
