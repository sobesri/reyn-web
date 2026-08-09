import { useState } from 'react'
import { sectionNumber } from '../constants/sections'
import { features, measurements, sizeChartPoster, sizes } from '../constants/sizing'
import { Lightbox } from './Lightbox'

const poster = [{ src: sizeChartPoster, title: 'REYN oversized t-shirt size chart' }]

export function SizeChart() {
  const [posterOpen, setPosterOpen] = useState(false)

  return (
    <section className="section sizing" id="sizing">
      <div className="section__head">
        <div>
          <p className="eyebrow" data-reveal>
            {sectionNumber('sizing')} / Fit &amp; sizing
          </p>
          <h2 className="section__title" data-reveal>
            One cut, four sizes, no guesswork.
          </h2>
        </div>
        <p className="section__note" data-reveal>
          Every REYN tee is a 240GSM oversized fit with a dropped shoulder. Measure a tee you
          already like and match it to the table.
        </p>
      </div>

      <div className="sizing__grid">
        <div className="sizing__table-card" data-reveal>
          <div className="sizing__table-head">
            <h3 className="sizing__card-title">Size chart</h3>
            <span className="sizing__unit">All measurements in inches</span>
          </div>

          {/* Narrow screens scroll the table rather than crushing the columns. */}
          <div className="sizing__scroll">
            <table className="sizing__table">
              <caption className="sr-only">
                REYN oversized t-shirt measurements in inches, by size
              </caption>
              <thead>
                <tr>
                  <th scope="col">Size</th>
                  {sizes.map((size) => (
                    <th scope="col" key={size}>
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {measurements.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.values.map((value, i) => (
                      <td key={sizes[i]}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="sizing__poster-btn" type="button" onClick={() => setPosterOpen(true)}>
            <img className="sizing__thumb" src={sizeChartPoster} alt="" loading="lazy" decoding="async" />
            <span>
              <strong>View the full size chart</strong>
              <em>Diagrams, measuring guide and product spec</em>
            </span>
            <span className="sizing__expand" aria-hidden="true">
              ⤢
            </span>
          </button>
        </div>

        <div className="sizing__side">
          <div className="sizing__card" data-reveal>
            <h3 className="sizing__card-title">How to measure</h3>
            <dl className="sizing__how">
              {measurements.map((row) => (
                <div className="sizing__how-row" key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.how}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="sizing__card" data-reveal>
            <h3 className="sizing__card-title">Product features</h3>
            <ul className="sizing__features">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Lightbox
        items={poster}
        index={posterOpen ? 0 : null}
        onIndexChange={() => {}}
        onClose={() => setPosterOpen(false)}
      />
    </section>
  )
}
