import { motion, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'
import { Globe } from 'lucide-react'
import Logo from './Logo'
import MarkdownLite from './MarkdownLite'
import { getModel } from '../lib/mockAi'
import { formatClockTime } from '../lib/time'
import type { ChatMessage } from '../types'

function StreamingCaret() {
  const reduceMotion = useReducedMotion()
  return (
    <motion.span
      aria-hidden="true"
      className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 bg-brand-500 align-middle"
      animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 0.15, 1] }}
      transition={reduceMotion ? undefined : { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

interface MessageBubbleProps {
  message: ChatMessage
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const reduceMotion = useReducedMotion()
  const isUser = message.role === 'user'
  const model = message.modelId ? getModel(message.modelId) : undefined

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={clsx('flex gap-2', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="mt-0.5 shrink-0">
          <Logo size={26} />
        </div>
      )}
      <div
        className={clsx(
          'max-w-[85%] rounded-card px-3.5 py-2.5 text-sm shadow-[0_2px_20px_-4px_rgba(124,58,237,0.12)]',
          isUser
            ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white'
            : 'border border-border-light bg-surface-light text-text-light dark:border-border-dark dark:bg-surface-dark dark:text-text-dark',
        )}
      >
        {!isUser && model && (
          <div className="mb-1 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-300">
            <span>{model.shortName}</span>
            {message.pageContextTitle && (
              <span
                className="inline-flex max-w-[160px] items-center gap-1 truncate rounded-pill bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-700 dark:bg-white/10 dark:text-brand-300"
                title={`Used page context: ${message.pageContextTitle}`}
              >
                <Globe size={10} className="shrink-0" />
                <span className="truncate">{message.pageContextTitle}</span>
              </span>
            )}
          </div>
        )}
        <div className={clsx(!isUser && 'break-words')}>
          <MarkdownLite text={message.content || (message.streaming ? '' : ' ')} />
          {message.streaming && <StreamingCaret />}
        </div>
        <div className={clsx('mt-1 text-[10px]', isUser ? 'text-white/70' : 'text-text-muted-light dark:text-text-muted-dark')}>
          {formatClockTime(message.createdAt)}
        </div>
      </div>
    </motion.div>
  )
}
