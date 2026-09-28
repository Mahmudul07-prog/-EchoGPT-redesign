import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'
import clsx from 'clsx'
import { MODELS } from '../lib/mockAi'
import type { ModelId } from '../lib/mockAi'

interface ModelPickerProps {
  value: ModelId
  onChange: (modelId: ModelId) => void
  /** Compact renders as a small pill chip (popup); full renders a wider row with descriptions
   * (side panel top bar). */
  variant?: 'compact' | 'full'
}

/** Custom accessible dropdown (role="listbox"/"option") so model descriptions and PRO badges
 * can be shown — a native <select> can't render that richness. */
export default function ModelPicker({ value, onChange, variant = 'full' }: ModelPickerProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const current = MODELS.find((m) => m.id === value) ?? MODELS[0]

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function selectModel(modelId: ModelId) {
    onChange(modelId)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function handleOptionKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const next = rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')[index + 1]
      next?.focus()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const prev = rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')[index - 1]
      prev?.focus()
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Model: ${current.name}`}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          'inline-flex items-center gap-1.5 rounded-pill border border-border-light bg-surface-light font-medium text-text-light transition-colors hover:border-brand-300 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          variant === 'compact' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        )}
      >
        <Sparkles size={variant === 'compact' ? 12 : 14} className="text-brand-500" />
        <span>{current.shortName}</span>
        {current.badge && (
          <span className="rounded-pill bg-gold-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-gold-500">
            {current.badge}
          </span>
        )}
        <ChevronDown size={variant === 'compact' ? 12 : 14} />
      </button>

      {open && (
        // Mounts only while open (no exit-animation lifecycle to rely on) so the menu is
        // guaranteed to actually close the instant `open` flips back to false.
        <motion.ul
          role="listbox"
          aria-label="Choose an EchoGPT model"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12 }}
          className="absolute left-0 z-40 mt-1.5 w-64 overflow-hidden rounded-card border border-border-light bg-surface-light py-1 shadow-[0_2px_20px_-4px_rgba(124,58,237,0.25)] dark:border-border-dark dark:bg-surface-dark"
        >
          {MODELS.map((model, index) => (
            <li key={model.id}>
              <button
                type="button"
                role="option"
                aria-selected={model.id === value}
                onClick={() => selectModel(model.id)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                className={clsx(
                  'flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm transition-colors',
                  'focus-visible:outline-none focus-visible:bg-brand-50 dark:focus-visible:bg-white/10',
                  model.id === value
                    ? 'bg-brand-50 dark:bg-white/10'
                    : 'hover:bg-brand-50 dark:hover:bg-white/5',
                )}
              >
                <span className="flex items-center gap-1.5 font-medium text-text-light dark:text-text-dark">
                  {model.name}
                  {model.badge && (
                    <span className="rounded-pill bg-gold-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-gold-500">
                      {model.badge}
                    </span>
                  )}
                </span>
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  {model.description}
                </span>
              </button>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}
