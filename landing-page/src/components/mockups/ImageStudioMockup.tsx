import { ImagePlay, SendHorizontal, Wand2 } from 'lucide-react'
import { SidebarStrip } from './SidebarStrip'

const tiles = [
  'from-brand-400 to-accent-500',
  'from-accent-500 to-gold-400',
  'from-brand-600 to-brand-300',
  'from-gold-400 to-accent-600',
]

/** Static recreation of the Image Studio view: prompt bar + generated-tile grid. */
export function ImageStudioMockup() {
  return (
    <div className="flex h-[360px] sm:h-[420px]" aria-hidden="true">
      <SidebarStrip />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-border-light px-4 py-3 sm:px-6 dark:border-border-dark">
          <ImagePlay className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-semibold text-text-light sm:text-sm dark:text-text-dark">Image Studio</span>
          <span className="ml-auto rounded-pill bg-gold-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-500">
            Pro
          </span>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2.5 p-3 sm:gap-3 sm:p-4">
          {tiles.map((gradient, index) => (
            <div
              key={index}
              className={`rounded-xl bg-gradient-to-br ${gradient} opacity-80 shadow-inner`}
            />
          ))}
        </div>
        <div className="border-t border-border-light p-3 sm:p-4 dark:border-border-dark">
          <div className="flex items-center gap-2 rounded-pill border border-border-light bg-bg-light px-3 py-2 dark:border-border-dark dark:bg-white/5">
            <Wand2 className="h-4 w-4 shrink-0 text-text-muted-light dark:text-text-muted-dark" />
            <span className="flex-1 truncate text-sm text-text-muted-light dark:text-text-muted-dark">
              A gradient hero illustration for a productivity app…
            </span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-accent-600 text-white">
              <SendHorizontal className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
