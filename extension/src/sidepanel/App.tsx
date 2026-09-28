import { useEffect, useState, type ReactNode } from 'react'
import { History as HistoryIcon, Monitor, Moon, Settings as SettingsIcon, SquarePen, Sun } from 'lucide-react'
import IconButton from '../components/IconButton'
import Logo from '../components/Logo'
import ModelPicker from '../components/ModelPicker'
import ChatView from './views/ChatView'
import HistoryView from './views/HistoryView'
import SettingsView from './views/SettingsView'
import {
  STORAGE_KEYS,
  clearPendingAction,
  clearPendingNav,
  getPendingAction,
  getPendingNav,
  onStorageChanged,
} from '../lib/storage'
import type { ModelId } from '../lib/mockAi'
import { useSessionStore } from '../store/sessionStore'
import { useSettingsStore } from '../store/settingsStore'
import type { PendingAction, PendingNav, ThemePreference } from '../types'

type View = 'chat' | 'history' | 'settings'

const THEME_ORDER: ThemePreference[] = ['light', 'dark', 'system']
const THEME_ICON: Record<ThemePreference, ReactNode> = {
  light: <Sun size={17} />,
  dark: <Moon size={17} />,
  system: <Monitor size={17} />,
}

function SplashScreen() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-bg-light dark:bg-bg-dark">
      <Logo size={40} />
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Loading EchoGPT…</p>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<View>('chat')
  const [incomingAction, setIncomingAction] = useState<PendingAction | null>(null)
  const [ready, setReady] = useState(false)

  const hydrateSettings = useSettingsStore((s) => s.hydrate)
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const defaultModel = useSettingsStore((s) => s.defaultModel)
  const setDefaultModel = useSettingsStore((s) => s.setDefaultModel)

  const hydrateSessions = useSessionStore((s) => s.hydrate)
  const sessions = useSessionStore((s) => s.sessions)
  const activeSessionId = useSessionStore((s) => s.activeSessionId)
  const activeSession = sessions.find((s) => s.id === activeSessionId)
  const createSession = useSessionStore((s) => s.createSession)
  const setActiveSessionId = useSessionStore((s) => s.setActiveSessionId)
  const setSessionModel = useSessionStore((s) => s.setSessionModel)

  useEffect(() => {
    let alive = true

    function applyPendingNav(nav: PendingNav) {
      if (nav === 'settings') {
        setView('settings')
      } else if (nav === 'history') {
        setView('history')
      } else if (typeof nav === 'object' && nav.view === 'session') {
        setActiveSessionId(nav.sessionId)
        setView('chat')
      }
    }

    async function init() {
      await Promise.all([hydrateSettings(), hydrateSessions()])
      const [pendingNav, pendingAction] = await Promise.all([getPendingNav(), getPendingAction()])
      if (!alive) return
      if (pendingNav) {
        applyPendingNav(pendingNav)
        void clearPendingNav()
      }
      if (pendingAction) {
        setView('chat')
        setIncomingAction(pendingAction)
        void clearPendingAction()
      }
      setReady(true)
    }
    void init()

    // Picks up a pending action/nav written by the popup or a context-menu click while this
    // panel is already open, not just what was there at initial mount.
    const unsubscribe = onStorageChanged((changes) => {
      const navChange = changes[STORAGE_KEYS.pendingNav]
      if (navChange && navChange.newValue !== undefined) {
        applyPendingNav(navChange.newValue as PendingNav)
        void clearPendingNav()
      }
      const actionChange = changes[STORAGE_KEYS.pendingAction]
      if (actionChange && actionChange.newValue !== undefined) {
        setView('chat')
        setIncomingAction(actionChange.newValue as PendingAction)
        void clearPendingAction()
      }
    })

    return () => {
      alive = false
      unsubscribe()
    }
    // Intentionally runs once on mount — hydrate + storage subscriptions are one-time setup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleModelChange(modelId: ModelId) {
    setDefaultModel(modelId)
    if (activeSession) setSessionModel(activeSession.id, modelId)
  }

  function handleNewChat() {
    createSession(defaultModel)
    setView('chat')
  }

  function handleThemeToggle() {
    const next = THEME_ORDER[(THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length]
    setTheme(next)
  }

  if (!ready) return <SplashScreen />

  return (
    <div className="flex h-screen w-full flex-col bg-bg-light text-text-light dark:bg-bg-dark dark:text-text-dark">
      <header className="flex items-center gap-1.5 border-b border-border-light bg-surface-light/90 px-2 py-2 sm:gap-2 sm:px-3 dark:border-border-dark dark:bg-surface-dark/90">
        <Logo size={26} className="shrink-0" />
        <span className="hidden shrink-0 font-display text-sm font-semibold tracking-tight sm:inline">
          EchoGPT
        </span>
        <ModelPicker value={activeSession?.modelId ?? defaultModel} onChange={handleModelChange} />

        <div className="ml-auto flex shrink-0 items-center gap-0.5">
          <IconButton label="New chat" icon={<SquarePen size={17} />} onClick={handleNewChat} />
          <IconButton
            label="History"
            icon={<HistoryIcon size={17} />}
            onClick={() => setView((v) => (v === 'history' ? 'chat' : 'history'))}
            active={view === 'history'}
          />
          <IconButton label={`Theme: ${theme} (click to change)`} icon={THEME_ICON[theme]} onClick={handleThemeToggle} />
          <IconButton
            label="Settings"
            icon={<SettingsIcon size={17} />}
            onClick={() => setView((v) => (v === 'settings' ? 'chat' : 'settings'))}
            active={view === 'settings'}
          />
        </div>
      </header>

      <main className="min-h-0 flex-1">
        {view === 'chat' && (
          <ChatView incomingAction={incomingAction} onIncomingActionHandled={() => setIncomingAction(null)} />
        )}
        {view === 'history' && (
          <HistoryView
            onOpenSession={(sessionId) => {
              setActiveSessionId(sessionId)
              setView('chat')
            }}
          />
        )}
        {view === 'settings' && <SettingsView />}
      </main>
    </div>
  )
}
