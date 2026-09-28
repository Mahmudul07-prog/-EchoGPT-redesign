import { Check, Sparkles } from 'lucide-react'
import { useId, useState } from 'react'
import { AnimatedItem, AnimatedSection } from './AnimatedSection'
import { PrimaryButton, SecondaryButton } from './Buttons'
import { SectionHeading } from './SectionHeading'
import { useToast } from '../lib/toast-context'

interface Tier {
  name: string
  monthly: number
  yearly: number
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
}

const TIERS: Tier[] = [
  {
    name: 'Free',
    monthly: 0,
    yearly: 0,
    description: 'Get started with core chat, no card required.',
    features: [
      'EchoGPT Turbo model',
      '1 model at a time',
      'Basic page summarization',
      'Community support',
    ],
    cta: 'Add to Chrome — it\'s free',
  },
  {
    name: 'Pro',
    monthly: 12,
    yearly: 9,
    description: 'Every model, every tool, for individual power users.',
    features: [
      'Everything in Free',
      'All 4 EchoGPT models, incl. Vision & Code',
      'Side-by-side Compare mode',
      'Image & video studio',
      'Priority response speed',
    ],
    highlighted: true,
    cta: 'Start Pro trial',
  },
  {
    name: 'Team',
    monthly: 29,
    yearly: 23,
    description: 'Shared workflows and admin controls for teams.',
    features: [
      'Everything in Pro',
      'Shared connectors & AI Task library',
      'Centralized billing & seat management',
      'Admin controls & usage insights',
      'Priority support',
    ],
    cta: 'Talk to sales',
  },
]

export function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const { showToast } = useToast()
  const switchId = useId()

  return (
    <AnimatedSection
      id="pricing"
      ariaLabelledby="pricing-heading"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <SectionHeading
        id="pricing-heading"
        eyebrow="Pricing"
        title="Simple plans that grow with you"
        subtitle="Start free, upgrade when you need more models and more power. No hidden fees, cancel anytime."
      />

      <AnimatedItem className="mt-10 flex items-center justify-center gap-3">
        <span
          className={`text-sm font-medium ${billing === 'monthly' ? 'text-text-light dark:text-text-dark' : 'text-text-muted-light dark:text-text-muted-dark'}`}
        >
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={billing === 'yearly'}
          aria-labelledby={switchId}
          onClick={() => setBilling((b) => (b === 'monthly' ? 'yearly' : 'monthly'))}
          className="relative h-7 w-[52px] shrink-0 rounded-pill bg-brand-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-light dark:bg-brand-900 dark:focus-visible:ring-offset-bg-dark"
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-gradient-to-br from-brand-600 to-accent-600 shadow-sm transition-transform duration-200 ${
              billing === 'yearly' ? 'translate-x-[26px]' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span
          id={switchId}
          className={`text-sm font-medium ${billing === 'yearly' ? 'text-text-light dark:text-text-dark' : 'text-text-muted-light dark:text-text-muted-dark'}`}
        >
          Yearly <span className="text-brand-600 dark:text-brand-400">— save ~20%</span>
        </span>
      </AnimatedItem>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const price = billing === 'monthly' ? tier.monthly : tier.yearly
          return (
            <AnimatedItem key={tier.name}>
              <div
                className={`relative flex h-full flex-col rounded-card border p-7 ${
                  tier.highlighted
                    ? 'border-brand-500 bg-gradient-to-b from-brand-50 to-transparent shadow-[0_20px_50px_-16px_rgba(124,58,237,0.4)] dark:border-brand-500/60 dark:from-brand-900/30'
                    : 'border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark'
                }`}
              >
                {tier.highlighted ? (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-pill bg-gradient-to-r from-brand-600 to-accent-600 px-3 py-1 text-xs font-semibold text-white">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Most popular
                  </span>
                ) : null}
                <h3 className="font-display text-xl font-bold text-text-light dark:text-text-dark">{tier.name}</h3>
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">{tier.description}</p>
                <p className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-text-light dark:text-text-dark">
                    ${price}
                  </span>
                  <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                    {price === 0 ? '' : '/ mo'}
                  </span>
                </p>
                {billing === 'yearly' && price > 0 ? (
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark">billed annually</p>
                ) : null}
                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-text-light dark:text-text-dark">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-500" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {tier.highlighted ? (
                  <PrimaryButton
                    className="mt-7 w-full"
                    onClick={() => showToast('Coming soon — checkout is not wired up in this demo.')}
                  >
                    {tier.cta}
                  </PrimaryButton>
                ) : (
                  <SecondaryButton
                    className="mt-7 w-full"
                    onClick={() => showToast('Coming soon — checkout is not wired up in this demo.')}
                  >
                    {tier.cta}
                  </SecondaryButton>
                )}
              </div>
            </AnimatedItem>
          )
        })}
      </div>
    </AnimatedSection>
  )
}
