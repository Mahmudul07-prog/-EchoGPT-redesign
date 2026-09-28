import { Gauge, Layers, Lock, Sidebar } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AnimatedItem, AnimatedSection } from './AnimatedSection'
import { SectionHeading } from './SectionHeading'

interface Callout {
  icon: LucideIcon
  stat: string
  description: string
}

const CALLOUTS: Callout[] = [
  {
    icon: Layers,
    stat: '4 models, 1 workspace',
    description: 'Stop juggling tabs — every assistant lives in a single, unified thread.',
  },
  {
    icon: Gauge,
    stat: '~2× faster with Turbo*',
    description: "Switch to Turbo mode for quick, direct answers when you're in a hurry.",
  },
  {
    icon: Sidebar,
    stat: '1 shortcut, every tab',
    description: 'The Chrome side panel follows you across the web — press Ctrl+Shift+E anywhere.',
  },
  {
    icon: Lock,
    stat: 'Privacy-first by design',
    description: 'Toggle page-context sharing on or off per chat, and stay in control of what EchoGPT sees.',
  },
]

export function WhyChoose() {
  return (
    <AnimatedSection
      id="why-echogpt"
      ariaLabelledby="why-heading"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <SectionHeading
        id="why-heading"
        eyebrow="Why EchoGPT"
        title="Built for people who live in their AI tools"
        subtitle="A handful of reasons teams pick EchoGPT as their daily driver."
      />

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CALLOUTS.map(({ icon: Icon, stat, description }) => (
          <AnimatedItem key={stat}>
            <div className="h-full rounded-card border border-border-light bg-gradient-to-b from-brand-50 to-transparent p-6 dark:border-border-dark dark:from-white/5">
              <Icon className="h-6 w-6 text-brand-600 dark:text-brand-400" strokeWidth={1.75} aria-hidden="true" />
              <p className="mt-4 font-display text-xl font-bold text-text-light dark:text-text-dark">{stat}</p>
              <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">{description}</p>
            </div>
          </AnimatedItem>
        ))}
      </div>

      <AnimatedItem className="mt-6 text-center text-xs text-text-muted-light dark:text-text-muted-dark">
        *Illustrative figures for this demo/prototype — not measured or independently audited claims.
      </AnimatedItem>
    </AnimatedSection>
  )
}
