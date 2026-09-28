import { Code2, Eye, Sparkles } from 'lucide-react'
import { SidebarStrip } from './SidebarStrip'

const columns = [
  {
    name: 'EchoGPT Turbo',
    icon: Sparkles,
    reply: 'Quick take: 3 tiers, clear feature gates, yearly saves ~20%. Good for a fast skim.',
  },
  {
    name: 'EchoGPT Pro',
    icon: Eye,
    reply:
      'Structured summary: (1) Free covers core chat, (2) Pro unlocks Compare + Studio, (3) Team adds shared connectors and admin controls.',
  },
  {
    name: 'EchoGPT Code',
    icon: Code2,
    reply: 'Noticed a pattern here — this reads like a typical 3-tier SaaS ladder with a seat-based Team plan.',
  },
]

/** Static recreation of Compare mode: one prompt, several model replies side by side. */
export function CompareMockup() {
  return (
    <div className="flex h-[360px] sm:h-[420px]" aria-hidden="true">
      <SidebarStrip />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-border-light px-4 py-3 sm:px-6 dark:border-border-dark">
          <div className="rounded-xl border border-border-light bg-bg-light px-3 py-2 text-xs text-text-muted-light sm:text-sm dark:border-border-dark dark:bg-white/5 dark:text-text-muted-dark">
            Summarize this pricing page for me
          </div>
        </div>
        <div className="grid flex-1 grid-cols-1 divide-y divide-border-light overflow-hidden sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-border-dark">
          {columns.map(({ name, icon: Icon, reply }) => (
            <div key={name} className="flex min-h-0 flex-col gap-2 p-3 sm:p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-text-light sm:text-sm dark:text-text-dark">
                <Icon className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                {name}
              </div>
              <p className="text-xs leading-relaxed text-text-muted-light sm:text-sm dark:text-text-muted-dark">
                {reply}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
