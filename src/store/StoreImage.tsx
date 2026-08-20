import { useState } from 'react'
import { isCloudinaryConfigured, storeImage, storeImageSrcSet } from '../constants/cloudinary'

type StoreImageProps = {
  publicId: string
  alt: string
  /** Fallback label drawn on the placeholder when there is no image yet. */
  label?: string
  sizes?: string
  eager?: boolean
  className?: string
}

/**
 * Renders a Cloudinary image, falling back to a branded placeholder when the
 * asset is missing, not yet uploaded, or the cloud name is unset. Uploads are
 * still in progress, so a 404 must not surface as a broken-image icon.
 */
export function StoreImage({ publicId, alt, label, sizes, eager, className }: StoreImageProps) {
  const [failed, setFailed] = useState(false)
  const [lastId, setLastId] = useState(publicId)

  // A new id deserves a fresh attempt, e.g. when switching colourway.
  if (lastId !== publicId) {
    setLastId(publicId)
    setFailed(false)
  }

  if (!isCloudinaryConfigured || !publicId || failed) {
    return (
      <div
        className={['store-img store-img--placeholder', className].filter(Boolean).join(' ')}
        role="img"
        aria-label={alt}
      >
        <span>{label ?? 'Image pending'}</span>
        <em>{publicId || 'no image yet'}</em>
      </div>
    )
  }

  return (
    <img
      className={['store-img', className].filter(Boolean).join(' ')}
      src={storeImage(publicId, { width: 640 })}
      srcSet={storeImageSrcSet(publicId)}
      sizes={sizes ?? '(max-width: 640px) 50vw, 320px'}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
