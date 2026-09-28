import type { ReactNode } from "react";
import { CodeBlock } from "../components/CodeBlock";

/**
 * A tiny, safe markdown-lite renderer. It supports exactly the subset the
 * mock AI layer needs: **bold**, `inline code`, fenced ```code blocks```,
 * "- " / "* " bullet lists, "1. " numbered lists, and paragraphs. It returns
 * plain React nodes — never `dangerouslySetInnerHTML` — so there is no HTML
 * injection surface even though the "AI" text is generated locally.
 */
export function renderMarkdownLite(source: string): ReactNode {
  const blocks = splitIntoBlocks(source);
  return (
    <>
      {blocks.map((block, index) => (
        <MarkdownBlock key={index} block={block} />
      ))}
    </>
  );
}

type Block =
  | { type: "code"; code: string; language?: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "p"; text: string };

const FENCE_RE = /```([\w-]*)\n?([\s\S]*?)```/g;

function splitIntoBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  FENCE_RE.lastIndex = 0;
  while ((match = FENCE_RE.exec(source))) {
    if (match.index > lastIndex) {
      blocks.push(...splitProseIntoBlocks(source.slice(lastIndex, match.index)));
    }
    blocks.push({ type: "code", language: match[1] || undefined, code: match[2].replace(/\n$/, "") });
    lastIndex = FENCE_RE.lastIndex;
  }
  if (lastIndex < source.length) {
    blocks.push(...splitProseIntoBlocks(source.slice(lastIndex)));
  }
  return blocks;
}

function splitProseIntoBlocks(prose: string): Block[] {
  const chunks = prose.split(/\n{2,}/);
  const blocks: Block[] = [];
  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    const lines = trimmed.split("\n").map((l) => l.trim());
    if (lines.every((l) => /^[-*]\s+/.test(l))) {
      blocks.push({ type: "ul", items: lines.map((l) => l.replace(/^[-*]\s+/, "")) });
    } else if (lines.every((l) => /^\d+[.)]\s+/.test(l))) {
      blocks.push({ type: "ol", items: lines.map((l) => l.replace(/^\d+[.)]\s+/, "")) });
    } else {
      blocks.push({ type: "p", text: trimmed });
    }
  }
  return blocks;
}

function MarkdownBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "code":
      return <CodeBlock code={block.code} language={block.language} />;
    case "ul":
      return (
        <ul className="my-2 list-disc space-y-1 pl-5 marker:text-brand-500">
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-brand-500">
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    case "p":
      return <p className="my-2 leading-relaxed first:mt-0 last:mb-0">{renderInline(block.text)}</p>;
    default:
      return null;
  }
}

const INLINE_RE = /(\*\*(.+?)\*\*)|(`([^`]+?)`)/g;

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  INLINE_RE.lastIndex = 0;
  while ((match = INLINE_RE.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      nodes.push(
        <strong key={key++} className="font-semibold text-text-light dark:text-text-dark">
          {match[2]}
        </strong>,
      );
    } else if (match[3] !== undefined) {
      nodes.push(
        <code
          key={key++}
          className="rounded-md bg-brand-50 px-1.5 py-0.5 font-mono text-[0.85em] text-brand-700 dark:bg-white/10 dark:text-brand-300"
        >
          {match[4]}
        </code>,
      );
    }
    lastIndex = INLINE_RE.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
