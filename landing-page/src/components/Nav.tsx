import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { NAV_LINKS } from '../lib/navigation'
import { useActiveSection } from '../lib/useActiveSection'
import { AddToChromeButton } from './Buttons'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1))

export function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const activeId = useActiveSection(SECTION_IDS)
  const reduceMotion = useReducedMotion()
  const drawerRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-border-light/70 bg-bg-light/80 backdrop-blur-md dark:border-border-dark/70 dark:bg-bg-dark/80">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8" aria-label="Primary">
        <a
          href="#top"
          className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-light dark:focus-visible:ring-offset-bg-dark"
        >
          <Logo className="h-8 w-8" />
        </a>

        <div className="hidden flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1">
          {NAV_LINKS.map((link) => {
            const id = link.href.slice(1)
            const isActive = activeId === id
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'true' : undefined}
                className={`whitespace-nowrap rounded-pill px-2.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-light xl:px-3 dark:focus-visible:ring-offset-bg-dark ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-300'
                    : 'text-text-muted-light hover:text-text-light dark:text-text-muted-dark dark:hover:text-text-dark'
                }`}
              >
                {link.label}
              </a>
            )
          })}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          <AddToChromeButton className="hidden sm:inline-flex" />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            aria-expanded={isOpen}
            aria-controls="mobile-nav-drawer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-light transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-light lg:hidden dark:text-text-dark dark:hover:bg-white/10 dark:focus-visible:ring-offset-bg-dark"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen ? (
          <MobileDrawer
            drawerRef={drawerRef}
            activeId={activeId}
            reduceMotion={!!reduceMotion}
            onClose={() => {
              setIsOpen(false)
              menuButtonRef.current?.focus()
            }}
          />
        ) : null}
      </AnimatePresence>
    </header>
  )
}

interface MobileDrawerProps {
  drawerRef: RefObject<HTMLDivElement | null>
  activeId: string | null
  reduceMotion: boolean
  onClose: () => void
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

function MobileDrawer({ drawerRef, activeId, reduceMotion, onClose }: MobileDrawerProps) {
  useEffect(() => {
    const node = drawerRef.current
    if (!node) return

    const focusables = node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    focusables[0]?.focus()

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    node.addEventListener('keydown', trapFocus)
    return () => node.removeEventListener('keydown', trapFocus)
  }, [drawerRef])

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        ref={drawerRef}
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="fixed inset-y-0 right-0 z-50 flex w-[82vw] max-w-sm flex-col gap-2 border-l border-border-light bg-surface-light p-5 shadow-2xl lg:hidden dark:border-border-dark dark:bg-surface-dark"
        initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
        animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-2 flex items-center justify-between">
          <Logo className="h-8 w-8" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-light transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:text-text-dark dark:hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {NAV_LINKS.map((link) => {
          const id = link.href.slice(1)
          const isActive = activeId === id
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`rounded-xl px-3 py-2.5 text-base font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-300'
                  : 'text-text-light hover:bg-brand-50 dark:text-text-dark dark:hover:bg-white/5'
              }`}
            >
              {link.label}
            </a>
          )
        })}
        <div className="mt-4 flex flex-col gap-3 border-t border-border-light pt-4 dark:border-border-dark">
          <AddToChromeButton className="w-full" />
        </div>
      </motion.div>
    </>
  )
}
