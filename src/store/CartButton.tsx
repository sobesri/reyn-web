import { useCart, useCartItems } from './cart'

/** Opens the cart, and carries the unit count as a badge once there is one. */
export function CartButton() {
  const { open } = useCart()
  // Counted from the resolved items rather than the stored lines, so a piece
  // that has since sold out is not still counted on the badge when the cart
  // itself has already dropped it.
  const { totals } = useCartItems()
  const count = totals.units

  return (
    <button
      className="cart-btn"
      type="button"
      onClick={open}
      aria-label={count === 0 ? 'Open your cart, empty' : `Open your cart, ${count} in it`}
    >
      <span>Cart</span>
      {count > 0 && (
        <span className="cart-btn__count" aria-hidden="true">
          {count}
        </span>
      )}
    </button>
  )
}
