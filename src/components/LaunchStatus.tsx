type StepState = 'done' | 'active' | 'next'

type Step = {
  label: string
  note: string
  state: StepState
}

/**
 * Public-facing launch tracker. Move the `state` values along as things land:
 * flip 'active' to 'done' and the following step to 'active'.
 */
const steps: Step[] = [
  { label: 'Collections designed', note: 'Five worlds, locked', state: 'done' },
  { label: 'Artwork to print', note: 'Samples approved', state: 'done' },
  { label: 'Packaging', note: 'Sorted and signed off', state: 'done' },
  { label: 'We go live', note: 'Order online + socials', state: 'active' },
]

const stateLabel: Record<StepState, string> = {
  done: 'Complete',
  active: 'In progress',
  next: 'Up next',
}

export function LaunchStatus() {
  return (
    <section className="section status" id="status">
      <p className="eyebrow" data-reveal>
        Where we are
      </p>
      <h2 className="section__title status__title" data-reveal>
        Everything&rsquo;s in. All that&rsquo;s left is opening the doors.
      </h2>
      <p className="section__lede" data-reveal>
        The line is designed, the artwork is signed off, the tees are real and the packaging is
        sorted. Next stop is launch: we open for orders online and through our socials, and this
        page becomes the shop.
      </p>

      <ol className="steps" data-reveal>
        {steps.map((step) => (
          <li className={`step step--${step.state}`} key={step.label}>
            <span className="step__marker" aria-hidden="true" />
            <span className="step__label">{step.label}</span>
            <span className="step__note">{step.note}</span>
            <span className="sr-only">{stateLabel[step.state]}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
