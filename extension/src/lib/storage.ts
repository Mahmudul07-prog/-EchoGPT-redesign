/**
 * Thin wrapper around chrome.storage.local. When running outside a loaded extension
 * (e.g. `npm run dev` opening popup.html/sidepanel.html as plain pages) every call falls back
 * to a localStorage-backed mock so the UI stays fully previewable — see chrome-shim.ts.
 *
 * All persistence in this app (settings, chat sessions, pending actions/nav) goes through here
 * so both the popup and the side panel read and write the exact same storage.
 */
import { isExtensionEnv } from './chrome-shim'
import { DEFAULT_MODEL_ID } from './mockAi'
import type { ChatSession, PendingAction, PendingNav, Settings } from '../types'

export const STORAGE_KEYS = {
  settings: 'echogpt_settings',
  sessions: 'echogpt_sessions',
  activeSessionId: 'echogpt_active_session_id',
  pendingAction: 'echogpt_pending_action',
  pendingNav: 'echogpt_pending_nav',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  defaultModel: DEFAULT_MODEL_ID,
  includePageContext: true,
}

export interface StorageChange<T = unknown> {
  oldValue?: T
  newValue?: T
}

type ChangeListener = (changes: Record<string, StorageChange>) => void

const inPageListeners = new Set<ChangeListener>()

function readLocal<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? undefined : (JSON.parse(raw) as T)
  } catch {
    return undefined
  }
}

function writeLocal<T>(key: string, value: T): T | undefined {
  const oldValue = readLocal<T>(key)
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // best-effort in dev-preview mode; ignore quota/serialization errors
  }
  return oldValue
}

/** Generic read for a single key. */
export async function storageGet<T>(key: string): Promise<T | undefined> {
  if (isExtensionEnv) {
    const result = await chrome.storage.local.get<Record<string, T>>(key)
    return result[key]
  }
  return readLocal<T>(key)
}

/** Generic write for a single key. */
export async function storageSet<T>(key: string, value: T): Promise<void> {
  if (isExtensionEnv) {
    await chrome.storage.local.set({ [key]: value })
    return
  }
  const oldValue = writeLocal(key, value)
  const changes = { [key]: { oldValue, newValue: value } }
  inPageListeners.forEach((listener) => listener(changes))
}

/** Generic removal for a single key. */
export async function storageRemove(key: string): Promise<void> {
  if (isExtensionEnv) {
    await chrome.storage.local.remove(key)
    return
  }
  const oldValue = readLocal(key)
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
  const changes = { [key]: { oldValue, newValue: undefined } }
  inPageListeners.forEach((listener) => listener(changes))
}

/**
 * Subscribes to storage changes across both real chrome.storage.onChanged (extension env) and,
 * in dev-preview mode, both same-tab writes (via an in-page emitter, since the native `storage`
 * event never fires in the tab that made the change) and cross-tab writes (via the native
 * `storage` event, e.g. popup.html and sidepanel.html open as two separate preview tabs).
 * Returns an unsubscribe function.
 */
export function onStorageChanged(listener: ChangeListener): () => void {
  if (isExtensionEnv) {
    const wrapped = (changes: Record<string, chrome.storage.StorageChange>, areaName: string) => {
      if (areaName !== 'local') return
      listener(changes as Record<string, StorageChange>)
    }
    chrome.storage.onChanged.addListener(wrapped)
    return () => chrome.storage.onChanged.removeListener(wrapped)
  }

  inPageListeners.add(listener)
  const onWindowStorage = (event: StorageEvent) => {
    if (!event.key) return
    let newValue: unknown
    let oldValue: unknown
    try {
      newValue = event.newValue ? JSON.parse(event.newValue) : undefined
    } catch {
      newValue = undefined
    }
    try {
      oldValue = event.oldValue ? JSON.parse(event.oldValue) : undefined
    } catch {
      oldValue = undefined
    }
    listener({ [event.key]: { oldValue, newValue } })
  }
  window.addEventListener('storage', onWindowStorage)
  return () => {
    inPageListeners.delete(listener)
    window.removeEventListener('storage', onWindowStorage)
  }
}

// ---- Typed convenience helpers -------------------------------------------------------------

export async function getSettings(): Promise<Settings> {
  const stored = await storageGet<Partial<Settings>>(STORAGE_KEYS.settings)
  return { ...DEFAULT_SETTINGS, ...stored }
}

export function setSettings(settings: Settings): Promise<void> {
  return storageSet(STORAGE_KEYS.settings, settings)
}

export async function getSessions(): Promise<ChatSession[]> {
  const stored = await storageGet<ChatSession[]>(STORAGE_KEYS.sessions)
  return stored ?? []
}

export function setSessions(sessions: ChatSession[]): Promise<void> {
  return storageSet(STORAGE_KEYS.sessions, sessions)
}

export function getActiveSessionId(): Promise<string | undefined> {
  return storageGet<string>(STORAGE_KEYS.activeSessionId)
}

export function setActiveSessionId(id: string | undefined): Promise<void> {
  if (!id) return storageRemove(STORAGE_KEYS.activeSessionId)
  return storageSet(STORAGE_KEYS.activeSessionId, id)
}

export function getPendingAction(): Promise<PendingAction | undefined> {
  return storageGet<PendingAction>(STORAGE_KEYS.pendingAction)
}

export function setPendingAction(action: PendingAction): Promise<void> {
  return storageSet(STORAGE_KEYS.pendingAction, action)
}

export function clearPendingAction(): Promise<void> {
  return storageRemove(STORAGE_KEYS.pendingAction)
}

export function getPendingNav(): Promise<PendingNav | undefined> {
  return storageGet<PendingNav>(STORAGE_KEYS.pendingNav)
}

export function setPendingNav(nav: PendingNav): Promise<void> {
  return storageSet(STORAGE_KEYS.pendingNav, nav)
}

export function clearPendingNav(): Promise<void> {
  return storageRemove(STORAGE_KEYS.pendingNav)
}
