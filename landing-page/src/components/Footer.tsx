import { AtSign, Code2, ExternalLink, MessageCircle, Rss, Send } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { useToast } from '../lib/toast-context'
import { Logo } from './Logo'

const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'AI Models', href: '#models' },
      { label: 'Screenshots', href: '#screenshots' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'FAQ', href: '#faq' },
      { label: 'Support', href: '#' },
      { label: 'API Platform', href: '#' },
      { label: 'Community Discord', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
]

const SOCIAL_LINKS = [
  { label: 'GitHub', icon: Code2, href: '#' },
  { label: 'X (Twitter)', icon: AtSign, href: '#' },
  { label: 'Discord community', icon: MessageCircle, href: '#' },
  { label: 'Blog RSS feed', icon: Rss, href: '#' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()
  const emailInputId = useId()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = email.trim()
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    if (!isValid) {
      setError('Enter a valid email address.')
      return
    }
    setError(null)
    setEmail('')
    showToast("Thanks — you're on the list!")
  }

  return (
    <footer className="border-t border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_3fr_2fr]">
          <div className="flex flex-col gap-4">
            <Logo className="h-9 w-9" />
            <p className="max-w-xs text-sm text-text-muted-light dark:text-text-muted-dark">
              One workspace for every AI model — chat, compare, and create, in your browser and on
              the web.
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-light text-text-muted-light transition hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-light dark:border-border-dark dark:text-text-muted-dark dark:hover:bg-white/10 dark:hover:text-brand-300 dark:focus-visible:ring-offset-surface-dark"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="font-display text-sm font-semibold text-text-light dark:text-text-dark">
                  {column.title}
                </h3>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-text-muted-light transition hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-text-muted-dark dark:hover:text-brand-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-text-light dark:text-text-dark">
              Stay in the loop
            </h3>
            <p className="mt-3 text-sm text-text-muted-light dark:text-text-muted-dark">
              Product updates and new model releases, roughly once a month.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2" noValidate>
              <label htmlFor={emailInputId} className="sr-only">
                Email address
              </label>
              <div className="flex items-center gap-2 rounded-pill border border-border-light bg-bg-light px-3 py-2 focus-within:ring-2 focus-within:ring-brand-500 dark:border-border-dark dark:bg-white/5">
                <input
                  id={emailInputId}
                  type="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${emailInputId}-error` : undefined}
                  className="flex-1 bg-transparent text-sm text-text-light placeholder:text-text-muted-light focus:outline-none dark:text-text-dark dark:placeholder:text-text-muted-dark"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to the newsletter"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-accent-600 text-white transition hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              {error ? (
                <p id={`${emailInputId}-error`} role="alert" className="text-xs text-danger-500">
                  {error}
                </p>
              ) : null}
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border-light pt-6 text-xs text-text-muted-light sm:flex-row dark:border-border-dark dark:text-text-muted-dark">
          <p>© {new Date().getFullYear()} EchoGPT. Design demo — not a real company or product.</p>
          <a
            href="#top"
            className="inline-flex items-center gap-1 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:text-brand-300"
          >
            Back to top
            <ExternalLink className="h-3 w-3 rotate-[-45deg]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
