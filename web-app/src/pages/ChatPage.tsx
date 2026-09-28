import { useEffect, useMemo, useRef, useState } from "react";
import { Columns2, Sparkles, X } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { useSettingsStore } from "../store/settingsStore";
import { Composer } from "../components/Composer";
import { MessageBubble } from "../components/MessageBubble";
import { SuggestionCard } from "../components/SuggestionCard";
import { CompareWorkspace } from "../components/CompareWorkspace";
import { pickRandomSuggestions } from "../lib/suggestions";

export default function ChatPage() {
  const sessions = useChatStore((s) => s.sessions);
  const currentSessionId = useChatStore((s) => s.currentSessionId);
  const selectedModelId = useChatStore((s) => s.selectedModelId);
  const setSelectedModel = useChatStore((s) => s.setSelectedModel);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const regenerateMessage = useChatStore((s) => s.regenerateMessage);
  const toggleLike = useChatStore((s) => s.toggleLike);
  const stopStreaming = useChatStore((s) => s.stopStreaming);
  const hasSeenNotice = useSettingsStore((s) => s.hasSeenSimulatedAiNotice);
  const markNoticeSeen = useSettingsStore((s) => s.markSimulatedAiNoticeSeen);

  const [draft, setDraft] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const session = sessions.find((s) => s.id === currentSessionId) ?? null;
  const suggestions = useMemo(() => pickRandomSuggestions(4), [currentSessionId]);
  const isStreaming = session?.messages.some((m) => m.isStreaming) ?? false;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "auto" });
  }, [session?.messages]);

  function handleSend() {
    const text = draft;
    if (!text.trim() || isStreaming) return;
    setDraft("");
    void sendMessage(text, selectedModelId);
  }

  function handleStop() {
    const streamingMessage = session?.messages.find((m) => m.isStreaming);
    if (session && streamingMessage) stopStreaming(session.id, streamingMessage.id);
  }

  if (compareMode) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border-light px-4 py-3 sm:px-6 dark:border-border-dark">
          <p className="flex items-center gap-2 font-display text-sm font-semibold text-text-light dark:text-text-dark">
            <Columns2 size={16} strokeWidth={2} className="text-brand-600 dark:text-brand-400" />
            Compare mode
          </p>
          <button
            type="button"
            onClick={() => setCompareMode(false)}
            className="rounded-full border border-border-light px-3 py-1.5 text-xs font-medium text-text-muted-light transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:text-text-muted-dark dark:hover:bg-white/5"
          >
            Back to chat
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <CompareWorkspace />
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex h-full flex-col">
        <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto w-full max-w-3xl space-y-5">
            {session.messages.map((message, idx) => (
              <MessageBubble
                key={message.id}
                message={message}
                canRegenerate={message.role === "assistant" && idx > 0 && !message.isStreaming}
                onRegenerate={() => regenerateMessage(session.id, message.id)}
                onToggleLike={(value) => toggleLike(session.id, message.id, value)}
              />
            ))}
          </div>
        </div>
        <div className="border-t border-border-light p-4 sm:p-6 dark:border-border-dark">
          <div className="mx-auto w-full max-w-3xl">
            <Composer
              value={draft}
              onChange={setDraft}
              onSend={handleSend}
              modelId={selectedModelId}
              onModelChange={setSelectedModel}
              isStreaming={isStreaming}
              onStop={handleStop}
              compareMode={compareMode}
              onToggleCompareMode={() => setCompareMode(true)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8">
        {!hasSeenNotice && (
          <div className="flex w-full items-start gap-2.5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800 dark:border-brand-700/40 dark:bg-brand-500/10 dark:text-brand-200">
            <Sparkles size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
            <p className="flex-1">
              Heads up — every reply in this demo is generated locally in your browser by a simulated model. Nothing
              you type leaves your device, and no real AI backend is used.
            </p>
            <button
              type="button"
              onClick={markNoticeSeen}
              aria-label="Dismiss notice"
              className="rounded-full p-1 text-brand-700 hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-brand-300 dark:hover:bg-white/10"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        )}

        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text-light sm:text-4xl dark:text-text-dark">
            Hello there! 👋
          </h1>
          <p className="mt-2 text-sm text-text-muted-light sm:text-base dark:text-text-muted-dark">
            Your personal AI assistant is ready to help — ask me anything, anytime.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {suggestions.map((s, i) => (
            <SuggestionCard key={s.title} suggestion={s} index={i} onSelect={setDraft} />
          ))}
        </div>

        <div className="w-full">
          <Composer
            value={draft}
            onChange={setDraft}
            onSend={handleSend}
            modelId={selectedModelId}
            onModelChange={setSelectedModel}
            isStreaming={isStreaming}
            onStop={handleStop}
            compareMode={compareMode}
            onToggleCompareMode={() => setCompareMode(true)}
          />
        </div>
      </div>
    </div>
  );
}
