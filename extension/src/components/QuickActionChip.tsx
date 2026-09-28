import type { ReactNode } from 'react'

interface QuickActionChipProps {
  icon: ReactNode
  label: string
  description?: string
  onClick: () => void
}

export default function QuickActionChip({ icon, label, description, onClick }: QuickActionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-start gap-1 rounded-card border border-border-light bg-surface-light p-3 text-left transition hover:-translate-y-0.5 hover:shadow-[0_2px_20px_-4px_rgba(124,58,237,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0 dark:border-border-dark dark:bg-surface-dark"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-brand-300">
        {icon}
      </span>
      <span className="text-sm font-medium text-text-light dark:text-text-dark">{label}</span>
      {description && (
        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">{description}</span>
      )}
    </button>
  )
}
