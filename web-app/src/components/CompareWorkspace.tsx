import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { MODELS, getModel } from "../lib/models";
import { generateMockReply } from "../lib/mockAi";
import { createId, cn } from "../lib/utils";
import { MessageBubble } from "./MessageBubble";
import type { ChatMessage } from "../types";

interface CompareColumn {
  modelId: string;
  message: ChatMessage;
}

interface CompareRun {
  id: string;
  prompt: string;
  columns: CompareColumn[];
}

const MAX_MODELS = 3;
const MIN_MODELS = 2;

export function CompareWorkspace() {
  const [selectedModels, setSelectedModels] = useState<string[]>([MODELS[0].id, MODELS[1].id]);
  const [prompt, setPrompt] = useState("");
  const [runs, setRuns] = useState<CompareRun[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  function toggleModel(id: string) {
    setSelectedModels((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= MIN_MODELS) return prev;
        return prev.filter((m) => m !== id);
      }
      if (prev.length >= MAX_MODELS) return prev;
      return [...prev, id];
    });
  }

  async function handleSend() {
    const trimmed = prompt.trim();
    if (!trimmed || isRunning || selectedModels.length < MIN_MODELS) return;
    setIsRunning(true);
    setPrompt("");

    const runId = createId("run");
    const columns: CompareColumn[] = selectedModels.map((modelId) => ({
      modelId,
      message: { id: createId("msg"), role: "assistant", content: "", modelId, createdAt: Date.now(), isStreaming: true },
    }));
    setRuns((prev) => [...prev, { id: runId, prompt: trimmed, columns }]);

    await Promise.all(
      selectedModels.map(async (modelId) => {
        const model = getModel(modelId);
        for await (const chunk of generateMockReply(trimmed, modelId, model)) {
          setRuns((prev) =>
            prev.map((run) =>
              run.id === runId
                ? {
                    ...run,
                    columns: run.columns.map((col) =>
                      col.modelId === modelId ? { ...col, message: { ...col.message, content: col.message.content + chunk } } : col,
                    ),
                  }
                : run,
            ),
          );
        }
        setRuns((prev) =>
          prev.map((run) =>
            run.id === runId
              ? {
                  ...run,
                  columns: run.columns.map((col) =>
                    col.modelId === modelId ? { ...col, message: { ...col.message, isStreaming: false } } : col,
                  ),
                }
              : run,
          ),
        );
      }),
    );

    setIsRunning(false);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border-light px-4 py-4 sm:px-6 dark:border-border-dark">
        <p className="mb-2 text-sm font-medium text-text-light dark:text-text-dark">
          Select 2–3 models to compare
        </p>
        <div className="flex flex-wrap gap-2">
          {MODELS.map((m) => {
            const active = selectedModels.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleModel(m.id)}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                  active
                    ? "border-transparent bg-gradient-to-r from-brand-600 to-accent-600 text-white"
                    : "border-border-light text-text-muted-light hover:bg-brand-50 dark:border-border-dark dark:text-text-muted-dark dark:hover:bg-white/5",
                )}
              >
                {m.name}
                {m.badge && <span className="rounded-full bg-gold-400/90 px-1.5 py-0.5 text-[9px] font-bold text-black">{m.badge}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6">
        {runs.length === 0 && (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center text-center">
            <p className="font-display text-base font-semibold text-text-light dark:text-text-dark">No comparisons yet</p>
            <p className="mt-1 max-w-sm text-sm text-text-muted-light dark:text-text-muted-dark">
              Pick your models above, type a prompt below, and see how each one replies side by side.
            </p>
          </div>
        )}
        {runs.map((run) => (
          <motion.div key={run.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <p className="mb-3 rounded-xl bg-brand-50 px-3.5 py-2 text-sm font-medium text-brand-800 dark:bg-white/5 dark:text-brand-200">
              {run.prompt}
            </p>
            <div className={cn("grid gap-3", run.columns.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3")}>
              {run.columns.map((col) => (
                <div key={col.modelId} className="min-w-0 rounded-card border border-border-light bg-surface-light p-3 dark:border-border-dark dark:bg-surface-dark">
                  <div className="mb-2 flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-text-light dark:text-text-dark">{getModel(col.modelId).name}</span>
                    {getModel(col.modelId).badge && (
                      <span className="rounded-full bg-gold-400/90 px-1.5 py-0.5 text-[9px] font-bold text-black">PRO</span>
                    )}
                  </div>
                  <MessageBubble message={col.message} compact />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-border-light p-4 sm:p-6 dark:border-border-dark">
        <div className="flex items-end gap-2 rounded-card border border-border-light bg-surface-light p-2 dark:border-border-dark dark:bg-surface-dark">
          <label htmlFor="compare-input" className="sr-only">
            Prompt to compare
          </label>
          <textarea
            id="compare-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask all selected models at once…"
            rows={1}
            className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-text-light outline-none placeholder:text-text-muted-light dark:text-text-dark dark:placeholder:text-text-muted-dark"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!prompt.trim() || isRunning || selectedModels.length < MIN_MODELS}
            aria-label="Send prompt to all selected models"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-accent-600 text-white transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
