import type { ModelId } from '../lib/mockAi'

export type ThemePreference = 'light' | 'dark' | 'system'

export interface Settings {
  theme: ThemePreference
  defaultModel: ModelId
  includePageContext: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
  modelId?: ModelId
  /** True while this message is still being streamed in. */
  streaming?: boolean
  /** Title of the page whose context was folded into this reply, if any. */
  pageContextTitle?: string
}

export interface ChatSession {
  id: string
  title: string
  modelId: ModelId
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

/** Written by the background script (context menu) or the popup (quick actions); the side
 * panel reads it once on mount/onChanged, acts on it, then clears it. */
export type PendingAction = { type: 'explain'; text: string } | { type: 'summarize-page'; url: string }

/** Written by the popup to tell an about-to-open (or already-open) side panel where to go. */
export type PendingNav = 'settings' | 'history' | { view: 'session'; sessionId: string }

export interface PageContext {
  title: string
  url: string
  text: string
}
