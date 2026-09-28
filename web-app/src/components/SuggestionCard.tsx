import { motion, useReducedMotion } from "framer-motion";
import type { Suggestion } from "../lib/suggestions";

interface SuggestionCardProps {
  suggestion: Suggestion;
  onSelect: (prompt: string) => void;
  index: number;
}

export function SuggestionCard({ suggestion, onSelect, index }: SuggestionCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(suggestion.prompt)}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.45, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      className="group rounded-card border border-border-light bg-surface-light p-4 text-left shadow-[0_2px_20px_-4px_rgba(124,58,237,0.08)] transition hover:shadow-[0_8px_30px_-6px_rgba(124,58,237,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:border-border-dark dark:bg-surface-dark"
    >
      <p className="font-display text-sm font-semibold text-text-light dark:text-text-dark">{suggestion.title}</p>
      <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">{suggestion.description}</p>
    </motion.button>
  );
}
