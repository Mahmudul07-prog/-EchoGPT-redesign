import { Lock, RotateCw } from 'lucide-react'
import type { ReactNode } from 'react'

interface BrowserFrameProps {
  url?: string
  children: ReactNode
  className?: string
}

/**
 * A static HTML/CSS recreation of a browser chrome window (traffic-light
 * dots + address bar) used to frame product-preview mockups without any
 * external image assets.
 */
export function BrowserFrame({ url = 'app.echogpt.live', children, className = '' }: BrowserFrameProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border-light bg-surface-light shadow-[0_24px_60px_-20px_rgba(124,58,237,0.35)] dark:border-border-dark dark:bg-surface-dark ${className}`}
      role="img"
      aria-label={`Illustrative preview of the EchoGPT web app showing ${url}`}
    >
      <div className="flex items-center gap-3 border-b border-border-light bg-bg-light/80 px-4 py-3 dark:border-border-dark dark:bg-bg-dark/60">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-danger-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-success-500/80" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-pill border border-border-light bg-surface-light px-3 py-1.5 dark:border-border-dark dark:bg-white/5">
          <Lock className="h-3 w-3 shrink-0 text-text-muted-light dark:text-text-muted-dark" aria-hidden="true" />
          <span className="truncate text-xs text-text-muted-light dark:text-text-muted-dark">{url}</span>
        </div>
        <RotateCw className="h-3.5 w-3.5 shrink-0 text-text-muted-light dark:text-text-muted-dark" aria-hidden="true" />
      </div>
      {children}
    </div>
  )
}
