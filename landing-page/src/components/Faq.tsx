import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import { AnimatedItem, AnimatedSection } from './AnimatedSection'
import { SectionHeading } from './SectionHeading'

interface FaqItem {
  question: string
  answer: string
}

const FAQS: FaqItem[] = [
  {
    question: 'Is EchoGPT free to use?',
    answer:
      'Yes. The Free plan gives you the EchoGPT Turbo model, basic page summarization, and community support at no cost, with no credit card required. Pro and Team plans unlock Compare mode, the Image & Video Studio, and the full model lineup.',
  },
  {
    question: 'What AI models does EchoGPT support?',
    answer:
      'EchoGPT includes four models tuned for different jobs: Turbo (fast, terse answers), Pro (balanced, structured reasoning), Vision (image and diagram understanding), and Code (code review and debugging). You can switch between them mid-conversation.',
  },
  {
    question: "What's the difference between the extension and the web app?",
    answer:
      'The Chrome extension opens as a persistent side panel so you can chat, summarize pages, and explain selected text without leaving whatever site you are on. The web app is the full workspace for longer sessions, chat history, and the Image & Video Studio. Both share the same account and chat history.',
  },
  {
    question: 'Does EchoGPT store my chat data?',
    answer:
      'Your chats are saved to your account so you can revisit them in History, and you can delete any conversation at any time. Page-context sharing is opt-in per chat — you decide whether the current page is included before you ask a question.',
  },
  {
    question: 'Can I use EchoGPT on mobile?',
    answer:
      'The web app is fully responsive and works in any mobile browser. The Chrome side-panel extension is desktop-only today, since it relies on Chrome APIs that are not available on mobile browsers.',
  },
  {
    question: 'What is Compare mode?',
    answer:
      'Compare mode sends a single prompt to multiple EchoGPT models at once and shows their responses side by side, so you can quickly judge which answer fits best before continuing the conversation with that model.',
  },
  {
    question: 'How does page summarization work?',
    answer:
      'Click the summarize action in the sidebar while reading any article or webpage, and EchoGPT reads the visible page content and returns a concise summary — handy for long reports, docs, or news articles.',
  },
  {
    question: 'Can I cancel or change my plan anytime?',
    answer:
      'Yes, you can upgrade, downgrade, or cancel from Settings > Subscriptions at any time. Changes take effect at the start of your next billing cycle, and downgrading never deletes your chat history.',
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const reduceMotion = useReducedMotion()
  const baseId = useId()

  return (
    <AnimatedSection
      id="faq"
      ariaLabelledby="faq-heading"
      className="mx-auto max-w-4xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <SectionHeading eyebrow="FAQ" id="faq-heading" title="Frequently asked questions" />

      <AnimatedItem className="mt-10 flex flex-col gap-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index
          const buttonId = `${baseId}-button-${index}`
          const panelId = `${baseId}-panel-${index}`
          return (
            <div
              key={faq.question}
              className="overflow-hidden rounded-card border border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark"
            >
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 sm:text-base dark:text-text-dark"
                >
                  {faq.question}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-text-muted-light transition-transform duration-200 dark:text-text-muted-dark ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm leading-relaxed text-text-muted-light dark:text-text-muted-dark">
                      {faq.answer}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )
        })}
      </AnimatedItem>
    </AnimatedSection>
  )
}
