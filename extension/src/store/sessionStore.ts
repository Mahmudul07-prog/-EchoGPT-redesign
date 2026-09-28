import { create } from 'zustand'
import { createId } from '../lib/id'
import {
  getActiveSessionId,
  getSessions,
  setActiveSessionId as persistActiveSessionId,
  setSessions as persistSessions,
} from '../lib/storage'
import type { ModelId } from '../lib/mockAi'
import type { ChatMessage, ChatSession } from '../types'

function deriveTitle(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return 'New chat'
  if (clean.length <= 48) return clean
  const cut = clean.slice(0, 48)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 20 ? lastSpace : 48)}…`
}

function createSessionRecord(modelId: ModelId): ChatSession {
  const now = Date.now()
  return {
    id: createId('session'),
    title: 'New chat',
    modelId,
    messages: [],
    createdAt: now,
    updatedAt: now,
  }
}

interface SessionState {
  sessions: ChatSession[]
  activeSessionId?: string
  hydrated: boolean

  hydrate: () => Promise<void>
  getActiveSession: () => ChatSession | undefined
  ensureActiveSession: (modelId: ModelId) => ChatSession
  createSession: (modelId: ModelId) => ChatSession
  setActiveSessionId: (id: string) => void
  setSessionModel: (sessionId: string, modelId: ModelId) => void
  appendMessage: (sessionId: string, message: ChatMessage) => void
  patchMessageLocal: (sessionId: string, messageId: string, patch: Partial<ChatMessage>) => void
  finalizeMessage: (sessionId: string, messageId: string, patch: Partial<ChatMessage>) => void
  deleteSession: (id: string) => void
  clearAll: () => void
}

function persist(sessions: ChatSession[]): void {
  void persistSessions(sessions)
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  activeSessionId: undefined,
  hydrated: false,

  hydrate: async () => {
    const [sessions, activeSessionId] = await Promise.all([getSessions(), getActiveSessionId()])
    set({
      sessions,
      activeSessionId: activeSessionId && sessions.some((s) => s.id === activeSessionId) ? activeSessionId : undefined,
      hydrated: true,
    })
  },

  getActiveSession: () => {
    const { sessions, activeSessionId } = get()
    return sessions.find((s) => s.id === activeSessionId)
  },

  ensureActiveSession: (modelId) => {
    const existing = get().getActiveSession()
    if (existing) return existing
    return get().createSession(modelId)
  },

  createSession: (modelId) => {
    const session = createSessionRecord(modelId)
    const sessions = [session, ...get().sessions]
    set({ sessions, activeSessionId: session.id })
    persist(sessions)
    void persistActiveSessionId(session.id)
    return session
  },

  setActiveSessionId: (id) => {
    set({ activeSessionId: id })
    void persistActiveSessionId(id)
  },

  setSessionModel: (sessionId, modelId) => {
    const sessions = get().sessions.map((session) =>
      session.id === sessionId ? { ...session, modelId } : session,
    )
    set({ sessions })
    persist(sessions)
  },

  appendMessage: (sessionId, message) => {
    const sessions = get().sessions.map((session) => {
      if (session.id !== sessionId) return session
      const isFirstUserMessage = message.role === 'user' && session.title === 'New chat'
      return {
        ...session,
        title: isFirstUserMessage ? deriveTitle(message.content) : session.title,
        messages: [...session.messages, message],
        updatedAt: message.createdAt,
      }
    })
    set({ sessions })
    persist(sessions)
  },

  /** In-memory only update, used while a reply is streaming in — avoids hammering storage on
   * every chunk. Call finalizeMessage once streaming completes to persist. */
  patchMessageLocal: (sessionId, messageId, patch) => {
    const sessions = get().sessions.map((session) => {
      if (session.id !== sessionId) return session
      return {
        ...session,
        messages: session.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
      }
    })
    set({ sessions })
  },

  finalizeMessage: (sessionId, messageId, patch) => {
    const sessions = get().sessions.map((session) => {
      if (session.id !== sessionId) return session
      return {
        ...session,
        messages: session.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
        updatedAt: Date.now(),
      }
    })
    set({ sessions })
    persist(sessions)
  },

  deleteSession: (id) => {
    const sessions = get().sessions.filter((s) => s.id !== id)
    const wasActive = get().activeSessionId === id
    set({ sessions, activeSessionId: wasActive ? undefined : get().activeSessionId })
    persist(sessions)
    if (wasActive) void persistActiveSessionId(undefined)
  },

  clearAll: () => {
    set({ sessions: [], activeSessionId: undefined })
    persist([])
    void persistActiveSessionId(undefined)
  },
}))
