/**
 * The theme: types, storage and the hook that reads it. The provider itself
 * lives in components/ThemeProvider.tsx, which keeps this module free of
 * components so both sides survive a fast-refresh edit.
 *
 * Light is the default — the store is the front door and reads brighter on
 * paper — with the original black editorial palette one toggle away. The
 * choice is a deliberate one, so it is remembered rather than re-derived from
 * the operating system on every visit.
 */

import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'reyn.theme.v1'

export const DEFAULT_THEME: Theme = 'light'

/** Browser-chrome colour per theme. Mirrors --ink in index.css. */
export const THEME_BACKGROUND: Record<Theme, string> = {
  light: '#faf9f6',
  dark: '#08080a',
}

const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark'

export function readStoredTheme(): Theme {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(saved) ? saved : DEFAULT_THEME
  } catch {
    // Storage is blocked. The default still applies for this session.
    return DEFAULT_THEME
  }
}

/**
 * Reflects the theme onto <html> so the token overrides in index.css apply,
 * and keeps the browser chrome in step. index.html runs the same logic inline
 * before first paint, so React only ever confirms what is already there.
 */
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  document.head
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_BACKGROUND[theme])
}

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggle: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme must be used inside <ThemeProvider>')
  return value
}
