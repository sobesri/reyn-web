import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  applyTheme,
  readStoredTheme,
  ThemeContext,
  THEME_STORAGE_KEY,
  type Theme,
} from '../hooks/theme'

/** Holds the theme for the whole app and writes every change to localStorage. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    applyTheme(theme)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Storage is full or blocked. The choice just will not survive a reload.
    }
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), [])

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
