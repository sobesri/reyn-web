/**
 * Statsig: product analytics (auto-capture) plus session replay.
 *
 * The client key comes from STATSIG_CLIENT_KEY and is never hard-coded here.
 * It is a *client* key, so the build still inlines it into the public bundle —
 * that is unavoidable for browser analytics and is what the key is designed
 * for. Never put a Statsig server/console key in a STATSIG_* or VITE_* var.
 *
 * With the key unset (the default for a fresh checkout) the provider is inert
 * and no Statsig client is created.
 *
 * Unlike GA this does load during `npm run dev` so the setup is testable
 * locally; the environment tier below keeps those sessions out of production
 * reports.
 */

import type { ReactNode } from 'react'
import { StatsigProvider, useClientAsyncInit } from '@statsig/react-bindings'
import { StatsigSessionReplayPlugin } from '@statsig/session-replay'
import { StatsigAutoCapturePlugin } from '@statsig/web-analytics'

const CLIENT_KEY = import.meta.env.STATSIG_CLIENT_KEY ?? ''

export const statsigEnabled = CLIENT_KEY.length > 0

const STORAGE_KEY = 'reyn.statsig.id'

/**
 * A stable per-browser id, so repeat visits from the same person line up in
 * Statsig instead of each load looking like a brand new user. Private-mode
 * browsers can throw on storage access, so every path falls back to a
 * throwaway id rather than failing the render.
 */
function getStableUserId() {
  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    if (existing) return existing

    const id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
    return id
  } catch {
    return crypto.randomUUID()
  }
}

const user = { userID: getStableUserId() }

const options = {
  environment: { tier: import.meta.env.PROD ? 'production' : 'development' },
  plugins: [new StatsigAutoCapturePlugin(), new StatsigSessionReplayPlugin()],
}

/** Mounted only when a key is configured, so the hook order stays stable. */
function StatsigClient({ children }: { children: ReactNode }) {
  const { client } = useClientAsyncInit(CLIENT_KEY, user, options)

  // No loadingComponent: the site renders immediately and events queue until
  // the client finishes initialising. Blocking on the network here would put a
  // spinner in front of the hero on every visit.
  return <StatsigProvider client={client}>{children}</StatsigProvider>
}

export function StatsigAnalytics({ children }: { children: ReactNode }) {
  if (!statsigEnabled) return children

  return <StatsigClient>{children}</StatsigClient>
}
