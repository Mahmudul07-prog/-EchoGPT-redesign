import { useState } from "react";
import { FileSearch, Sparkles } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { analyzeJobDescription, jobAnalysisToMarkdown } from "../lib/jobAnalysis";
import { streamText } from "../lib/mockAi";
import { getModel } from "../lib/models";
import { renderMarkdownLite } from "../lib/markdown";

export default function JobAnalysisPage() {
  const [description, setDescription] = useState("");
  const [resultText, setResultText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const hasStarted = resultText.length > 0 || isAnalyzing;

  async function handleAnalyze() {
    const trimmed = description.trim();
    if (!trimmed || isAnalyzing) return;
    setIsAnalyzing(true);
    setResultText("");
    const analysis = analyzeJobDescription(trimmed);
    const markdown = jobAnalysisToMarkdown(analysis);
    const model = getModel("echo-pro");
    for await (const chunk of streamText(markdown, model)) {
      setResultText((prev) => prev + chunk);
    }
    setIsAnalyzing(false);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <PageHeader
        title="AI Job Analysis"
        description="Paste in a job posting and get a structured, local heuristic breakdown — required skills, seniority estimate, red flags, and resume bullets to adapt."
        icon={<FileSearch size={20} strokeWidth={1.75} />}
      />

      <label htmlFor="job-description" className="mb-1.5 block text-sm font-medium text-text-light dark:text-text-dark">
        Job description
      </label>
      <textarea
        id="job-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={8}
        placeholder="Paste the full job posting here…"
        className="w-full resize-none rounded-xl border border-border-light bg-surface-light px-3.5 py-3 text-sm text-text-light outline-none placeholder:text-text-muted-light focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
      />
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={!description.trim() || isAnalyzing}
        className="mt-3 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Sparkles size={16} strokeWidth={2} />
        {isAnalyzing ? "Analyzing…" : "Analyze"}
      </button>

      {hasStarted && (
        <div className="mt-6 rounded-card border border-border-light bg-surface-light p-5 text-sm dark:border-border-dark dark:bg-surface-dark">
          {isAnalyzing ? (
            <p className="whitespace-pre-wrap leading-relaxed text-text-light dark:text-text-dark">
              {resultText}
              <span className="ml-0.5 inline-block h-4 w-[2px] -translate-y-0.5 animate-pulse bg-brand-500 align-middle" aria-hidden="true" />
            </p>
          ) : (
            renderMarkdownLite(resultText)
          )}
        </div>
      )}
    </div>
  );
}
