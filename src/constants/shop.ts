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
