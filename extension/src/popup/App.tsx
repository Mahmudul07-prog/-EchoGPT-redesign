import { useEffect, useMemo, useState } from 'react'
import { FileText, ScanText, Settings as SettingsIcon } from 'lucide-react'
import Logo from '../components/Logo'
import ModelPicker from '../components/ModelPicker'
import SessionListItem from '../components/SessionListItem'
import { isExtensionEnv } from '../lib/chrome-shim'
import { fetchSelectionText } from '../lib/pageContext'
import { setPendingAction, setPendingNav } from '../lib/storage'
import { useSessionStore } from '../store/sessionStore'
import { useSettingsStore } from '../store/settingsStore'

const SHORTCUT_LABEL =
  typeof navigator !== 'undefined' && /Mac/.test(navigator.platform || navigator.userAgent)
    ? 'Cmd+Shift+E'
    : 'Ctrl+Shift+E'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 5) return 'Working late?'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

/** Opens the side panel for the current window. Chrome requires sidePanel.open() to run inside
 * a user-gesture call chain, so every caller here invokes it directly from a click handler. */
async function openSidePanel(): Promise<void> {
  const win = await chrome.windows.getCurrent()
  if (win.id !== undefined) await chrome.sidePanel.open({ windowId: win.id })
}

export default function App() {
  const hydrateSettings = useSettingsStore((s) => s.hydrate)
  const defaultModel = useSettingsStore((s) => s.defaultModel)
  const setDefaultModel = useSettingsStore((s) => s.setDefaultModel)

  const hydrateSessions = useSessionStore((s) => s.hydrate)
  const sessions = useSessionStore((s) => s.sessions)

  const [busyAction, setBusyAction] = useState<string | null>(null)

  useEffect(() => {
    void hydrateSettings()
    void hydrateSessions()
  }, [hydrateSettings, hydrateSessions])

  const recentSessions = useMemo(() => [...sessions].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3), [sessions])

  async function withBusy(key: string, fn: () => Promise<void>) {
    if (busyAction) return
    setBusyAction(key)
    try {
      await fn()
      window.close()
    } catch {
      setBusyAction(null)
    }
  }

  function handleOpenPanel() {
    if (!isExtensionEnv) return
    void withBusy('open', openSidePanel)
  }

  function handleSummarizePage() {
    if (!isExtensionEnv) return
    void withBusy('summarize', async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      await setPendingAction({ type: 'summarize-page', url: tab?.url ?? '' })
      await openSidePanel()
    })
  }

  function handleExplainSelection() {
    if (!isExtensionEnv) return
    void withBusy('explain', async () => {
      const text = await fetchSelectionText()
      await setPendingAction({ type: 'explain', text })
      await openSidePanel()
    })
  }

  function handleOpenSettings() {
    if (!isExtensionEnv) return
    void withBusy('settings', async () => {
      await setPendingNav('settings')
      await openSidePanel()
    })
  }

  function handleOpenSession(sessionId: string) {
    if (!isExtensionEnv) return
    void withBusy(`session-${sessionId}`, async () => {
      await setPendingNav({ view: 'session', sessionId })
      await openSidePanel()
    })
  }

  const disabledTitle = isExtensionEnv ? undefined : 'Available once loaded as an extension.'

  return (
    <div className="flex h-[500px] w-[360px] flex-col overflow-y-auto bg-bg-light font-body text-text-light dark:bg-bg-dark dark:text-text-dark">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-2.5">
          <Logo size={32} />
          <div className="min-w-0">
            <p className="font-display text-base font-semibold leading-tight tracking-tight">EchoGPT</p>
            <p className="truncate text-xs text-text-muted-light dark:text-text-muted-dark">
              {getGreeting()} — ready when you are.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenPanel}
          disabled={!isExtensionEnv || busyAction !== null}
          title={disabledTitle}
          className="w-full rounded-pill bg-gradient-to-r from-brand-600 to-accent-600 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Open EchoGPT
        </button>

        <div className="flex items-center justify-between rounded-card border border-border-light bg-surface-light px-3 py-2 dark:border-border-dark dark:bg-surface-dark">
          <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark">Model</span>
          <ModelPicker value={defaultModel} onChange={setDefaultModel} variant="compact" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleSummarizePage}
            disabled={!isExtensionEnv || busyAction !== null}
            title={disabledTitle}
            className="flex flex-col items-center gap-1 rounded-card border border-border-light bg-surface-light px-2 py-2.5 text-xs font-medium transition hover:border-brand-300 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-border-dark dark:bg-surface-dark dark:hover:bg-white/5"
          >
            <FileText size={16} className="text-brand-500" />
            Summarize this page
          </button>
          <button
            type="button"
            onClick={handleExplainSelection}
            disabled={!isExtensionEnv || busyAction !== null}
            title={disabledTitle}
            className="flex flex-col items-center gap-1 rounded-card border border-border-light bg-surface-light px-2 py-2.5 text-xs font-medium transition hover:border-brand-300 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-border-dark dark:bg-surface-dark dark:hover:bg-white/5"
          >
            <ScanText size={16} className="text-brand-500" />
            Explain selection
          </button>
        </div>

        <div className="min-w-0">
          <p className="mb-1 px-1 text-xs font-semibold text-text-muted-light dark:text-text-muted-dark">
            Recent chats
          </p>
          {recentSessions.length === 0 ? (
            <p className="rounded-card border border-dashed border-border-light px-3 py-3 text-xs text-text-muted-light dark:border-border-dark dark:text-text-muted-dark">
              No conversations yet — open EchoGPT to start one.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {recentSessions.map((session) => (
                <SessionListItem key={session.id} session={session} onOpen={() => handleOpenSession(session.id)} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border-light px-4 py-2.5 dark:border-border-dark">
        <span className="text-[11px] text-text-muted-light dark:text-text-muted-dark">
          Shortcut: <kbd className="rounded border border-border-light px-1 py-0.5 font-mono dark:border-border-dark">{SHORTCUT_LABEL}</kbd>
        </span>
        <button
          type="button"
          onClick={handleOpenSettings}
          disabled={!isExtensionEnv || busyAction !== null}
          title={disabledTitle ?? 'Settings'}
          aria-label="Open EchoGPT settings"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-muted-light transition hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:text-text-muted-dark dark:hover:bg-white/10 dark:hover:text-brand-300"
        >
          <SettingsIcon size={16} />
        </button>
      </div>
    </div>
  )
}
