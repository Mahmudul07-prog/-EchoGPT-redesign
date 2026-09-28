export interface NavLink {
  label: string
  href: `#${string}`
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'Models', href: '#models' },
  { label: 'Screenshots', href: '#screenshots' },
  { label: 'Why EchoGPT', href: '#why-echogpt' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export const CHROME_STORE_PLACEHOLDER_URL = '#add-to-chrome'
export const WEB_APP_PLACEHOLDER_URL = '#try-web-app'
