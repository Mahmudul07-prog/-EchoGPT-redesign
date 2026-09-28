import { useState, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'

/**
 * A tiny, purpose-built renderer for the small markdown subset the mock AI layer produces:
 * fenced code blocks, **bold**, "- " bullet lists and "> " blockquotes. Not a general markdown
 * parser — just enough to make the canned replies read well, without pulling in a dependency.
 */

type Segment = { type: 'text'; content: string } | { type: 'code'; lang?: string; content: string }

function parseSegments(text: string): Segment[] {
  const segments: Segment[] = []
  const regex = /```(\w*)\n([\s\S]*?)```/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) segments.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    segments.push({ type: 'code', lang: match[1] || undefined, content: match[2] })
    lastIndex = regex.lastIndex
  }

  // Handle a fence that's still streaming in (opened but not yet closed) so a code block that's
  // mid-generation renders as code immediately instead of showing raw backticks.
  const tail = text.slice(lastIndex)
  const openFenceIndex = tail.indexOf('```')
  if (openFenceIndex !== -1) {
    if (openFenceIndex > 0) segments.push({ type: 'text', content: tail.slice(0, openFenceIndex) })
    const afterFence = tail.slice(openFenceIndex + 3)
    const newlineIndex = afterFence.indexOf('\n')
    const lang = newlineIndex === -1 ? afterFence : afterFence.slice(0, newlineIndex)
    const code = newlineIndex === -1 ? '' : afterFence.slice(newlineIndex + 1)
    segments.push({ type: 'code', lang: lang || undefined, content: code })
  } else if (tail) {
    segments.push({ type: 'text', content: tail })
  }

  return segments
}

function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((part) => part.length > 0)
  return parts.map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  )
}

function TextBlock({ content }: { content: string }) {
  const lines = content.split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') {
      i++
      continue
    }

    if (line.trimStart().startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].trimStart().startsWith('- ')) {
        items.push(lines[i].trimStart().slice(2))
        i++
      }
      blocks.push(
        <ul key={key++} className="my-1.5 list-disc space-y-1 pl-5">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>,
      )
      continue
    }

    if (line.trimStart().startsWith('> ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].trimStart().startsWith('> ')) {
        items.push(lines[i].trimStart().slice(2))
        i++
      }
      blocks.push(
        <blockquote
          key={key++}
          className="my-1.5 border-l-2 border-brand-300 pl-3 italic text-text-muted-light dark:border-brand-700 dark:text-text-muted-dark"
        >
          {renderInline(items.join(' '))}
        </blockquote>,
      )
      continue
    }

    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trimStart().startsWith('- ') &&
      !lines[i].trimStart().startsWith('> ')
    ) {
      paraLines.push(lines[i])
      i++
    }
    blocks.push(
      <p key={key++} className="my-1 leading-relaxed first:mt-0 last:mb-0">
        {renderInline(paraLines.join(' '))}
      </p>,
    )
  }

  return <>{blocks}</>
}

function CodeBlock({ lang, content }: { lang?: string; content: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API unavailable (e.g. insufficient permissions) — fail silently.
    }
  }

  return (
    <div className="my-2 overflow-hidden rounded-xl border border-border-light bg-bg-light dark:border-border-dark dark:bg-black/30">
      <div className="flex items-center justify-between border-b border-border-light px-3 py-1.5 dark:border-border-dark">
        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">{lang || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-text-muted-light transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-text-muted-dark dark:hover:text-brand-300"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed">
        <code>{content}</code>
      </pre>
    </div>
  )
}

export default function MarkdownLite({ text }: { text: string }) {
  const segments = parseSegments(text)
  return (
    <>
      {segments.map((segment, index) =>
        segment.type === 'code' ? (
          <CodeBlock key={index} lang={segment.lang} content={segment.content} />
        ) : (
          <TextBlock key={index} content={segment.content} />
        ),
      )}
    </>
  )
}
