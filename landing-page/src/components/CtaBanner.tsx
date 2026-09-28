import { AnimatedItem, AnimatedSection } from './AnimatedSection'
import { AddToChromeButton, TryWebAppButton } from './Buttons'

export function CtaBanner() {
  return (
    <AnimatedSection ariaLabelledby="cta-heading" className="px-4 py-16 sm:px-6 lg:px-8">
      <AnimatedItem className="mx-auto max-w-5xl overflow-hidden rounded-card bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 px-6 py-14 text-center shadow-[0_30px_70px_-24px_rgba(124,58,237,0.6)] sm:px-12">
        <h2 id="cta-heading" className="text-balance font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
          Bring every AI model into one workspace
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-balance text-brand-50/90">
          Free to start, no credit card required. Add the Chrome side panel or jump straight into
          the web app.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <AddToChromeButton size="lg" className="!bg-white !text-brand-700 hover:!brightness-95" />
          <TryWebAppButton size="lg" className="!border-white/40 !text-white hover:!bg-white/10" />
        </div>
      </AnimatedItem>
    </AnimatedSection>
  )
}
