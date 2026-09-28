import { Clapperboard, Columns3, History, ImagePlay, MessageSquarePlus, Plug, Settings, Workflow } from 'lucide-react'

const items = [
  { icon: MessageSquarePlus, label: 'New chat', active: true },
  { icon: Columns3, label: 'Compare' },
  { icon: ImagePlay, label: 'Image studio' },
  { icon: Clapperboard, label: 'Video studio' },
  { icon: Plug, label: 'Connectors' },
  { icon: Workflow, label: 'AI tasks' },
  { icon: History, label: 'History' },
]

/**
 * Narrow icon-only sidebar strip used inside the fake browser mockups,
 * echoing the real EchoGPT web app's left-nav vocabulary.
 */
export function SidebarStrip() {
  return (
    <div
      className="hidden w-14 shrink-0 flex-col items-center gap-1 border-r border-border-light bg-sidebar-light py-3 sm:flex dark:border-border-dark dark:bg-sidebar-dark"
      aria-hidden="true"
    >
      {items.map(({ icon: Icon, label, active }) => (
        <div
          key={label}
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            active
              ? 'bg-gradient-to-br from-brand-600 to-accent-600 text-white'
              : 'text-text-muted-light dark:text-text-muted-dark'
          }`}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
      ))}
      <div className="mt-auto flex h-9 w-9 items-center justify-center rounded-xl text-text-muted-light dark:text-text-muted-dark">
        <Settings className="h-4 w-4" strokeWidth={1.75} />
      </div>
    </div>
  )
}
