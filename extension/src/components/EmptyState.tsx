import { FileText, MessageCircle, ScanText } from 'lucide-react'
import Logo from './Logo'
import QuickActionChip from './QuickActionChip'

interface EmptyStateProps {
  onSummarizePage: () => void
  onExplainPage: () => void
  onFocusComposer: () => void
}

export default function EmptyState({ onSummarizePage, onExplainPage, onFocusComposer }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-10 text-center">
      <Logo size={44} />
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-text-light dark:text-text-dark">
          Hey there 👋
        </h2>
        <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
          Ask anything, summarize the page you're on, or explain something you've selected.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
        <QuickActionChip
          icon={<FileText size={16} />}
          label="Summarize this page"
          onClick={onSummarizePage}
        />
        <QuickActionChip
          icon={<ScanText size={16} />}
          label="Explain this page"
          onClick={onExplainPage}
        />
        <QuickActionChip
          icon={<MessageCircle size={16} />}
          label="Ask anything"
          onClick={onFocusComposer}
        />
      </div>

      <p className="mt-2 max-w-xs text-[11px] leading-relaxed text-text-muted-light dark:text-text-muted-dark">
        Responses are simulated locally for this demo — nothing you type leaves your browser.
      </p>
    </div>
  )
}
