import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useUiStore } from "../store/uiStore";

const ICONS = {
  default: Info,
  success: CheckCircle2,
  danger: TriangleAlert,
};

function ToastRow({ id, message, variant = "default" }: { id: string; message: string; variant?: "default" | "success" | "danger" }) {
  const removeToast = useUiStore((s) => s.removeToast);
  const reduceMotion = useReducedMotion();
  const Icon = ICONS[variant];

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), 3200);
    return () => clearTimeout(timer);
  }, [id, removeToast]);

  return (
    <motion.div
      layout
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.95 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.25, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      className="flex w-full max-w-sm items-start gap-3 rounded-xl border border-border-light bg-surface-light p-3.5 pr-2 shadow-[0_8px_30px_-8px_rgba(124,58,237,0.35)] dark:border-border-dark dark:bg-surface-dark"
    >
      <Icon
        size={18}
        strokeWidth={2}
        className={
          variant === "danger" ? "mt-0.5 shrink-0 text-danger-500" : variant === "success" ? "mt-0.5 shrink-0 text-success-500" : "mt-0.5 shrink-0 text-brand-500"
        }
      />
      <p className="flex-1 text-sm text-text-light dark:text-text-dark">{message}</p>
      <button
        type="button"
        onClick={() => removeToast(id)}
        aria-label="Dismiss notification"
        className="rounded-full p-1 text-text-muted-light transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-text-muted-dark dark:hover:bg-white/5"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useUiStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full sm:w-auto">
            <ToastRow id={t.id} message={t.message} variant={t.variant} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
