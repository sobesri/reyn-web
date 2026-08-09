import type { ReactNode } from 'react'

type MarqueeProps = {
  children: ReactNode
  /** Seconds for one full loop. Lower is faster. */
  duration?: number
  reverse?: boolean
  className?: string
}

/**
 * Seamless horizontal loop. The track holds two identical sets and slides by
 * -50%, so the second set lands exactly where the first started.
 */
export function Marquee({ children, duration = 40, reverse = false, className }: MarqueeProps) {
  return (
    <div className={['marquee', className].filter(Boolean).join(' ')}>
      <div
        className="marquee__track"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        <div className="marquee__set">{children}</div>
        <div className="marquee__set" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
