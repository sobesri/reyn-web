import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import reynLogo from '../assets/reyn-logo-2.png'
import { CartButton } from '../store/CartButton'
import { SizeGuideButton } from '../store/SizeGuideButton'
import { useCartItems } from '../store/cart'
import { ThemeToggle } from './ThemeToggle'

/**
 * Destinations, in the order they appear. A link to the page you are already
 * on is dropped — on a product page both stay, because /store/:slug is not
 * either of them and the way back to the listing still has to be there.
 */
const DESTINATIONS = [
  { to: '/', label: 'Store' },
  { to: '/about-us', label: 'About us' },
]

/**
 * The header shared by every route: the store, a product and the landing page
 * at /about-us. The cart and size guide live here because both are reachable
 * from anywhere, not just from inside the store.
 *
 * On a phone the row does not fit, so everything but the wordmark moves into
 * a drawer. Its trigger carries the cart count, because the one thing worth
 * knowing from a closed menu is that there is something waiting in the cart.
 */
export function SiteNav({ section }: { section?: string }) {
  const navRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const { totals } = useCartItems()
  const count = totals.units

  const closeMenu = () => setMenuOpen(false)

  // The nav stacks on small screens, so its height varies. Publish it as a
  // custom property for the sticky filter bar to sit directly beneath.
  useEffect(() => {
    const el = navRef.current
    if (!el) return

    const publish = () =>
      document.documentElement.style.setProperty('--site-nav-h', `${el.offsetHeight}px`)

    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Escape closes the drawer, and the page behind it stays put while it is up.
  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const destinations = DESTINATIONS.filter(({ to }) => to !== pathname)

  return (
    <header className="site-nav" ref={navRef}>
      <div className="site-nav__inner">
        <Link
          className="site-nav__brand"
          to="/"
          aria-label={section ? `REYN. ${section}, home` : 'REYN. home'}
        >
          <span className="footer__mark">
            <img src={reynLogo} alt="" className="footer__logo" />
          </span>
          {section && (
            <span className="site-nav__section" aria-hidden="true">
              {section}
            </span>
          )}
        </Link>

        <nav className="site-nav__links">
          {destinations.map(({ to, label }) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
          <SizeGuideButton />
          <CartButton />
          <ThemeToggle />
        </nav>

        <button
          type="button"
          className="site-nav__menu-btn"
          aria-label={count === 0 ? 'Open the menu' : `Open the menu, ${count} in your cart`}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
          {count > 0 && !menuOpen && (
            <span className="site-nav__menu-count" aria-hidden="true">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Portalled to <body>: the header carries a backdrop-filter, which
          makes it the containing block for fixed descendants and would pin
          the drawer inside the header instead of over the page. */}
      {menuOpen &&
        createPortal(
          <div className="site-menu" onClick={closeMenu}>
          <div
            className="site-menu__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="site-menu__links" onClick={closeMenu}>
              {destinations.map(({ to, label }) => (
                <Link key={to} to={to}>
                  {label}
                </Link>
              ))}
              <SizeGuideButton />
              <CartButton />
            </div>

            <div className="site-menu__foot">
              <ThemeToggle showLabel />
            </div>
          </div>
          </div>,
          document.body,
        )}
    </header>
  )
}
