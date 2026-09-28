import { useState } from "react";
import { ClipboardList, Copy, Plus, Trash2, Wand2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { useUiStore } from "../store/uiStore";
import { createId } from "../lib/utils";

interface StepRow {
  id: string;
  text: string;
}

interface SopPreview {
  processName: string;
  purpose: string;
  steps: string[];
}

function buildPlainText(preview: SopPreview): string {
  const lines = [
    `Standard Operating Procedure: ${preview.processName}`,
    "",
    ...(preview.purpose ? [`Purpose: ${preview.purpose}`, ""] : []),
    "Steps:",
    ...preview.steps.map((step, i) => `${i + 1}. ${step}`),
    "",
    "Notes:",
    "- Review this SOP whenever the underlying process changes.",
    "- Assign an owner for each step where applicable.",
  ];
  return lines.join("\n");
}

export default function SopBuilderPage() {
  const addToast = useUiStore((s) => s.addToast);
  const [processName, setProcessName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [steps, setSteps] = useState<StepRow[]>([
    { id: createId("step"), text: "" },
    { id: createId("step"), text: "" },
  ]);
  const [preview, setPreview] = useState<SopPreview | null>(null);

  function updateStep(id: string, text: string) {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, text } : s)));
  }

  function addStep() {
    setSteps((prev) => [...prev, { id: createId("step"), text: "" }]);
  }

  function removeStep(id: string) {
    setSteps((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));
  }

  function handleGenerate() {
    const cleanSteps = steps.map((s) => s.text.trim()).filter(Boolean);
    if (!processName.trim() || cleanSteps.length === 0) return;
    setPreview({ processName: processName.trim(), purpose: purpose.trim(), steps: cleanSteps });
  }

  async function handleCopy() {
    if (!preview) return;
    try {
      await navigator.clipboard.writeText(buildPlainText(preview));
      addToast("SOP copied to clipboard.", "success");
    } catch {
      addToast("Couldn't access the clipboard in this browser.", "danger");
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <PageHeader
        title="AI SOP Builder"
        description="Turn a process name and rough steps into a clean, numbered standard operating procedure."
        icon={<ClipboardList size={20} strokeWidth={1.75} />}
      />

      <div className="space-y-4">
        <div>
          <label htmlFor="sop-name" className="mb-1.5 block text-sm font-medium text-text-light dark:text-text-dark">
            Process name
          </label>
          <input
            id="sop-name"
            value={processName}
            onChange={(e) => setProcessName(e.target.value)}
            placeholder="e.g. Onboarding a new client"
            className="w-full rounded-xl border border-border-light bg-surface-light px-3.5 py-2.5 text-sm text-text-light outline-none placeholder:text-text-muted-light focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
          />
        </div>

        <div>
          <label htmlFor="sop-purpose" className="mb-1.5 block text-sm font-medium text-text-light dark:text-text-dark">
            Purpose <span className="font-normal text-text-muted-light dark:text-text-muted-dark">(optional)</span>
          </label>
          <input
            id="sop-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="One line on why this process exists"
            className="w-full rounded-xl border border-border-light bg-surface-light px-3.5 py-2.5 text-sm text-text-light outline-none placeholder:text-text-muted-light focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
          />
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium text-text-light dark:text-text-dark">Steps</p>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-600 dark:bg-white/5 dark:text-brand-400"
                >
                  {i + 1}
                </span>
                <label htmlFor={step.id} className="sr-only">
                  Step {i + 1}
                </label>
                <input
                  id={step.id}
                  value={step.text}
                  onChange={(e) => updateStep(step.id, e.target.value)}
                  placeholder={`Step ${i + 1}`}
                  className="flex-1 rounded-xl border border-border-light bg-surface-light px-3.5 py-2 text-sm text-text-light outline-none placeholder:text-text-muted-light focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
                />
                <button
                  type="button"
                  onClick={() => removeStep(step.id)}
                  disabled={steps.length <= 1}
                  aria-label={`Remove step ${i + 1}`}
                  className="rounded-lg p-2 text-text-muted-light transition hover:bg-danger-500/10 hover:text-danger-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-30 dark:text-text-muted-dark"
                >
                  <Trash2 size={15} strokeWidth={1.75} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStep}
            className="mt-2 flex items-center gap-1.5 rounded-full border border-border-light px-3 py-1.5 text-xs font-medium text-text-light transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:text-text-dark dark:hover:bg-white/5"
          >
            <Plus size={14} strokeWidth={2} />
            Add step
          </button>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={!processName.trim() || steps.every((s) => !s.text.trim())}
          className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Wand2 size={16} strokeWidth={2} />
          Generate SOP preview
        </button>
      </div>

      {preview && (
        <div className="mt-6 rounded-card border border-border-light bg-surface-light p-5 dark:border-border-dark dark:bg-surface-dark">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-semibold text-text-light dark:text-text-dark">{preview.processName}</h2>
              {preview.purpose && <p className="mt-0.5 text-sm text-text-muted-light dark:text-text-muted-dark">{preview.purpose}</p>}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-border-light px-3 py-1.5 text-xs font-medium text-text-light transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:text-text-dark dark:hover:bg-white/5"
            >
              <Copy size={13} strokeWidth={2} />
              Copy to clipboard
            </button>
          </div>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-text-light marker:font-semibold marker:text-brand-600 dark:text-text-dark dark:marker:text-brand-400">
            {preview.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
