import { useState } from "react";
import { Check, Crown, Wallet } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Dialog } from "../components/Dialog";
import { useSettingsStore } from "../store/settingsStore";
import { useUiStore } from "../store/uiStore";
import type { BillingCycle, PlanId } from "../types";
import { cn } from "../lib/utils";

interface Tier {
  id: PlanId;
  name: string;
  monthly: number;
  yearly: number;
  tagline: string;
  features: string[];
  highlighted?: boolean;
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    tagline: "Try the core experience",
    features: ["EchoGPT Turbo & Mini access", "20 messages per day", "Basic connectors", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 12,
    yearly: 120,
    tagline: "For everyday power users",
    highlighted: true,
    features: [
      "Everything in Free",
      "Unlimited messages",
      "EchoGPT Pro & Vision access",
      "Image Studio & Video Studio",
      "Compare mode across 3 models",
      "Priority support",
    ],
  },
  {
    id: "team",
    name: "Team",
    monthly: 32,
    yearly: 320,
    tagline: "Shared workspace for teams",
    features: ["Everything in Pro", "Shared chat history", "Centralized billing", "Admin controls", "Priority onboarding"],
  },
];

export default function SubscriptionsPage() {
  const plan = useSettingsStore((s) => s.plan);
  const setPlan = useSettingsStore((s) => s.setPlan);
  const billingCycle = useSettingsStore((s) => s.billingCycle);
  const setBillingCycle = useSettingsStore((s) => s.setBillingCycle);
  const addToast = useUiStore((s) => s.addToast);

  const [modalTier, setModalTier] = useState<Tier | null>(null);

  function handleConfirmUpgrade() {
    if (!modalTier) return;
    setPlan(modalTier.id);
    addToast(`You're now on the ${modalTier.name} plan (demo only — no payment was processed).`, "success");
    setModalTier(null);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <PageHeader
        title="Subscriptions"
        description="Compare plans. Upgrading here is entirely simulated — this demo never collects payment details."
        icon={<Wallet size={20} strokeWidth={1.75} />}
        action={
          <div className="inline-flex items-center gap-1 rounded-full border border-border-light bg-surface-light p-1 dark:border-border-dark dark:bg-surface-dark">
            {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setBillingCycle(cycle)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition",
                  billingCycle === cycle
                    ? "bg-gradient-to-r from-brand-600 to-accent-600 text-white"
                    : "text-text-muted-light hover:text-text-light dark:text-text-muted-dark dark:hover:text-text-dark",
                )}
              >
                {cycle === "yearly" ? "Yearly – 2 months free" : "Monthly"}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {TIERS.map((tier) => {
          const price = billingCycle === "monthly" ? tier.monthly : tier.yearly;
          const isCurrent = plan === tier.id;
          return (
            <div
              key={tier.id}
              className={cn(
                "flex flex-col gap-4 rounded-card border p-6",
                tier.highlighted
                  ? "border-brand-400 bg-gradient-to-b from-brand-50 to-surface-light shadow-[0_8px_40px_-10px_rgba(124,58,237,0.35)] dark:border-brand-600 dark:from-brand-500/10 dark:to-surface-dark"
                  : "border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark",
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-semibold text-text-light dark:text-text-dark">{tier.name}</p>
                {tier.highlighted && <Crown size={18} strokeWidth={2} className="text-gold-500" />}
              </div>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{tier.tagline}</p>
              <p className="font-display text-3xl font-semibold tracking-tight text-text-light dark:text-text-dark">
                ${price}
                <span className="text-sm font-normal text-text-muted-light dark:text-text-muted-dark">
                  /{billingCycle === "monthly" ? "mo" : "yr"}
                </span>
              </p>
              <ul className="flex-1 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-light dark:text-text-dark">
                    <Check size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-success-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={isCurrent}
                onClick={() => setModalTier(tier)}
                className={cn(
                  "rounded-full px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                  isCurrent
                    ? "cursor-default bg-black/5 text-text-muted-light dark:bg-white/5 dark:text-text-muted-dark"
                    : "bg-gradient-to-r from-brand-600 to-accent-600 text-white hover:brightness-110 active:scale-[0.97]",
                )}
              >
                {isCurrent ? "Your current plan" : `Upgrade to ${tier.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <Dialog
        open={modalTier !== null}
        onClose={() => setModalTier(null)}
        titleId="upgrade-modal-title"
        title={modalTier ? `Upgrade to ${modalTier.name}` : "Upgrade"}
      >
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
          This is a demo — no real payment is processed, and no card details are ever collected here.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setModalTier(null)}
            className="rounded-full border border-border-light px-4 py-2 text-sm font-medium text-text-light transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:border-border-dark dark:text-text-dark dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmUpgrade}
            className="rounded-full bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Confirm (demo)
          </button>
        </div>
      </Dialog>
    </div>
  );
}
