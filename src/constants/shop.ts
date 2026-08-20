/**
 * Order routing. Until a checkout provider is wired up, the buy button hands
 * the customer to WhatsApp (or Instagram as a fallback) with the piece, size
 * and quantity already written into the message.
 *
 * Set VITE_WHATSAPP_NUMBER in .env, digits only with country code,
 * e.g. 94771234567.
 */
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? ''

export const INSTAGRAM_URL = 'https://www.instagram.com/reynatelierofficial'

export function orderLink(productName: string, size: string, quantity: number) {
  if (!WHATSAPP_NUMBER) return INSTAGRAM_URL

  const message = `Hi REYN, I'd like to order ${quantity} x ${productName} in size ${size}.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const orderChannel = WHATSAPP_NUMBER ? 'WhatsApp' : 'Instagram'
