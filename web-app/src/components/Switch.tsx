import { cn } from "../lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hideLabel?: boolean;
  disabled?: boolean;
}

/** An accessible toggle switch (role="switch") — always purely local state, never wired to a backend. */
export function Switch({ checked, onChange, label, hideLabel, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={hideLabel ? label : undefined}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-pill transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        checked ? "bg-gradient-to-r from-brand-600 to-accent-600" : "bg-border-light dark:bg-white/15",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
      {!hideLabel && <span className="sr-only">{label}</span>}
    </button>
  );
}
