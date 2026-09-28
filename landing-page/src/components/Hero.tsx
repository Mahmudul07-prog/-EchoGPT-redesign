import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'
import { AnimatedItem, AnimatedSection } from './AnimatedSection'
import { AddToChromeButton, TryWebAppButton } from './Buttons'
import { ChatMockup } from './mockups/ChatMockup'
import { BrowserFrame } from './mockups/BrowserFrame'

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatedSection
      id="top"
      ariaLabelledby="hero-heading"
      className="relative scroll-mt-20 overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand-400/25 blur-3xl dark:bg-brand-600/20" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <div className="flex flex-col items-start gap-6">
          <AnimatedItem>
            <span className="inline-flex items-center gap-1.5 rounded-pill border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-800/60 dark:bg-white/5 dark:text-brand-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              New: Compare mode &amp; AI Task automations
            </span>
          </AnimatedItem>

          <AnimatedItem>
            <h1
              id="hero-heading"
              className="text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight text-text-light md:text-6xl dark:text-text-dark"
            >
              One workspace for <span className="bg-gradient-to-r from-brand-600 via-accent-500 to-gold-500 bg-clip-text text-transparent">every AI model</span>
            </h1>
          </AnimatedItem>

          <AnimatedItem>
            <p className="max-w-xl text-balance text-lg text-text-muted-light md:text-xl dark:text-text-muted-dark">
              Chat, compare, and create with multiple AI models from a single fast workspace — in
              your browser sidebar and on the web. No tab juggling, no copy-pasting between apps.
            </p>
          </AnimatedItem>

          <AnimatedItem className="flex flex-col gap-3 sm:flex-row">
            <AddToChromeButton size="lg" />
            <TryWebAppButton size="lg" />
          </AnimatedItem>

          <AnimatedItem className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-text-muted-light dark:text-text-muted-dark">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              No credit card required
            </span>
            <span>Free plan available</span>
            <span>Chrome side panel + web app</span>
          </AnimatedItem>
        </div>

        <AnimatedItem className="relative">
          <motion.div
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94, y: reduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <BrowserFrame url="app.echogpt.live/chat">
              <ChatMockup />
            </BrowserFrame>
          </motion.div>
          <div
            aria-hidden="true"
            className="absolute -right-4 -top-6 hidden rounded-2xl border border-border-light bg-surface-light px-4 py-3 shadow-[0_16px_40px_-12px_rgba(124,58,237,0.4)] sm:block dark:border-border-dark dark:bg-surface-dark"
          >
            <p className="text-xs font-semibold text-text-light dark:text-text-dark">4 models, 1 thread</p>
            <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark">Turbo · Pro · Vision · Code</p>
          </div>
        </AnimatedItem>
      </div>
    </AnimatedSection>
  )
}
