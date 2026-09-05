/**
 * The cart: types, storage and the hooks that read it. The provider itself
 * lives in CartProvider.tsx, which keeps this module free of components so
 * both sides survive a fast-refresh edit.
 *
 * Only the choice itself is stored — slug, colourway, size, quantity — never
 * a price or a name. Everything displayed is resolved against the live
 * catalogue at render time, so a piece that is repriced, renamed or restocked
 * in Statsig is correct in a cart that was filled before the change, and a
 * piece that is withdrawn drops out of the cart instead of ordering something
 * that no longer exists.
 *
 * Quantities are clamped to stock on the way in and again on the way out, so
 * a cart left open in a tab overnight cannot order units that have since
 * sold.
 */

import { createContext, useContext, useMemo } from 'react'
import { stockFor, type Product, type ProductColor, type Size } from '../constants/products'
import { orderTotals, type OrderTotals } from '../constants/shop'
import { useCatalog } from '../hooks/useCatalog'

export type CartLine = {
  slug: string
  color: ProductColor
  size: Size
  quantity: number
}

/** A cart line joined to the piece it refers to, with stock applied. */
export type CartItem = CartLine & {
  product: Product
  /** Units on hand for this exact colourway and size, right now. */
  inStock: number
  lineTotal: number
}

export const CART_STORAGE_KEY = 'reyn.cart.v1'

/** Identity of a line: the same piece in another size is a separate line. */
export function lineKey(line: { slug: string; color: string; size: string }) {
  return `${line.slug}|${line.color}|${line.size}`
}

/** Whatever survived in localStorage, with anything malformed discarded. */
export function readStoredCart(): CartLine[] {
  // Private mode and storage-blocking browsers throw on access, and a cart is
  // never worth failing a page render over.
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((entry) => {
      if (typeof entry !== 'object' || entry === null) return []
      const { slug, color, size, quantity } = entry as Record<string, unknown>
      if (typeof slug !== 'string' || typeof color !== 'string' || typeof size !== 'string') {
        return []
      }
      const units = Math.floor(Number(quantity))
      if (!Number.isFinite(units) || units < 1) return []
      return [{ slug, color, size, quantity: units }]
    })
  } catch {
    return []
  }
}

export type CartApi = {
  lines: CartLine[]
  /** Units in the cart, across every line. */
  count: number
  add: (line: CartLine) => void
  setQuantity: (key: string, quantity: number) => void
  remove: (key: string) => void
  clear: () => void
  isOpen: boolean
  open: () => void
  close: () => void
}

export const CartContext = createContext<CartApi | null>(null)

export function useCart(): CartApi {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('useCart must be used inside a CartProvider')
  return cart
}

/**
 * Cart lines resolved against the live catalogue. Lines whose piece or
 * colourway has gone are dropped, and quantities are capped at what is
 * actually on hand.
 */
export function useCartItems(): { items: CartItem[]; totals: OrderTotals; dropped: number } {
  const { lines } = useCart()
  const catalog = useCatalog()

  return useMemo(() => {
    const items: CartItem[] = []
    let dropped = 0

    for (const line of lines) {
      const product = catalog.find((entry) => entry.slug === line.slug)
      const inStock = product ? stockFor(product, line.color, line.size) : 0
      if (!product || inStock === 0) {
        dropped += 1
        continue
      }
      const quantity = Math.min(line.quantity, inStock)
      items.push({ ...line, quantity, product, inStock, lineTotal: product.price * quantity })
    }

    const totals = orderTotals(
      items.map((item) => ({ price: item.product.price, quantity: item.quantity })),
    )

    return { items, totals, dropped }
  }, [lines, catalog])
}
