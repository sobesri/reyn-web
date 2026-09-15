import { useState } from 'react'
import { Modal } from '../components/Modal'

const steps = [
  { title: 'Pick your colour', body: 'Black or white, whichever is in stock for this piece.' },
  { title: 'Choose your size', body: 'S to XL. Sizes we are out of are greyed out.' },
  { title: 'Set the quantity', body: 'Capped at the number we actually have on hand.' },
  {
    title: 'Tap "Order on WhatsApp"',
    body: 'Your order opens as a ready-written message. Just hit send and we will confirm.',
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

        <p className="modal__foot">
          Orders are confirmed over WhatsApp, then shipped island-wide from Colombo.
        </p>
      </Modal>
    </>
  )
}
