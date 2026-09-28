import clsx from 'clsx'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  id?: string
}

/** Accessible toggle switch (role="switch", keyboard-operable native <button>). */
export default function Switch({ checked, onChange, label, description, id }: SwitchProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start justify-between gap-4 py-1">
      <span className="flex flex-col">
        <span className="text-sm font-medium text-text-light dark:text-text-dark">{label}</span>
        {description && (
          <span className="text-xs text-text-muted-light dark:text-text-muted-dark">{description}</span>
        )}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative h-6 w-11 shrink-0 rounded-pill transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          checked ? 'bg-gradient-to-r from-brand-600 to-accent-600' : 'bg-border-light dark:bg-border-dark',
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </button>
    </label>
  )
}
