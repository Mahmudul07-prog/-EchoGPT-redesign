import type { ReactNode } from 'react'
import { AnimatedItem } from './AnimatedSection'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
  id?: string
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center', id }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  return (
    <AnimatedItem className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      {eyebrow ? (
        <span className="inline-flex w-fit items-center rounded-pill border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:border-brand-800/60 dark:bg-white/5 dark:text-brand-300">
          {eyebrow}
        </span>
      ) : null}
      <h2
        id={id}
        className="text-balance font-display text-3xl font-bold tracking-tight text-text-light md:text-4xl dark:text-text-dark"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="text-balance text-base text-text-muted-light md:text-lg dark:text-text-muted-dark">
          {subtitle}
        </p>
      ) : null}
    </AnimatedItem>
  )
}
