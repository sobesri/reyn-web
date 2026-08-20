import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import reynLogo from '../assets/reyn-logo-2.png'
import { socialLinks } from '../constants/socials'
import { SocialIcon } from '../components/Socials'
import { SizeGuideButton } from './SizeGuideButton'

/** Header, footer and page chrome shared by every store route. */
export function StoreShell({ children }: { children: ReactNode }) {
  return (
    <div className="site store">
      <div className="grain" aria-hidden="true" />

      <header className="store-nav">
        <div className="store-nav__inner">
          <Link className="store-nav__brand" to="/" aria-label="REYN. home">
            <span className="footer__mark">
              <img src={reynLogo} alt="" className="footer__logo" />
            </span>
          </Link>

          <nav className="store-nav__links">
            <Link to="/store">Store</Link>
            <Link to="/#collections">Collections</Link>
            <SizeGuideButton />
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__top">
            <div className="footer__brand">
              <p className="footer__tag">Redefine the Standard · Colombo, Sri Lanka</p>
            </div>

            <ul className="footer__socials">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <span className="footer__icon">
                      <SocialIcon label={social.label} />
                    </span>
                    <span className="footer__social-text">
                      <strong>{social.label}</strong>
                      <em>{social.handle}</em>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="footer__legal">
            © {new Date().getFullYear()} REYN. Atelier. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
