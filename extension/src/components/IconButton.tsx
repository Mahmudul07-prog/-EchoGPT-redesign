import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  icon: ReactNode
  active?: boolean
  size?: 'sm' | 'md'
}

/** Icon-only button. Always requires a `label`, which becomes the accessible name
 * (aria-label) — per DESIGN_SPEC.md's accessibility baseline. */
export default function IconButton({
  label,
  icon,
  active = false,
  size = 'md',
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={clsx(
        'inline-flex items-center justify-center rounded-full transition-colors',
        'text-text-muted-light dark:text-text-muted-dark',
        'hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/10 dark:hover:text-brand-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-light dark:focus-visible:ring-offset-surface-dark',
        'disabled:opacity-40 disabled:pointer-events-none',
        size === 'md' ? 'h-9 w-9' : 'h-7 w-7',
        active && 'bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-300',
        className,
      )}
      {...rest}
    >
      {icon}
    </button>
  )
}
