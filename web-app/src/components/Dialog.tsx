import { useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { cn } from "../lib/utils";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  children: ReactNode;
  className?: string;
}

/** A focus-trapping, Escape-to-close modal shell used by every dialog in the app. */
export function Dialog({ open, onClose, titleId, title, children, className }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  useFocusTrap(panelRef, open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={(e) => {
            // Belt-and-suspenders alongside useFocusTrap's document-level
            // listener: closes on Escape via React's own event system too.
            if (e.key === "Escape") {
              e.stopPropagation();
              onClose();
            }
          }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative z-10 w-full max-w-md rounded-card border border-border-light bg-surface-light p-6 shadow-2xl dark:border-border-dark dark:bg-surface-dark",
              className,
            )}
          >
            <h2 id={titleId} className="font-display text-lg font-semibold tracking-tight text-text-light dark:text-text-dark">
              {title}
            </h2>
            <div className="mt-3">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
