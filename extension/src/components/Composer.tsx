import { forwardRef, useEffect, useImperativeHandle, useRef, type KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import clsx from 'clsx'

interface ComposerProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
  placeholder?: string
}

/** Message composer: auto-growing textarea, Enter to send / Shift+Enter for a newline. Mic and
 * attachment affordances are intentionally left out — DESIGN_SPEC calls for keeping this panel
 * focused, and half-working demo buttons would be worse than not having them. */
const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(function Composer(
  { value, onChange, onSend, disabled, placeholder },
  forwardedRef,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useImperativeHandle(forwardedRef, () => textareaRef.current as HTMLTextAreaElement)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!disabled && value.trim()) onSend()
    }
  }

  return (
    <div className="flex items-end gap-2 rounded-card border border-border-light bg-surface-light p-2 shadow-[0_2px_20px_-4px_rgba(124,58,237,0.12)] focus-within:border-brand-400 dark:border-border-dark dark:bg-surface-dark">
      <label htmlFor="echogpt-composer" className="sr-only">
        Message EchoGPT
      </label>
      <textarea
        ref={textareaRef}
        id="echogpt-composer"
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? 'Ask anything…'}
        className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-text-light placeholder:text-text-muted-light focus:outline-none dark:text-text-dark dark:placeholder:text-text-muted-dark"
      />
      <button
        type="button"
        onClick={onSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className={clsx(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-accent-600 text-white transition',
          'hover:brightness-110 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        )}
      >
        <Send size={16} />
      </button>
    </div>
  )
})

export default Composer
