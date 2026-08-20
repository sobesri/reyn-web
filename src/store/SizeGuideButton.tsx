import { useState } from 'react'
import { Lightbox } from '../components/Lightbox'
import { sizeChartPoster } from '../constants/sizing'

const poster = [{ src: sizeChartPoster, title: 'REYN oversized t-shirt size chart' }]

/**
 * Opens the size chart in place rather than navigating away, so a customer
 * never loses their spot on a product page to check measurements.
 */
export function SizeGuideButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className={['size-guide-btn', className].filter(Boolean).join(' ')}
        onClick={() => setOpen(true)}
      >
        Size guide
      </button>

      <Lightbox
        items={poster}
        index={open ? 0 : null}
        onIndexChange={() => {}}
        onClose={() => setOpen(false)}
        className="lightbox--chart"
      />
    </>
  )
}
