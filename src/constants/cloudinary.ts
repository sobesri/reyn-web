/**
 * Cloudinary image delivery.
 *
 * Override either value with VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_FOLDER
 * in a .env file.
 *
 * This account uses Cloudinary "dynamic folders": the Media Library folder is
 * display-only metadata and is NOT part of the public id. An asset shown in
 * store/Aurum still delivers from /Leo_white, so ids here are flat.
 *
 * Set VITE_CLOUDINARY_FOLDER only if you switch to folder-based public ids.
 */
export const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? 'chyv8hgz'

export const STORE_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER ?? ''

export const isCloudinaryConfigured = CLOUD_NAME.length > 0

type ImageOptions = {
  width?: number
  height?: number
  /** Cloudinary crop mode. `fill` crops to fit, `pad` letterboxes. */
  crop?: 'fill' | 'fit' | 'pad'
}

/**
 * Builds a delivery URL. `publicId` is the asset name without extension;
 * f_auto lets Cloudinary serve WebP/AVIF to browsers that accept them.
 */
export function storeImage(publicId: string, { width, height, crop = 'fill' }: ImageOptions = {}) {
  if (!isCloudinaryConfigured || !publicId) return ''

  const transforms = ['f_auto', 'q_auto']
  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  if (width || height) transforms.push(`c_${crop}`)

  const path = STORE_FOLDER ? `${STORE_FOLDER}/${publicId}` : publicId
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms.join(',')}/${path}`
}

/** Widths offered to the browser for responsive selection. */
const SRCSET_WIDTHS = [320, 480, 640, 960, 1280]

export function storeImageSrcSet(publicId: string, options: ImageOptions = {}) {
  if (!isCloudinaryConfigured || !publicId) return ''
  return SRCSET_WIDTHS.map((w) => `${storeImage(publicId, { ...options, width: w })} ${w}w`).join(', ')
}
