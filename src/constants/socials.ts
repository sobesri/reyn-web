export const socialLinks = [
  {
    label: 'Instagram',
    handle: '@reynatelierofficial',
    href: 'https://www.instagram.com/reynatelierofficial',
  },
  {
    label: 'TikTok',
    handle: '@reynatelierofficial',
    href: 'https://www.tiktok.com/@reynatelierofficial',
  },
] as const

export type SocialLabel = (typeof socialLinks)[number]['label']
