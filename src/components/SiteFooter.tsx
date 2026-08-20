import { Link } from 'react-router-dom'
import reynLogo from '../assets/reyn-logo-2.png'
import { socialLinks } from '../constants/socials'
import { SocialIcon } from './Socials'

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            {/* The asset bakes in a tagline that renders ~2px tall at this
                size, so the frame crops down to the wordmark alone. */}
            <span className="footer__mark">
              <img src={reynLogo} alt="REYN." className="footer__logo" />
            </span>
            <p className="footer__tag">Redefine the Standard · Colombo, Sri Lanka</p>
            <Link className="footer__store-link" to="/store">
              Shop the store →
            </Link>
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
  )
}
