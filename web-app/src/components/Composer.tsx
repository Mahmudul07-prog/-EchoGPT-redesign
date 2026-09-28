import { useEffect, useRef, type KeyboardEvent } from "react";
import { Columns2, Mic, MicOff, Paperclip, Send, Square } from "lucide-react";
import { ModelSelector } from "./ModelSelector";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useUiStore } from "../store/uiStore";
import { cn } from "../lib/utils";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  modelId: string;
  onModelChange: (modelId: string) => void;
  isStreaming?: boolean;
  onStop?: () => void;
  compareMode?: boolean;
  onToggleCompareMode?: () => void;
  placeholder?: string;
}

export function Composer({
  value,
  onChange,
  onSend,
  modelId,
  onModelChange,
  isStreaming,
  onStop,
  compareMode,
  onToggleCompareMode,
  placeholder = "Ask a question…",
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addToast = useUiStore((s) => s.addToast);
  const { supported: micSupported, listening, start, stop } = useSpeechRecognition({
    onResult: (transcript) => onChange(value ? `${value} ${transcript}` : transcript),
  });

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  function handleSubmit() {
    if (!value.trim() || isStreaming) return;
    onSend();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleAttach() {
    addToast("Attachments aren't wired to a backend in this demo.", "default");
  }

  function handleMicClick() {
    if (!micSupported) return;
    if (listening) stop();
    else start();
  }

  return (
    <div className="rounded-card border border-border-light bg-surface-light p-3 shadow-[0_2px_24px_-6px_rgba(124,58,237,0.18)] dark:border-border-dark dark:bg-surface-dark">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
        <ModelSelector value={modelId} onChange={onModelChange} disabled={isStreaming} />
        {onToggleCompareMode && (
          <button
            type="button"
            onClick={onToggleCompareMode}
            aria-pressed={compareMode}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
              compareMode
                ? "border-transparent bg-gradient-to-r from-brand-600 to-accent-600 text-white"
                : "border-border-light text-text-muted-light hover:bg-brand-50 dark:border-border-dark dark:text-text-muted-dark dark:hover:bg-white/5",
            )}
          >
            <Columns2 size={14} strokeWidth={2} />
            Compare mode
          </button>
        )}
      </div>

      <div className="flex items-end gap-2">
        <label htmlFor="composer-input" className="sr-only">
          Message
        </label>
        <textarea
          id="composer-input"
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="max-h-[200px] min-h-[2.5rem] flex-1 resize-none bg-transparent px-1 py-2 text-sm text-text-light outline-none placeholder:text-text-muted-light dark:text-text-dark dark:placeholder:text-text-muted-dark"
        />

        <div className="flex shrink-0 items-center gap-1 pb-0.5">
          <button
            type="button"
            onClick={handleMicClick}
            disabled={!micSupported}
            aria-label={micSupported ? (listening ? "Stop voice input" : "Start voice input") : "Voice input isn't supported in this browser"}
            title={micSupported ? (listening ? "Stop voice input" : "Voice input") : "Voice input isn't supported in this browser"}
            className={cn(
              "rounded-full p-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
              !micSupported && "cursor-not-allowed opacity-40",
              listening ? "bg-danger-500/10 text-danger-500" : "text-text-muted-light hover:bg-brand-50 hover:text-text-light dark:text-text-muted-dark dark:hover:bg-white/5 dark:hover:text-text-dark",
            )}
          >
            {micSupported ? <Mic size={18} strokeWidth={1.75} /> : <MicOff size={18} strokeWidth={1.75} />}
          </button>
          <button
            type="button"
            onClick={handleAttach}
            aria-label="Attach a file"
            title="Attach a file"
            className="rounded-full p-2 text-text-muted-light transition hover:bg-brand-50 hover:text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-text-muted-dark dark:hover:bg-white/5 dark:hover:text-text-dark"
          >
            <Paperclip size={18} strokeWidth={1.75} />
          </button>
          {isStreaming && onStop ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop generating"
              title="Stop generating"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-text-light text-bg-light transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:bg-text-dark dark:text-bg-dark"
            >
              <Square size={14} strokeWidth={2} fill="currentColor" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!value.trim()}
              aria-label="Send message"
              title="Send"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-accent-600 text-white transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
