import { useState } from 'react'
import { isCloudinaryConfigured, storeImage, storeImageSrcSet } from '../constants/cloudinary'

type StoreImageProps = {
  /** One public id, or a list of candidates tried in order. */
  publicId: string | string[]
  alt: string
  /** Fallback label drawn on the placeholder when no candidate loads. */
  label?: string
  sizes?: string
  eager?: boolean
  className?: string
}

/**
 * Renders a Cloudinary image, stepping through candidate ids on error and
 * falling back to a branded placeholder once they are exhausted. Uploads are
 * still in progress, so a 404 must never surface as a broken-image icon.
 */
export function StoreImage({ publicId, alt, label, sizes, eager, className }: StoreImageProps) {
  const candidates = (Array.isArray(publicId) ? publicId : [publicId]).filter(Boolean)
  const key = candidates.join('|')

  const [attempt, setAttempt] = useState(0)
  const [lastKey, setLastKey] = useState(key)

  // A different set of candidates deserves a fresh attempt.
  if (lastKey !== key) {
    setLastKey(key)
    setAttempt(0)
  }

  const current = candidates[attempt]

  if (!isCloudinaryConfigured || !current) {
    return (
      <div
        className={['store-img store-img--placeholder', className].filter(Boolean).join(' ')}
        role="img"
        aria-label={alt}
      >
        <span>{label ?? 'Image pending'}</span>
        <em>{candidates[0] ?? 'no image yet'}</em>
      </div>
    )
  }

  return (
    <img
      key={current}
      className={['store-img', className].filter(Boolean).join(' ')}
      src={storeImage(current, { width: 640 })}
      srcSet={storeImageSrcSet(current)}
      sizes={sizes ?? '(max-width: 640px) 50vw, 320px'}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setAttempt((n) => n + 1)}
    />
  )
}
