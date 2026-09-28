import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const EASE = [0.16, 1, 0.3, 1] as const

export function useEntranceVariants() {
  const reduceMotion = useReducedMotion()

  const container: Variants = {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? { staggerChildren: 0 }
        : { staggerChildren: 0.08, delayChildren: 0.02 },
    },
  }

  const item: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.45 } },
      }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
      }

  return { container, item }
}

interface AnimatedSectionProps {
  id?: string
  className?: string
  children: ReactNode
  ariaLabelledby?: string
}

/**
 * A scroll-triggered fade+translateY entrance wrapper that staggers its
 * direct motion children. Respects prefers-reduced-motion.
 */
export function AnimatedSection({ id, className, children, ariaLabelledby }: AnimatedSectionProps) {
  const { container } = useEntranceVariants()
  return (
    <motion.section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
    >
      {children}
    </motion.section>
  )
}

export function AnimatedItem({ className, children }: { className?: string; children: ReactNode }) {
  const { item } = useEntranceVariants()
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  )
}
