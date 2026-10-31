import { Navigate, useLocation } from 'react-router-dom'

/**
 * Sends a retired path home. `keepQuery` preserves the query string, so an
 * old `/store?collection=Aurum` link still lands on that filter; the catch-all
 * drops it, since an unknown route's parameters mean nothing to the store.
 */
export function HomeRedirect({ keepQuery = false }: { keepQuery?: boolean }) {
  const { search } = useLocation()
  return <Navigate to={{ pathname: '/', search: keepQuery ? search : '' }} replace />
}
