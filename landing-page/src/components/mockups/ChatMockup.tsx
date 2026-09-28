import { Mic, Plus, SendHorizontal, Sparkles } from 'lucide-react'
import { SidebarStrip } from './SidebarStrip'

/**
 * Static recreation of the EchoGPT chat view: sidebar strip + message
 * thread + composer, all plain divs per the "no external image asset"
 * constraint.
 */
export function ChatMockup() {
  return (
    <div className="flex h-[360px] sm:h-[420px]" aria-hidden="true">
      <SidebarStrip />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 space-y-4 overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex justify-end">
            <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-brand-600 to-accent-600 px-4 py-2.5 text-sm text-white shadow-sm">
              Compare how Turbo and Pro would summarize this pricing page for me.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white">
              <Sparkles className="h-3 w-3" />
            </span>
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-border-light bg-surface-light px-4 py-2.5 text-sm text-text-light shadow-sm dark:border-border-dark dark:bg-white/5 dark:text-text-dark">
              Sure — here's a three-bullet summary, plus the key pricing tiers and who each plan
              fits best.
              <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-[2px] animate-caret-blink bg-brand-500 align-middle" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pl-8">
            <span className="rounded-pill border border-border-light bg-surface-light px-3 py-1 text-xs text-text-muted-light dark:border-border-dark dark:bg-white/5 dark:text-text-muted-dark">
              Summarize this page
            </span>
            <span className="rounded-pill border border-border-light bg-surface-light px-3 py-1 text-xs text-text-muted-light dark:border-border-dark dark:bg-white/5 dark:text-text-muted-dark">
              Explain selected text
            </span>
          </div>
        </div>
        <div className="border-t border-border-light p-3 sm:p-4 dark:border-border-dark">
          <div className="flex items-center gap-2 rounded-pill border border-border-light bg-bg-light px-3 py-2 dark:border-border-dark dark:bg-white/5">
            <span className="hidden shrink-0 items-center gap-1 rounded-pill bg-brand-100 px-2 py-1 text-[11px] font-semibold text-brand-700 sm:flex dark:bg-brand-900/40 dark:text-brand-300">
              EchoGPT Turbo
            </span>
            <Plus className="h-4 w-4 shrink-0 text-text-muted-light dark:text-text-muted-dark" />
            <span className="flex-1 truncate text-sm text-text-muted-light dark:text-text-muted-dark">
              Ask a question…
            </span>
            <Mic className="h-4 w-4 shrink-0 text-text-muted-light dark:text-text-muted-dark" />
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-accent-600 text-white">
              <SendHorizontal className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
