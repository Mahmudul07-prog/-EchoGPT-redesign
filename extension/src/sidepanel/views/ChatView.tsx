import { useEffect, useRef, useState } from 'react'
import Composer from '../../components/Composer'
import EmptyState from '../../components/EmptyState'
import MessageBubble from '../../components/MessageBubble'
import { createId } from '../../lib/id'
import { generateMockReply, type MockCategory, type ModelId } from '../../lib/mockAi'
import { fetchPageContext } from '../../lib/pageContext'
import { useSessionStore } from '../../store/sessionStore'
import { useSettingsStore } from '../../store/settingsStore'
import type { ChatMessage, PageContext, PendingAction } from '../../types'

interface RunOptions {
  categoryHint?: MockCategory
  selectionText?: string
  forcePageContext?: boolean
  fallbackUrl?: string
}

interface ChatViewProps {
  incomingAction: PendingAction | null
  onIncomingActionHandled: () => void
}

function snippetForDisplay(text: string, maxLen = 90): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLen) return clean
  return `${clean.slice(0, maxLen).trimEnd()}…`
}

export default function ChatView({ incomingAction, onIncomingActionHandled }: ChatViewProps) {
  const sessions = useSessionStore((s) => s.sessions)
  const activeSessionId = useSessionStore((s) => s.activeSessionId)
  const activeSession = sessions.find((s) => s.id === activeSessionId)
  const ensureActiveSession = useSessionStore((s) => s.ensureActiveSession)
  const appendMessage = useSessionStore((s) => s.appendMessage)
  const patchMessageLocal = useSessionStore((s) => s.patchMessageLocal)
  const finalizeMessage = useSessionStore((s) => s.finalizeMessage)

  const defaultModel = useSettingsStore((s) => s.defaultModel)
  const includePageContext = useSettingsStore((s) => s.includePageContext)

  const [composerValue, setComposerValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const streamGeneration = useRef(0)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [activeSession?.messages])

  async function runReply(sessionId: string, modelId: ModelId, prompt: string, opts: RunOptions = {}) {
    const generation = ++streamGeneration.current
    setIsStreaming(true)
    let pageCtx: PageContext | undefined
    if (opts.forcePageContext || includePageContext) {
      pageCtx = await fetchPageContext()
      if (!pageCtx && opts.fallbackUrl) {
        try {
          pageCtx = { title: new URL(opts.fallbackUrl).hostname, url: opts.fallbackUrl, text: '' }
        } catch {
          // Not a valid absolute URL — skip the fallback silently.
        }
      }
    }

    const assistantId = createId('msg')
    appendMessage(sessionId, {
      id: assistantId,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
      modelId,
      streaming: true,
      pageContextTitle: pageCtx?.title,
    })

    let full = ''
    try {
      for await (const chunk of generateMockReply(prompt, modelId, {
        categoryHint: opts.categoryHint,
        pageTitle: pageCtx?.title,
        pageExcerpt: pageCtx?.text,
        selectionText: opts.selectionText,
      })) {
        if (streamGeneration.current !== generation) return // a newer reply superseded this one
        full += chunk
        patchMessageLocal(sessionId, assistantId, { content: full })
      }
    } finally {
      if (streamGeneration.current === generation) {
        finalizeMessage(sessionId, assistantId, { content: full, streaming: false })
        setIsStreaming(false)
      }
    }
  }

  function sendUserTurn(displayText: string, promptForModel: string, opts: RunOptions = {}) {
    if (isStreaming || !displayText.trim()) return
    const session = ensureActiveSession(defaultModel)
    const userMessage: ChatMessage = {
      id: createId('msg'),
      role: 'user',
      content: displayText,
      createdAt: Date.now(),
    }
    appendMessage(session.id, userMessage)
    void runReply(session.id, session.modelId, promptForModel, opts)
  }

  function handleComposerSend() {
    const text = composerValue.trim()
    if (!text) return
    setComposerValue('')
    sendUserTurn(text, text)
  }

  function handleSummarizePage() {
    sendUserTurn('Summarize this page', 'Summarize this page', {
      categoryHint: 'summary',
      forcePageContext: true,
    })
  }

  function handleExplainPage() {
    sendUserTurn('Explain this page', 'Explain this page', {
      categoryHint: 'explain',
      forcePageContext: true,
    })
  }

  function handleFocusComposer() {
    composerRef.current?.focus()
  }

  // Process a pending action written by the background script (context menu) or the popup
  // (quick actions) once it lands in local state — see sidepanel/App.tsx.
  useEffect(() => {
    if (!incomingAction) return
    if (incomingAction.type === 'explain') {
      const text = incomingAction.text.trim()
      const displayText = text ? `Explain: "${snippetForDisplay(text)}"` : 'Explain this page'
      sendUserTurn(displayText, text || 'Explain this page', {
        categoryHint: 'explain',
        selectionText: text || undefined,
        forcePageContext: !text,
      })
    } else {
      sendUserTurn('Summarize this page', 'Summarize this page', {
        categoryHint: 'summary',
        forcePageContext: true,
        fallbackUrl: incomingAction.url,
      })
    }
    onIncomingActionHandled()
    // Intentionally only re-runs when a new pending action arrives; sendUserTurn/etc. are
    // recreated every render and already close over the latest settings/session state.
  }, [incomingAction])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
        {!activeSession || activeSession.messages.length === 0 ? (
          <EmptyState
            onSummarizePage={handleSummarizePage}
            onExplainPage={handleExplainPage}
            onFocusComposer={handleFocusComposer}
          />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            {activeSession.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="mx-auto w-full max-w-3xl shrink-0 px-3 pb-3 sm:px-4">
        <Composer
          ref={composerRef}
          value={composerValue}
          onChange={setComposerValue}
          onSend={handleComposerSend}
          disabled={isStreaming}
          placeholder={isStreaming ? 'EchoGPT is replying…' : 'Ask anything…'}
        />
      </div>
    </div>
  )
}
