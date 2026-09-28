import { Trash2 } from 'lucide-react'
import IconButton from './IconButton'
import { getModel } from '../lib/mockAi'
import { timeAgo } from '../lib/time'
import type { ChatSession } from '../types'

interface SessionListItemProps {
  session: ChatSession
  onOpen: () => void
  onDelete?: () => void
}

export default function SessionListItem({ session, onOpen, onDelete }: SessionListItemProps) {
  const lastMessage = session.messages[session.messages.length - 1]
  const model = getModel(session.modelId)

  return (
    <div className="group flex items-center gap-2 rounded-card border border-transparent px-2 py-2 transition-colors hover:border-border-light hover:bg-brand-50/60 dark:hover:border-border-dark dark:hover:bg-white/5">
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-text-light dark:text-text-dark">{session.title}</span>
          <span className="shrink-0 text-[11px] text-text-muted-light dark:text-text-muted-dark">
            {timeAgo(session.updatedAt)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-text-muted-light dark:text-text-muted-dark">
          {lastMessage ? lastMessage.content.replace(/\s+/g, ' ') || '…' : 'No messages yet'}
          <span className="ml-1.5 text-text-muted-light/70 dark:text-text-muted-dark/70">· {model.shortName}</span>
        </p>
      </button>
      {onDelete && (
        <IconButton
          label={`Delete "${session.title}"`}
          icon={<Trash2 size={14} />}
          size="sm"
          className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 hover:!text-danger-500"
          onClick={(event) => {
            event.stopPropagation()
            onDelete()
          }}
        />
      )}
    </div>
  )
}
