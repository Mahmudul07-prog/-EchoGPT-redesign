import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useUiStore } from "../store/uiStore";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const addToast = useUiStore((s) => s.addToast);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      addToast("Code copied to clipboard.", "success");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      addToast("Couldn't access the clipboard in this browser.", "danger");
    }
  }

  return (
    <div className="my-2.5 overflow-hidden rounded-xl border border-border-light bg-bg-light dark:border-border-dark dark:bg-black/30">
      <div className="flex items-center justify-between border-b border-border-light bg-brand-50/60 px-3 py-1.5 dark:border-border-dark dark:bg-white/5">
        <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark">{language || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-text-muted-light transition hover:bg-white hover:text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-text-muted-dark dark:hover:bg-white/10 dark:hover:text-text-dark"
        >
          {copied ? <Check size={13} strokeWidth={2} /> : <Copy size={13} strokeWidth={2} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 text-[13px] leading-relaxed">
        <code className="font-mono text-text-light dark:text-text-dark">{code}</code>
      </pre>
    </div>
  );
}
