import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import reynLogo from '../assets/reyn-logo-2.png'
import { socialLinks } from '../constants/socials'
import { ScrollToTop } from '../components/ScrollToTop'
import { SocialIcon } from '../components/Socials'
import { SizeGuideButton } from './SizeGuideButton'
import { CartButton } from './CartButton'
import { CartDrawer } from './CartDrawer'

/** Header, footer and page chrome shared by every store route. */
export function StoreShell({ children }: { children: ReactNode }) {
  const navRef = useRef<HTMLElement>(null)

  // The nav stacks on small screens, so its height varies. Publish it as a
  // custom property for the sticky filter bar to sit directly beneath.
  useEffect(() => {
    const el = navRef.current
    if (!el) return

    const publish = () =>
      document.documentElement.style.setProperty('--store-nav-h', `${el.offsetHeight}px`)

    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="site store">
      <div className="grain" aria-hidden="true" />

      <header className="store-nav" ref={navRef}>
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
            <CartButton />
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

      <ScrollToTop />
      <CartDrawer />
    </div>
  )
}
