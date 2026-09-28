import { Clapperboard, Columns3, FileText, MessagesSquare, TextSelect, Workflow } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AnimatedItem, AnimatedSection } from './AnimatedSection'
import { SectionHeading } from './SectionHeading'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: MessagesSquare,
    title: 'Multi-model chat',
    description:
      'Talk to EchoGPT Turbo, Pro, Vision, and Code from one continuous thread — switch models mid-conversation without losing context.',
  },
  {
    icon: Columns3,
    title: 'Side-by-side Compare',
    description:
      'Ask once, see how different models respond side by side, and pick the best answer before you commit to it.',
  },
  {
    icon: FileText,
    title: 'Page summarization',
    description:
      'Summarize any article or webpage instantly from the browser sidebar — no copying, pasting, or tab switching required.',
  },
  {
    icon: TextSelect,
    title: 'Explain selected text',
    description:
      'Highlight any text on the web and get a clear, in-context explanation without leaving the page you are reading.',
  },
  {
    icon: Clapperboard,
    title: 'Image & video studio',
    description:
      'Generate images and short video clips from a prompt, right inside your workspace — no separate creative tools needed.',
  },
  {
    icon: Workflow,
    title: 'Connectors & automation',
    description:
      'Chain steps into AI Tasks and SOPs, connect your favorite tools, and automate the repetitive parts of your workflow.',
  },
]

export function Features() {
  return (
    <AnimatedSection
      id="features"
      ariaLabelledby="features-heading"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <SectionHeading
        id="features-heading"
        eyebrow="Features"
        title="Everything you need, in one place"
        subtitle="EchoGPT brings the core jobs of a modern AI workspace — chatting, comparing, summarizing, and creating — into a single, focused surface."
      />

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <AnimatedItem key={title}>
            <div className="group h-full rounded-card border border-border-light bg-surface-light p-6 shadow-[0_2px_20px_-4px_rgba(124,58,237,0.15)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(124,58,237,0.35)] dark:border-border-dark dark:bg-surface-dark">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white transition duration-200 group-hover:scale-105">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-text-light dark:text-text-dark">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted-light dark:text-text-muted-dark">
                {description}
              </p>
            </div>
          </AnimatedItem>
        ))}
      </div>
    </AnimatedSection>
  )
}
