import { useMemo, useState } from 'react'
import { History, Search } from 'lucide-react'
import ConfirmDialog from '../../components/ConfirmDialog'
import SessionListItem from '../../components/SessionListItem'
import { useSessionStore } from '../../store/sessionStore'

interface HistoryViewProps {
  onOpenSession: (sessionId: string) => void
}

export default function HistoryView({ onOpenSession }: HistoryViewProps) {
  const sessions = useSessionStore((s) => s.sessions)
  const deleteSession = useSessionStore((s) => s.deleteSession)
  const [query, setQuery] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const sorted = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt)
    const q = query.trim().toLowerCase()
    if (!q) return sorted
    return sorted.filter(
      (session) =>
        session.title.toLowerCase().includes(q) ||
        session.messages.some((m) => m.content.toLowerCase().includes(q)),
    )
  }, [sessions, query])

  const pendingDeleteTitle = sessions.find((s) => s.id === pendingDeleteId)?.title

  return (
    <div className="flex h-full min-h-0 flex-col px-3 py-4 sm:px-4">
      <h2 className="mb-3 font-display text-base font-semibold tracking-tight text-text-light dark:text-text-dark">
        History
      </h2>

      <div className="mb-3 flex items-center gap-2 rounded-pill border border-border-light bg-surface-light px-3 py-1.5 focus-within:border-brand-400 dark:border-border-dark dark:bg-surface-dark">
        <Search size={14} className="text-text-muted-light dark:text-text-muted-dark" />
        <label htmlFor="echogpt-history-search" className="sr-only">
          Search conversations
        </label>
        <input
          id="echogpt-history-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search conversations…"
          className="flex-1 bg-transparent text-sm text-text-light placeholder:text-text-muted-light focus:outline-none dark:text-text-dark dark:placeholder:text-text-muted-dark"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-2 text-center text-text-muted-light dark:text-text-muted-dark">
          <History size={28} className="opacity-60" />
          <p className="text-sm">{sessions.length === 0 ? 'No conversations yet.' : 'No matches for that search.'}</p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto">
          {filtered.map((session) => (
            <SessionListItem
              key={session.id}
              session={session}
              onOpen={() => onOpenSession(session.id)}
              onDelete={() => setPendingDeleteId(session.id)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete this conversation?"
        description={pendingDeleteTitle ? `"${pendingDeleteTitle}" will be permanently removed.` : undefined}
        confirmLabel="Delete"
        danger
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteSession(pendingDeleteId)
          setPendingDeleteId(null)
        }}
      />
    </div>
  )
}
