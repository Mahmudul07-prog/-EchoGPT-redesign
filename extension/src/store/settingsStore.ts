import { create } from 'zustand'
import { DEFAULT_SETTINGS, STORAGE_KEYS, getSettings, onStorageChanged, setSettings } from '../lib/storage'
import type { ModelId } from '../lib/mockAi'
import type { Settings, ThemePreference } from '../types'

/** Applies the resolved light/dark class to <html> and keeps it synced with the OS theme
 * while the preference is 'system'. */
let mediaCleanup: (() => void) | null = null

export function applyThemeClass(theme: ThemePreference): void {
  const root = document.documentElement
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
  const resolveDark = () => theme === 'dark' || (theme === 'system' && prefersDark.matches)
  root.classList.toggle('dark', resolveDark())

  mediaCleanup?.()
  mediaCleanup = null
  if (theme === 'system') {
    const handler = () => root.classList.toggle('dark', prefersDark.matches)
    prefersDark.addEventListener('change', handler)
    mediaCleanup = () => prefersDark.removeEventListener('change', handler)
  }
}

interface SettingsState extends Settings {
  hydrated: boolean
  hydrate: () => Promise<void>
  setTheme: (theme: ThemePreference) => void
  setDefaultModel: (modelId: ModelId) => void
  setIncludePageContext: (value: boolean) => void
}

function persist(state: Settings): void {
  void setSettings(state)
}

let unsubscribeSettingsWatch: (() => void) | null = null

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  hydrated: false,

  hydrate: async () => {
    const stored = await getSettings()
    set({ ...stored, hydrated: true })
    applyThemeClass(stored.theme)

    // Stay in sync if another context (popup, or the panel reopening) changes settings.
    unsubscribeSettingsWatch?.()
    unsubscribeSettingsWatch = onStorageChanged((changes) => {
      const change = changes[STORAGE_KEYS.settings]
      if (!change) return
      const next = change.newValue as Partial<Settings> | undefined
      if (!next) return
      set({ ...DEFAULT_SETTINGS, ...next })
      applyThemeClass(next.theme ?? DEFAULT_SETTINGS.theme)
    })
  },

  setTheme: (theme) => {
    set({ theme })
    applyThemeClass(theme)
    persist({ theme, defaultModel: get().defaultModel, includePageContext: get().includePageContext })
  },

  setDefaultModel: (defaultModel) => {
    set({ defaultModel })
    persist({ theme: get().theme, defaultModel, includePageContext: get().includePageContext })
  },

  setIncludePageContext: (includePageContext) => {
    set({ includePageContext })
    persist({ theme: get().theme, defaultModel: get().defaultModel, includePageContext })
  },
}))
