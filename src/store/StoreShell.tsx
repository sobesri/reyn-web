import type { ReactNode } from 'react'
import { socialLinks } from '../constants/socials'
import { ScrollToTop } from '../components/ScrollToTop'
import { SiteNav } from '../components/SiteNav'
import { SocialIcon } from '../components/Socials'
import { CartDrawer } from './CartDrawer'

/** Footer and page chrome shared by every store route. */
export function StoreShell({ children }: { children: ReactNode }) {
  return (
    <div className="site store">
      <div className="grain" aria-hidden="true" />

      <SiteNav section="Store" />

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

      <ScrollToTop />
      <CartDrawer />
    </div>
  )
}
