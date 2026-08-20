import { orderChannel } from '../constants/shop'

const steps = [
  {
    label: 'Pick your world',
    note: 'Five collections, thirty designs. Black or white, S through XL.',
  },
  {
    label: 'Choose size and colour',
    note: 'Live stock on every piece, with the size guide one tap away.',
  },
  {
    label: 'Order and we ship',
    note: `Confirm over ${orderChannel}. Island-wide delivery from Colombo.`,
  },
]

export function Ordering() {
  return (
    <section className="section status" id="ordering">
      <p className="eyebrow" data-reveal>
        How it works
      </p>
      <h2 className="section__title status__title" data-reveal>
        Thirty designs. Pick your piece.
      </h2>
      <p className="section__lede" data-reveal>
        Every tee is a 240GSM oversized fit with a dropped shoulder, printed in limited runs. When a
        size sells out it is gone, so the stock you see is the stock we have.
      </p>

      <ol className="steps" data-reveal>
        {steps.map((step, i) => (
          <li className="step step--plain" key={step.label}>
            <span className="step__marker" aria-hidden="true" />
            <span className="step__index">{String(i + 1).padStart(2, '0')}</span>
            <span className="step__label">{step.label}</span>
            <span className="step__note">{step.note}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
