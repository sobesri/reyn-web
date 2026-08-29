import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import reynLogo from '../assets/reyn-logo-2.png'
import { useDesignCount } from '../hooks/useDesignCount'

export function Hero() {
  const designs = useDesignCount()

  return (
    <section className="hero" id="top">
      <div className="hero__aurora" aria-hidden="true">
        <span className="hero__blob hero__blob--a" />
        <span className="hero__blob hero__blob--b" />
      </div>

      {/* Technical framing marks, lifted from the collection poster art. */}
      <div className="hud" aria-hidden="true">
        <span className="hud__corner hud__corner--tl" />
        <span className="hud__corner hud__corner--tr" />
        <span className="hud__corner hud__corner--bl" />
        <span className="hud__corner hud__corner--br" />
        <span className="hud__label hud__label--l">Redefine the Standard</span>
        <span className="hud__label hud__label--r">Colombo · LK</span>
      </div>

      <div className="hero__inner">
        <img
          src={reynLogo}
          alt="REYN. Redefine the Standard"
          className="hero__logo"
          style={{ '--delay': '0.15s' } as CSSProperties}
        />

        <h1 className="hero__headline" style={{ '--delay': '0.3s' } as CSSProperties}>
          Premium oversized tees,
          <br />
          <em>cut for the way Colombo actually lives.</em>
        </h1>

        <p className="hero__sub" style={{ '--delay': '0.4s' } as CSSProperties}>
          One vision, five worlds. {designs} designs in heavyweight cotton, shipping island-wide.
        </p>

        <div className="hero__actions" style={{ '--delay': '0.5s' } as CSSProperties}>
          <Link className="btn btn--solid" to="/store">
            Shop the store
          </Link>
          <a className="btn btn--ghost" href="#collections">
            See the collections
          </a>
        </div>
      </div>

      <a className="scroll-cue" href="#manifesto" aria-label="Scroll to learn more">
        <span>Scroll</span>
        <span className="scroll-cue__line" aria-hidden="true" />
      </a>
    </section>
  )
}
