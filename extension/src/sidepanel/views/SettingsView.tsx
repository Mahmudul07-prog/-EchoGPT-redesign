import { useState, type ReactNode } from 'react'
import { Info, Keyboard, LogIn, Monitor, Moon, ShieldCheck, Sun, Trash2 } from 'lucide-react'
import ConfirmDialog from '../../components/ConfirmDialog'
import SegmentedControl from '../../components/SegmentedControl'
import Switch from '../../components/Switch'
import { MODELS } from '../../lib/mockAi'
import { getAppVersion } from '../../lib/version'
import { useSessionStore } from '../../store/sessionStore'
import { useSettingsStore } from '../../store/settingsStore'
import type { ThemePreference } from '../../types'

const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform || navigator.userAgent)
const shortcutLabel = isMac ? 'Cmd+Shift+E' : 'Ctrl+Shift+E'

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-card border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark">
      <h3 className="mb-3 text-sm font-semibold text-text-light dark:text-text-dark">{title}</h3>
      {children}
    </section>
  )
}

export default function SettingsView() {
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const defaultModel = useSettingsStore((s) => s.defaultModel)
  const setDefaultModel = useSettingsStore((s) => s.setDefaultModel)
  const includePageContext = useSettingsStore((s) => s.includePageContext)
  const setIncludePageContext = useSettingsStore((s) => s.setIncludePageContext)

  const sessionCount = useSessionStore((s) => s.sessions.length)
  const clearAll = useSessionStore((s) => s.clearAll)
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)

  return (
    <div className="h-full min-h-0 overflow-y-auto px-3 py-4 sm:px-4">
      <h2 className="mb-3 font-display text-base font-semibold tracking-tight text-text-light dark:text-text-dark">
        Settings
      </h2>

      <div className="flex flex-col gap-3">
        <SectionCard title="Appearance">
          <SegmentedControl<ThemePreference>
            value={theme}
            onChange={setTheme}
            legend="Theme"
            options={[
              { value: 'light', label: 'Light', icon: <Sun size={14} /> },
              { value: 'dark', label: 'Dark', icon: <Moon size={14} /> },
              { value: 'system', label: 'System', icon: <Monitor size={14} /> },
            ]}
          />
        </SectionCard>

        <SectionCard title="Default model">
          <div className="flex flex-col gap-1.5">
            {MODELS.map((model) => (
              <label
                key={model.id}
                className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-transparent p-2 transition-colors hover:bg-brand-50 has-[:checked]:border-brand-300 has-[:checked]:bg-brand-50 dark:hover:bg-white/5 dark:has-[:checked]:border-brand-700 dark:has-[:checked]:bg-white/10"
              >
                <input
                  type="radio"
                  name="default-model"
                  className="mt-1 accent-brand-600"
                  checked={defaultModel === model.id}
                  onChange={() => setDefaultModel(model.id)}
                />
                <span className="flex flex-col">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-text-light dark:text-text-dark">
                    {model.name}
                    {model.badge && (
                      <span className="rounded-pill bg-gold-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-gold-500">
                        {model.badge}
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-text-muted-light dark:text-text-muted-dark">{model.description}</span>
                </span>
              </label>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Page awareness">
          <Switch
            id="include-page-context"
            checked={includePageContext}
            onChange={setIncludePageContext}
            label="Include page context"
            description="Let EchoGPT read the current page's text to ground summaries and answers."
          />
        </SectionCard>

        <SectionCard title="Account">
          <button
            type="button"
            disabled
            title="Demo only — no real authentication in this concept"
            className="flex w-full items-center justify-center gap-2 rounded-pill border border-border-light px-4 py-2 text-sm font-medium text-text-muted-light opacity-70 dark:border-border-dark dark:text-text-muted-dark"
          >
            <LogIn size={15} />
            Sign in with Google
          </button>
          <p className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">
            You're using EchoGPT as a guest. Sign-in is a visual placeholder in this concept — it
            never sends a real credential anywhere.
          </p>
        </SectionCard>

        <SectionCard title="Data">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
              {sessionCount === 0 ? 'No conversations stored locally.' : `${sessionCount} conversation${sessionCount === 1 ? '' : 's'} stored locally.`}
            </p>
            <button
              type="button"
              onClick={() => setConfirmClearOpen(true)}
              disabled={sessionCount === 0}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-pill border border-danger-500/40 px-3 py-1.5 text-xs font-medium text-danger-500 transition hover:bg-danger-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500 focus-visible:ring-offset-2 disabled:opacity-40"
            >
              <Trash2 size={13} />
              Clear all conversations
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Keyboard shortcut">
          <div className="flex items-center gap-2 text-sm text-text-light dark:text-text-dark">
            <Keyboard size={16} className="text-text-muted-light dark:text-text-muted-dark" />
            Toggle the side panel from any tab:
            <kbd className="rounded-md border border-border-light bg-bg-light px-1.5 py-0.5 font-mono text-xs dark:border-border-dark dark:bg-black/30">
              {shortcutLabel}
            </kbd>
          </div>
        </SectionCard>

        <SectionCard title="About">
          <div className="flex items-start gap-2 text-xs text-text-muted-light dark:text-text-muted-dark">
            <ShieldCheck size={26} className="shrink-0 text-brand-500" />
            <p>
              EchoGPT — Multi-AI Chat Sidebar (redesign concept), version {getAppVersion()}. All replies in
              this build are generated locally by a simulated AI layer for demo purposes — no real model,
              account, or network request is involved, and nothing you type ever leaves your browser.
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-text-muted-light dark:text-text-muted-dark">
            <Info size={12} />
            Built with React, Tailwind CSS and Framer Motion on Manifest V3.
          </div>
        </SectionCard>
      </div>

      <ConfirmDialog
        open={confirmClearOpen}
        title="Clear all conversations?"
        description="This permanently deletes every stored chat on this device. This can't be undone."
        confirmLabel="Clear all"
        danger
        onCancel={() => setConfirmClearOpen(false)}
        onConfirm={() => {
          clearAll()
          setConfirmClearOpen(false)
        }}
      />
    </div>
  )
}
