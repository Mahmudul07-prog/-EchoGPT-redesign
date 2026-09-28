import { Brain, Code2, ScanEye, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AnimatedItem, AnimatedSection } from './AnimatedSection'
import { SectionHeading } from './SectionHeading'

interface ModelInfo {
  icon: LucideIcon
  name: string
  tagline: string
  gradient: string
}

const MODELS: ModelInfo[] = [
  {
    icon: Zap,
    name: 'EchoGPT Turbo',
    tagline: 'Fast, terse answers for everyday questions',
    gradient: 'from-brand-500 to-brand-300',
  },
  {
    icon: Brain,
    name: 'EchoGPT Pro',
    tagline: 'Balanced, structured reasoning for deeper work',
    gradient: 'from-brand-600 to-accent-600',
  },
  {
    icon: ScanEye,
    name: 'EchoGPT Vision',
    tagline: 'Understands images, screenshots, and diagrams',
    gradient: 'from-accent-500 to-gold-400',
  },
  {
    icon: Code2,
    name: 'EchoGPT Code',
    tagline: 'Specialized for code review and debugging',
    gradient: 'from-brand-700 to-accent-500',
  },
]

export function Models() {
  return (
    <AnimatedSection
      id="models"
      ariaLabelledby="models-heading"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <SectionHeading
        id="models-heading"
        eyebrow="AI Models"
        title="The models available inside EchoGPT"
        subtitle="Every plan gives you access to a family of EchoGPT models, each tuned for a different kind of task — switch between them in one click."
      />

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {MODELS.map(({ icon: Icon, name, tagline, gradient }) => (
          <AnimatedItem key={name}>
            <div className="flex h-full flex-col items-center gap-3 rounded-card border border-border-light bg-surface-light p-6 text-center shadow-[0_2px_20px_-4px_rgba(124,58,237,0.15)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(124,58,237,0.35)] dark:border-border-dark dark:bg-surface-dark">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white`}
              >
                <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <h3 className="font-display text-base font-semibold text-text-light dark:text-text-dark">{name}</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{tagline}</p>
            </div>
          </AnimatedItem>
        ))}
      </div>

      <AnimatedItem className="mt-6 text-center text-xs text-text-muted-light dark:text-text-muted-dark">
        EchoGPT model names shown are product-internal brand names for this demo, not affiliated
        with any third-party AI provider.
      </AnimatedItem>
    </AnimatedSection>
  )
}
