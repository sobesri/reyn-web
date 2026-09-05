import { useEffect, useState, type CSSProperties } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { collections } from '../constants/collections'
import {
  availableColors,
  CURRENCY,
  availableSizes,
  formatPrice,
  isSoldOut,
  offeredColors,
  productSizes,
  stockFor,
  type ProductColor,
  type Size,
} from '../constants/products'
import {
  BULK_PROMO_MIN,
  BULK_PROMO_RATE,
  hasWhatsApp,
  INSTAGRAM_URL,
  orderChannel,
  orderMessage,
  whatsappLink,
} from '../constants/shop'
import { HowToOrder } from './HowToOrder'
import { SizeGuideButton } from './SizeGuideButton'
import { StoreImage } from './StoreImage'
import { StoreShell } from './StoreShell'
import { useProduct, useSwatch } from '../hooks/useCatalog'
import { usePageView } from '../hooks/usePageView'
import { itemFor, trackEvent } from '../lib/analytics'
import { useCart } from './cart'

export function ProductPage() {
  const { slug = '' } = useParams()
  // Keyed so moving between products remounts and clears the chosen colour,
  // size, quantity and image index instead of carrying them across.
  return <ProductView key={slug} slug={slug} />
}

function ProductView({ slug }: { slug: string }) {
  const product = useProduct(slug)
  const swatch = useSwatch()
  const navigate = useNavigate()
  const location = useLocation()

  // 'default' means this was the first entry, so there is nothing to go back to.
  const close = () => {
    if (location.key !== 'default') navigate(-1)
    else navigate('/store')
  }

  const inStockColors = product ? availableColors(product) : []
  // Only an explicit choice is stored. The colourway actually shown is derived
  // below, so a piece restocked in the live catalogue after this mounted picks
  // its first available colourway up on the next render.
  const [picked, setPicked] = useState<ProductColor | null>(null)
  const color = picked ?? inStockColors[0] ?? null
  const [activeImage, setActiveImage] = useState(0)
  const [size, setSize] = useState<Size | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [copied, setCopied] = useState<boolean | null>(null)
  // The selection that was last added, so the confirmation below the button
  // is derived rather than cleared by hand every time a choice changes.
  const [addedKey, setAddedKey] = useState<string | null>(null)
  const { add, open: openCart } = useCart()

  usePageView(product ? `${product.name} · ${product.collection}` : 'Not found')

  useEffect(() => {
    if (!product) return
    trackEvent('view_item', {
      currency: CURRENCY,
      value: product.price,
      items: [itemFor(product)],
    })
  }, [product])

  if (!product) {
    return (
      <StoreShell>
        <section className="section store-missing">
          <p className="eyebrow">404</p>
          <h1 className="section__title">We can&rsquo;t find that piece.</h1>
          <p className="section__lede">
            It may have sold out and been retired. Everything still available is in the store.
          </p>
          <Link className="btn btn--solid" to="/store">
            Back to the store
          </Link>
        </section>
      </StoreShell>
    )
  }

  const tint = collections.find((c) => c.name === product.collection)?.accent ?? 'var(--accent)'
  const soldOut = isSoldOut(product)
  const colorways = offeredColors(product)
  const gallery = (color && product.images[color]) || []
  const sizesForColor = availableSizes(product, color)
  // Sizes this piece is actually cut in, so a live catalogue piece with its
  // own run does not render four buttons where it only has two.
  const sizeRow = productSizes(product)
  const maxForSelection = stockFor(product, color, size)
  const canOrder = !soldOut && color !== null && size !== null && quantity > 0 && quantity <= maxForSelection

  const message =
    color && size
      ? orderMessage({
          productName: product.name,
          collection: product.collection,
          color,
          size,
          quantity,
        })
      : ''

  // The order is completed off-site, so this click is the last thing we can
  // measure. begin_checkout carries the variant and quantity so the store
  // report shows which colourway and size actually sell.
  const trackOrder = (channel: string) => {
    trackEvent('begin_checkout', {
      currency: CURRENCY,
      value: product.price * quantity,
      order_channel: channel,
      items: [
        itemFor(product, { item_variant: `${color} / ${size}`, quantity }),
      ],
    })
  }

  // What is selected right now. Comparing it to addedKey is what makes the
  // confirmation disappear the moment the colour, size or quantity moves on.
  const selectionKey = `${color}|${size}|${quantity}`
  const added = addedKey === selectionKey

  // Adding is silent — no drawer, no navigation — so several pieces can be
  // picked up in a row. The nav badge is the confirmation, with a line of
  // copy under the button for anyone who missed it.
  const addToCart = () => {
    if (!canOrder || !color || !size) return
    add({ slug: product.slug, color, size, quantity })
    setAddedKey(selectionKey)
    trackEvent('add_to_cart', {
      currency: CURRENCY,
      value: product.price * quantity,
      items: [itemFor(product, { item_variant: `${color} / ${size}`, quantity })],
    })
  }

  // Instagram cannot prefill a DM, so copy the details and open the profile.
  // Both calls stay inside the click so the popup blocker allows the tab.
  function orderViaInstagram() {
    trackOrder('Instagram')
    const copying = navigator.clipboard?.writeText(message)
    window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer')
    if (copying) copying.then(() => setCopied(true)).catch(() => setCopied(false))
    else setCopied(false)
  }

  return (
    <StoreShell>
      <section className="section product" style={{ '--tint': tint } as CSSProperties}>
        <div className="product__topbar">
          <nav className="product__crumbs" aria-label="Breadcrumb">
            <Link to="/store">Store</Link>
            <span aria-hidden="true">/</span>
            <span>{product.collection}</span>
          </nav>

          <button
            className="product__close"
            type="button"
            onClick={close}
            aria-label="Close and return to the store"
          >
            ✕
          </button>
        </div>

        <div className="product__layout">
          <div className="product__media">
            <div className="product__stage">
              <StoreImage
                publicId={gallery[activeImage]}
                alt={`${product.name}, view ${activeImage + 1}`}
                label={product.name}
                sizes="(max-width: 900px) 100vw, 560px"
                eager
              />
            </div>

            {gallery.length > 1 && (
              <ul className="product__thumbs">
                {gallery.map((image, i) => (
                  <li key={image}>
                    <button
                      type="button"
                      className={`product__thumb${i === activeImage ? ' is-active' : ''}`}
                      aria-label={`View image ${i + 1}`}
                      aria-pressed={i === activeImage}
                      onClick={() => setActiveImage(i)}
                    >
                      <StoreImage publicId={image} alt="" label={`${i + 1}`} sizes="80px" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="product__info">
            <span className="product__collection">{product.collection}</span>
            <h1 className="product__name">{product.name}</h1>

            <p className="product__price">
              {formatPrice(product.price)}
              {product.compareAtPrice && (
                <>
                  <s className="product__was">{formatPrice(product.compareAtPrice)}</s>
                  <span className="product__save">
                    Save {formatPrice(product.compareAtPrice - product.price)}
                  </span>
                </>
              )}
            </p>

            {product.compareAtPrice && (
              <p className="product__launch-note">Launch price, for a limited time only.</p>
            )}

            {product.description && <p className="product__desc">{product.description}</p>}

            <div className="product__picker">
              <div className="product__picker-head">
                <h2>Colour</h2>
                <span className="product__picked">{color ?? 'Sold out'}</span>
              </div>

              <div className="product__colors" role="group" aria-label="Choose a colour">
                {colorways.map((option) => {
                  const outOfStock = availableSizes(product, option).length === 0
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`product__color${color === option ? ' is-active' : ''}`}
                      style={{ '--swatch': swatch(option) } as CSSProperties}
                      disabled={outOfStock}
                      aria-pressed={color === option}
                      onClick={() => {
                        setPicked(option)
                        setSize(null)
                        setQuantity(1)
                      }}
                    >
                      <span className="product__color-dot" aria-hidden="true" />
                      <span>{option}</span>
                      {outOfStock && <span className="sr-only"> sold out</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="product__picker">
              <div className="product__picker-head">
                <h2>Size</h2>
                <SizeGuideButton />
              </div>

              <div className="product__size-row" role="group" aria-label="Choose a size">
                {sizeRow.map((option) => {
                  const left = stockFor(product, color, option)
                  const disabled = left === 0
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`product__size${size === option ? ' is-active' : ''}`}
                      disabled={disabled}
                      aria-pressed={size === option}
                      onClick={() => {
                        setSize(option)
                        setQuantity(1)
                      }}
                    >
                      {option}
                      {disabled && <span className="sr-only"> unavailable</span>}
                    </button>
                  )
                })}
              </div>

              <p className="product__stock" role="status">
                {soldOut
                  ? 'Every colourway is sold out. Follow along for the restock.'
                  : size
                    ? maxForSelection <= 3
                      ? `Only ${maxForSelection} left in ${color} ${size}`
                      : `${maxForSelection} in stock`
                    : `${color} available in ${sizesForColor.join(', ')}`}
              </p>
            </div>

            {!soldOut && (
              <div className="product__qty">
                <label htmlFor="qty">Quantity</label>
                <input
                  id="qty"
                  type="number"
                  min={1}
                  max={Math.max(1, maxForSelection)}
                  value={quantity}
                  disabled={!size}
                  onChange={(e) => {
                    const next = Number(e.target.value)
                    setQuantity(
                      Number.isNaN(next) ? 1 : Math.min(Math.max(1, next), maxForSelection || 1),
                    )
                  }}
                />
              </div>
            )}

            {!soldOut && (
              <div className="product__cart">
                <button
                  type="button"
                  className="product__add"
                  disabled={!canOrder}
                  onClick={addToCart}
                >
                  {size ? 'Add to cart' : 'Select a size to add'}
                </button>

                <p className="product__cart-note" role="status">
                  {added ? (
                    <>
                      Added.{' '}
                      <button type="button" className="product__cart-link" onClick={openCart}>
                        View cart
                      </button>{' '}
                      to order everything in one message.
                    </>
                  ) : (
                    <>
                      Buying a few? Add them up and order together — {BULK_PROMO_MIN} or more
                      pieces takes an extra {Math.round(BULK_PROMO_RATE * 100)}% off.
                    </>
                  )}
                </p>
              </div>
            )}

            <div className="product__order">
              {hasWhatsApp ? (
                <>
                  <a
                    className={`btn btn--solid product__buy${canOrder ? '' : ' is-disabled'}`}
                    href={canOrder ? whatsappLink(message) : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!canOrder}
                    onClick={(e) => {
                      if (!canOrder) {
                        e.preventDefault()
                        return
                      }
                      trackOrder('WhatsApp')
                    }}
                  >
                    {soldOut ? 'Sold out' : size ? 'Order on WhatsApp' : 'Select a size'}
                  </a>

                  {/* Secondary channel: the same order, sent as an Instagram DM. */}
                  <button
                    type="button"
                    className="product__buy-alt"
                    disabled={!canOrder}
                    onClick={orderViaInstagram}
                  >
                    Order on Instagram
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={`btn btn--solid product__buy${canOrder ? '' : ' is-disabled'}`}
                  disabled={!canOrder}
                  onClick={orderViaInstagram}
                >
                  {soldOut ? 'Sold out' : size ? 'Order on Instagram' : 'Select a size'}
                </button>
              )}
            </div>

            {copied !== null && (
              <div className="product__copied" role="status">
                {copied ? (
                  <p>Order details copied. Paste them into the DM and send.</p>
                ) : (
                  <>
                    <p>Copy these details into the DM:</p>
                    <pre>{message}</pre>
                  </>
                )}
              </div>
            )}

            <p className="product__note">
              Orders are confirmed over {orderChannel}. Island-wide delivery from Colombo.{' '}
              <HowToOrder />
            </p>
          </div>
        </div>
      </section>
    </StoreShell>
  )
}
