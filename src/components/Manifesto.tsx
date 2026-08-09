import type { CSSProperties } from 'react'

const pillars = [
  {
    title: 'Heavyweight cotton',
    body: 'Dense, opaque, holds its shape after the tenth wash. No transparent shoulders, no shrink surprises.',
  },
  {
    title: 'A cut that means it',
    body: 'Properly boxy. Dropped shoulders, wide body, hem that sits where it should. Oversized by design, not by accident.',
  },
  {
    title: 'Limited drops',
    body: 'Small runs, then gone. What you wear should not be on every third person in the room.',
  },
]

export function Manifesto() {
  return (
    <section className="section manifesto" id="manifesto">
      <p className="eyebrow" data-reveal>
        01 / What is REYN
      </p>

      <h2 className="section__title" data-reveal>
        Streetwear built in Sri Lanka, made to outlast the trend that sold it to you.
      </h2>

      <p className="section__lede" data-reveal>
        REYN. Atelier is a new label out of Colombo making the essentials people actually reach for:
        tees you can wear on a Tuesday, at a gig, or three years from now. No filler, no fast-fashion
        maths, no compromise on the blank.
      </p>

      <ul className="pillars">
        {pillars.map((pillar, i) => (
          <li className="pillar" key={pillar.title} data-reveal style={{ '--delay': `${i * 0.1}s` } as CSSProperties}>
            <span className="pillar__num">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="pillar__title">{pillar.title}</h3>
            <p className="pillar__body">{pillar.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
