import { useTheme } from '../hooks/theme'

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.4A8.4 8.4 0 1 1 9.6 4a6.6 6.6 0 0 0 10.4 10.4Z" />
    </svg>
  )
}

/**
 * Flips the site between the light default and the original black theme.
 * The label names the destination, not the current state.
 */
export function ThemeToggle({
  className = '',
  showLabel = false,
}: {
  className?: string
  showLabel?: boolean
}) {
  const { theme, toggle } = useTheme()
  const next = theme === 'light' ? 'dark' : 'light'
  const label = `Switch to ${next} theme`

  return (
    <button
      type="button"
      className={[
        'theme-toggle',
        showLabel ? 'theme-toggle--labelled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={toggle}
      // With the label on screen it is already the button's name; repeating
      // it in aria-label would only risk the two drifting apart.
      aria-label={showLabel ? undefined : label}
      title={label}
    >
      {showLabel && <span className="theme-toggle__label">{label}</span>}
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}
