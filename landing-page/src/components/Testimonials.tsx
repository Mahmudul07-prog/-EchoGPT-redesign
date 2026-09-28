import { Quote } from 'lucide-react'
import { AnimatedItem, AnimatedSection } from './AnimatedSection'
import { SectionHeading } from './SectionHeading'

interface Testimonial {
  initials: string
  name: string
  role: string
  quote: string
  gradient: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    initials: 'AK',
    name: 'Aisha K.',
    role: 'Product Designer',
    quote:
      "Compare mode is the whole reason I stopped keeping four browser tabs open. One prompt, four answers, done.",
    gradient: 'from-brand-500 to-accent-500',
  },
  {
    initials: 'MT',
    name: 'Marcus T.',
    role: 'Software Engineer',
    quote:
      'The side panel summarizing docs while I work is a small thing that saves me a surprising amount of context-switching every day.',
    gradient: 'from-accent-500 to-gold-400',
  },
  {
    initials: 'PR',
    name: 'Priya R.',
    role: 'Marketing Lead',
    quote:
      'Image Studio plus regular chat in the same workspace means our whole content pass happens in one place now.',
    gradient: 'from-brand-600 to-brand-300',
  },
  {
    initials: 'DM',
    name: 'Diego M.',
    role: 'Founder, small startup',
    quote:
      "AI Tasks let us turn a repetitive weekly report into a one-click job. It's the automation feature I didn't know I needed.",
    gradient: 'from-gold-400 to-accent-600',
  },
]

export function Testimonials() {
  return (
    <AnimatedSection
      id="testimonials"
      ariaLabelledby="testimonials-heading"
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <SectionHeading
        id="testimonials-heading"
        eyebrow="What people say"
        title="Loved by people juggling more than one AI"
        subtitle="Illustrative quotes from fictional personas, written for this design demo."
      />

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map(({ initials, name, role, quote, gradient }) => (
          <AnimatedItem key={name}>
            <figure className="flex h-full flex-col gap-4 rounded-card border border-border-light bg-surface-light p-6 shadow-[0_2px_20px_-4px_rgba(124,58,237,0.15)] dark:border-border-dark dark:bg-surface-dark">
              <Quote className="h-5 w-5 text-brand-300 dark:text-brand-700" aria-hidden="true" />
              <blockquote className="flex-1 text-sm leading-relaxed text-text-light dark:text-text-dark">
                “{quote}”
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-sm font-semibold text-white`}
                  aria-hidden="true"
                >
                  {initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-text-light dark:text-text-dark">{name}</span>
                  <span className="block text-xs text-text-muted-light dark:text-text-muted-dark">{role}</span>
                </span>
              </figcaption>
            </figure>
          </AnimatedItem>
        ))}
      </div>
    </AnimatedSection>
  )
}
