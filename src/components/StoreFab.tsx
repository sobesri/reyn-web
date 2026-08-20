import { Link } from 'react-router-dom'

/** Persistent shortcut to the store, pinned above the page on every scroll position. */
export function StoreFab() {
  return (
    <Link className="store-fab" to="/store">
      <span className="store-fab__dot" aria-hidden="true" />
      <span className="store-fab__label">Go to store</span>
      <span className="store-fab__arrow" aria-hidden="true">
        →
      </span>
    </Link>
  )
}
