import { motion, useReducedMotion } from 'framer-motion'
import { Columns3, ImagePlay, MessagesSquare } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { AnimatedItem, AnimatedSection } from './AnimatedSection'
import { SectionHeading } from './SectionHeading'
import { BrowserFrame } from './mockups/BrowserFrame'
import { ChatMockup } from './mockups/ChatMockup'
import { CompareMockup } from './mockups/CompareMockup'
import { ImageStudioMockup } from './mockups/ImageStudioMockup'

interface Tab {
  id: 'chat' | 'compare' | 'studio'
  label: string
  icon: LucideIcon
  url: string
  render: () => ReactNode
}

const TABS: Tab[] = [
  { id: 'chat', label: 'Chat', icon: MessagesSquare, url: 'app.echogpt.live/chat', render: () => <ChatMockup /> },
  {
    id: 'compare',
    label: 'Compare',
    icon: Columns3,
    url: 'app.echogpt.live/compare',
    render: () => <CompareMockup />,
  },
  {
    id: 'studio',
    label: 'Image Studio',
    icon: ImagePlay,
    url: 'app.echogpt.live/studio',
    render: () => <ImageStudioMockup />,
  },
]

export function Screenshots() {
  const [activeTab, setActiveTab] = useState<Tab['id']>('chat')
  const reduceMotion = useReducedMotion()
  const baseId = useId()
  const current = TABS.find((tab) => tab.id === activeTab) ?? TABS[0]

  return (
    <AnimatedSection
      id="screenshots"
      ariaLabelledby="screenshots-heading"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <SectionHeading
        id="screenshots-heading"
        eyebrow="Product preview"
        title="See EchoGPT in action"
        subtitle="A quick look at the core surfaces — plain HTML/CSS mockups standing in for the real product UI."
      />

      <AnimatedItem className="mt-10 flex justify-center">
        <div
          role="tablist"
          aria-label="Product preview views"
          className="inline-flex flex-wrap justify-center gap-1 rounded-pill border border-border-light bg-surface-light p-1 dark:border-border-dark dark:bg-surface-dark"
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-pill px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-sm'
                    : 'text-text-muted-light hover:text-text-light dark:text-text-muted-dark dark:hover:text-text-dark'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </AnimatedItem>

      <AnimatedItem className="relative mx-auto mt-10 max-w-3xl">
        <div
          role="tabpanel"
          id={`${baseId}-panel-${current.id}`}
          aria-labelledby={`${baseId}-tab-${current.id}`}
        >
          <motion.div
            key={current.id}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <BrowserFrame url={current.url}>{current.render()}</BrowserFrame>
          </motion.div>
        </div>
      </AnimatedItem>
    </AnimatedSection>
  )
}
