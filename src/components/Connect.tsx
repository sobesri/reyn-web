import { sectionNumber } from '../constants/sections'
import { socialLinks } from '../constants/socials'
import { SocialIcon } from './Socials'

export function Connect() {
  return (
    <section className="section connect" id="connect">
      <div className="connect__panel" data-reveal>
        <p className="eyebrow">{sectionNumber('connect')} / Stay close</p>
        <h2 className="connect__title">Follow our socials for updates.</h2>
        <p className="connect__body">
          We sell online and through our socials, so that is where everything happens first: every
          drop, every restock, everything behind the scenes. Follow along and you&rsquo;ll know the
          moment we go live.
        </p>

        <ul className="connect__links">
          {socialLinks.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noopener noreferrer">
                <span className="connect__icon">
                  <SocialIcon label={social.label} />
                </span>
                <span className="connect__text">
                  <strong>{social.label}</strong>
                  <em>{social.handle}</em>
                </span>
                <span className="connect__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
