import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { MODELS, getModel } from "../lib/models";
import { cn } from "../lib/utils";

interface ModelSelectorProps {
  value: string;
  onChange: (modelId: string) => void;
  disabled?: boolean;
}

export function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const model = getModel(value);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-border-light bg-surface-light px-3 py-1.5 text-sm font-medium text-text-light transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark dark:hover:bg-white/5"
      >
        <span>{model.name}</span>
        {model.badge && (
          <span className="rounded-full bg-gold-400/90 px-1.5 py-0.5 text-[10px] font-bold text-black">{model.badge}</span>
        )}
        <ChevronDown size={14} strokeWidth={2} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute bottom-full left-0 z-30 mb-2 w-72 overflow-hidden rounded-xl border border-border-light bg-surface-light py-1 shadow-xl dark:border-border-dark dark:bg-surface-dark"
        >
          {MODELS.map((m) => (
            <button
              key={m.id}
              type="button"
              role="option"
              aria-selected={m.id === value}
              onClick={() => {
                onChange(m.id);
                setOpen(false);
              }}
              className="flex w-full items-start gap-2 px-3.5 py-2.5 text-left transition hover:bg-brand-50 dark:hover:bg-white/5"
            >
              <Check size={16} strokeWidth={2} className={cn("mt-0.5 shrink-0 text-brand-600 dark:text-brand-400", m.id !== value && "opacity-0")} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-text-light dark:text-text-dark">{m.name}</span>
                  {m.badge && <span className="rounded-full bg-gold-400/90 px-1.5 py-0.5 text-[10px] font-bold text-black">{m.badge}</span>}
                </span>
                <span className="block text-xs text-text-muted-light dark:text-text-muted-dark">{m.description}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
