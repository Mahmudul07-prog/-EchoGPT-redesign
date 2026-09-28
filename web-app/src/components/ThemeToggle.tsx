import { Monitor, Moon, Sun } from "lucide-react";
import type { ThemeMode } from "../types";
import { useSettingsStore } from "../store/settingsStore";
import { cn } from "../lib/utils";

const OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light theme", icon: Sun },
  { value: "dark", label: "Dark theme", icon: Moon },
  { value: "system", label: "Match system theme", icon: Monitor },
];

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn("inline-flex items-center gap-1 rounded-full border border-border-light bg-bg-light p-1 dark:border-border-dark dark:bg-black/20", className)}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
              active
                ? "bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-sm"
                : "text-text-muted-light hover:bg-white hover:text-text-light dark:text-text-muted-dark dark:hover:bg-white/10 dark:hover:text-text-dark",
            )}
          >
            <Icon size={15} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}
