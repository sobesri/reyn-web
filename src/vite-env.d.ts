/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string
  readonly VITE_CLOUDINARY_FOLDER?: string
  readonly VITE_WHATSAPP_NUMBER?: string
  /** GA4 measurement id, e.g. G-XXXXXXXXXX. Unset disables analytics. */
  readonly VITE_GA_MEASUREMENT_ID?: string
  /** Statsig client SDK key. Unset disables Statsig. */
  readonly STATSIG_CLIENT_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
