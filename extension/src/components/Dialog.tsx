import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import IconButton from './IconButton'
import { X } from 'lucide-react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
}

/** Accessible modal: traps focus while open, closes on Escape or backdrop click, and restores
 * focus to the trigger element on close — per DESIGN_SPEC.md's accessibility baseline. */
export default function Dialog({ open, onClose, title, description, children }: DialogProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    const container = containerRef.current
    const focusable = container?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ;(focusable?.[0] ?? container)?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !container) return
      const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      previouslyFocused.current?.focus()
    }
  }, [open, onClose])

  // Deliberately not using AnimatePresence's exit-animation lifecycle here: this dialog only
  // needs to close reliably and instantly (it gates a destructive confirm action), so it mounts
  // only while `open` is true and animates in on mount — no deferred/animated unmount to get
  // stuck on.
  if (!open) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="echogpt-dialog-title"
        aria-describedby={description ? 'echogpt-dialog-description' : undefined}
        tabIndex={-1}
        className="w-full max-w-sm rounded-card border border-border-light bg-surface-light p-5 shadow-[0_2px_20px_-4px_rgba(124,58,237,0.25)] dark:border-border-dark dark:bg-surface-dark focus:outline-none"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <h2 id="echogpt-dialog-title" className="font-display text-lg font-semibold tracking-tight">
            {title}
          </h2>
          <IconButton label="Close dialog" icon={<X size={16} />} size="sm" onClick={onClose} />
        </div>
        {description && (
          <p id="echogpt-dialog-description" className="mb-4 text-sm text-text-muted-light dark:text-text-muted-dark">
            {description}
          </p>
        )}
        {children}
      </motion.div>
    </motion.div>
  )
}
