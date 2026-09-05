import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  CART_STORAGE_KEY,
  CartContext,
  lineKey,
  readStoredCart,
  type CartLine,
} from './cart'

/** Holds the cart for the whole app and writes every change to localStorage. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStoredCart)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // Storage is full or blocked. The cart still works for this session.
    }
  }, [lines])

  const add = useCallback((line: CartLine) => {
    setLines((current) => {
      const key = lineKey(line)
      const existing = current.find((entry) => lineKey(entry) === key)
      if (!existing) return [...current, line]
      // Adding the same colourway and size again tops the line up rather
      // than starting a second one.
      return current.map((entry) =>
        lineKey(entry) === key ? { ...entry, quantity: entry.quantity + line.quantity } : entry,
      )
    })
  }, [])

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((current) =>
      quantity < 1
        ? current.filter((entry) => lineKey(entry) !== key)
        : current.map((entry) => (lineKey(entry) === key ? { ...entry, quantity } : entry)),
    )
  }, [])

  const remove = useCallback((key: string) => {
    setLines((current) => current.filter((entry) => lineKey(entry) !== key))
  }, [])

  const clear = useCallback(() => setLines([]), [])
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const count = lines.reduce((sum, line) => sum + line.quantity, 0)

  const value = useMemo(
    () => ({ lines, count, add, setQuantity, remove, clear, isOpen, open, close }),
    [lines, count, add, setQuantity, remove, clear, isOpen, open, close],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
