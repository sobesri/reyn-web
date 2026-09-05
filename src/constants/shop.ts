/**
 * Order routing.
 *
 * WhatsApp supports prefilled text via wa.me, so an order arrives fully
 * written. Instagram has no public equivalent: there is no supported way to
 * prefill a DM from a link. For Instagram we copy the details to the
 * clipboard and open the profile, so the customer only has to paste.
 *
 * Set VITE_WHATSAPP_NUMBER in .env, digits only with country code,
 * e.g. 94771234567.
 */
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? ''

export const INSTAGRAM_URL = 'https://www.instagram.com/reynatelierofficial'

export const hasWhatsApp = WHATSAPP_NUMBER.length > 0

export const orderChannel = hasWhatsApp ? 'WhatsApp' : 'Instagram'

type OrderDetails = {
  productName: string
  collection: string
  color: string
  size: string
  quantity: number
}

/** The message a customer sends, used for both channels. */
export function orderMessage({ productName, collection, color, size, quantity }: OrderDetails) {
  return [
    'Hi, I would like to order:',
    '',
    `Item: ${productName} (${collection})`,
    `Colour: ${color}`,
    `Size: ${size}`,
    `Quantity: ${quantity}`,
  ].join('\n')
}

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

/**
 * Introductory bulk promo: BULK_PROMO_MIN pieces or more in one order takes
 * BULK_PROMO_RATE off the whole total. Counted on units, not on distinct
 * pieces, so five of one design qualifies exactly like five different ones.
 *
 * The discount is quoted in the cart and written into the order message, but
 * it is applied by hand when the order is confirmed over WhatsApp or
 * Instagram — there is no checkout here to apply it for us.
 */
export const BULK_PROMO_MIN = 5
export const BULK_PROMO_RATE = 0.05

export function qualifiesForBulkPromo(units: number) {
  return units >= BULK_PROMO_MIN
}

export type OrderTotals = {
  units: number
  subtotal: number
  /** Zero unless the order clears BULK_PROMO_MIN. */
  discount: number
  total: number
}

export function orderTotals(lines: { price: number; quantity: number }[]): OrderTotals {
  const units = lines.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
  // Rounded to the rupee: the total is quoted to a person, not to a gateway.
  const discount = qualifiesForBulkPromo(units) ? Math.round(subtotal * BULK_PROMO_RATE) : 0
  return { units, subtotal, discount, total: subtotal - discount }
}

export type CartOrderLine = {
  productName: string
  collection: string
  color: string
  size: string
  quantity: number
}

/**
 * One message covering a whole cart. Same two channels as a single order:
 * prefilled for WhatsApp, copied to the clipboard for Instagram.
 */
export function cartOrderMessage(
  lines: CartOrderLine[],
  totals: OrderTotals,
  money: (amount: number) => string,
) {
  const items = lines.map(
    (line, i) =>
      `${i + 1}. ${line.productName} (${line.collection}) — ${line.color} / ${line.size} × ${line.quantity}`,
  )

  const summary = [`Subtotal: ${money(totals.subtotal)}`]
  if (totals.discount > 0) {
    summary.push(
      `Intro promo (${Math.round(BULK_PROMO_RATE * 100)}% off, ${BULK_PROMO_MIN}+ pieces): -${money(totals.discount)}`,
    )
  }
  summary.push(`Total: ${money(totals.total)}`)

  return [
    `Hi, I would like to order ${totals.units} ${totals.units === 1 ? 'piece' : 'pieces'}:`,
    '',
    ...items,
    '',
    ...summary,
  ].join('\n')
}
