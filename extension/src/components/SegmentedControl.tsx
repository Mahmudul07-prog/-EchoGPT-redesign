import { useId, type ReactNode } from 'react'
import clsx from 'clsx'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  icon?: ReactNode
}

interface SegmentedControlProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: SegmentedOption<T>[]
  legend: string
}

/** A native <fieldset>/radio-based segmented control — gets keyboard arrow-key navigation and
 * screen-reader radiogroup semantics for free from the browser instead of reimplementing them. */
export default function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  legend,
}: SegmentedControlProps<T>) {
  const name = useId()

  return (
    <fieldset className="flex gap-1 rounded-pill bg-sidebar-light p-1 dark:bg-sidebar-dark">
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => {
        const checked = value === option.value
        return (
          <label key={option.value} className="relative flex-1 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span
              className={clsx(
                'flex items-center justify-center gap-1.5 rounded-pill px-3 py-1.5 text-sm font-medium transition-colors',
                'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2',
                checked
                  ? 'bg-surface-light text-brand-700 shadow-[0_2px_20px_-4px_rgba(124,58,237,0.25)] dark:bg-surface-dark dark:text-brand-300'
                  : 'text-text-muted-light hover:text-text-light dark:text-text-muted-dark dark:hover:text-text-dark',
              )}
            >
              {option.icon}
              {option.label}
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}
