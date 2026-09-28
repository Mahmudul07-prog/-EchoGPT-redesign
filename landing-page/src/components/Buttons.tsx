import { ExternalLink, Puzzle } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useToast } from '../lib/toast-context'

type ButtonSize = 'md' | 'lg'

const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
  icon?: ReactNode
}

export function PrimaryButton({ size = 'md', icon, className = '', children, ...props }: BaseButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-pill bg-gradient-to-r from-brand-600 to-accent-600 font-semibold text-white shadow-[0_8px_24px_-8px_rgba(124,58,237,0.55)] transition duration-200 hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-light dark:focus-visible:ring-offset-bg-dark ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

export function SecondaryButton({ size = 'md', icon, className = '', children, ...props }: BaseButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-pill border border-border-light bg-transparent font-semibold text-text-light transition duration-200 hover:bg-brand-50 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-light dark:border-border-dark dark:text-text-dark dark:hover:bg-white/5 dark:focus-visible:ring-offset-bg-dark ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

/** "Add to Chrome" CTA — always shows a toast since there is no real store listing for this demo. */
export function AddToChromeButton({ size = 'md', className = '' }: { size?: ButtonSize; className?: string }) {
  const { showToast } = useToast()
  return (
    <PrimaryButton
      size={size}
      icon={<Puzzle className="h-4 w-4" aria-hidden="true" />}
      className={className}
      onClick={() => showToast("Coming soon — this is a design demo, not a live Chrome Web Store listing.")}
    >
      Add to Chrome — it's free
    </PrimaryButton>
  )
}

/** "Try the Web App" CTA — same demo caveat as above. */
export function TryWebAppButton({ size = 'md', className = '' }: { size?: ButtonSize; className?: string }) {
  const { showToast } = useToast()
  return (
    <SecondaryButton
      size={size}
      icon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}
      className={className}
      onClick={() => showToast('Coming soon — the live web app demo is not connected yet.')}
    >
      Try the Web App
    </SecondaryButton>
  )
}
