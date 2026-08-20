import { useState } from 'react'
import { Modal } from '../components/Modal'
import { hasWhatsApp, INSTAGRAM_URL, orderChannel } from '../constants/shop'

const HANDLE = '@reynatelierofficial'

/** Steps differ by channel: WhatsApp prefills, Instagram needs a paste. */
const steps = hasWhatsApp
  ? [
      { title: 'Pick your colour', body: 'Black or white, whichever is in stock for this piece.' },
      { title: 'Choose your size', body: 'S to XL. Sizes we are out of are greyed out.' },
      { title: 'Set the quantity', body: 'Capped at the number we actually have on hand.' },
      {
        title: 'Tap "Order on WhatsApp"',
        body: 'Your order opens as a ready-written message. Just hit send and we will confirm.',
      },
    ]
  : [
      { title: 'Pick your colour', body: 'Black or white, whichever is in stock for this piece.' },
      { title: 'Choose your size', body: 'S to XL. Sizes we are out of are greyed out.' },
      { title: 'Set the quantity', body: 'Capped at the number we actually have on hand.' },
      {
        title: 'Tap "Order Via Instagram"',
        body: `Your order details are copied to your clipboard automatically. Paste them into a message to ${HANDLE} and we will confirm.`,
      },
    ]

export function HowToOrder() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="size-guide-btn product__how-link" type="button" onClick={() => setOpen(true)}>
        How to order
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="How to order">
        <ol className="modal__steps">
          {steps.map((step, i) => (
            <li key={step.title}>
              <span className="modal__step-num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {!hasWhatsApp && (
          <p className="modal__foot">
            Message us at{' '}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              {HANDLE}
            </a>
            . If your browser blocks the copy, we show the details on screen so you can copy them by
            hand.
          </p>
        )}

        {hasWhatsApp && (
          <p className="modal__foot">Orders are confirmed over {orderChannel}, then shipped island-wide from Colombo.</p>
        )}
      </Modal>
    </>
  )
}
