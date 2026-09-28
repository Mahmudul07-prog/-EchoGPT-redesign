import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, FileSearch, ListChecks } from "lucide-react";
import { PageHeader } from "../components/PageHeader";

const TOOLS = [
  {
    to: "/ai-tasks/job-analysis",
    icon: FileSearch,
    title: "AI Job Analysis",
    description: "Paste a job description and get a structured breakdown: required skills, an estimated seniority level, phrases worth double-checking, and resume bullets to adapt.",
  },
  {
    to: "/ai-tasks/sop-builder",
    icon: ClipboardList,
    title: "AI SOP Builder",
    description: "Turn a process name and rough steps into a clean, numbered standard operating procedure you can copy straight into your docs.",
  },
];

export default function AiTasksPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
      <PageHeader
        title="AI Tasks"
        description="Focused mock tools built on the same simulated AI layer as chat — pick one to get started."
        icon={<ListChecks size={20} strokeWidth={1.75} />}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="group flex flex-col gap-3 rounded-card border border-border-light bg-surface-light p-5 shadow-[0_2px_20px_-4px_rgba(124,58,237,0.08)] transition hover:shadow-[0_8px_30px_-6px_rgba(124,58,237,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-surface-dark"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 text-brand-600 dark:text-brand-400">
              <tool.icon size={18} strokeWidth={1.75} />
            </div>
            <p className="font-display text-base font-semibold text-text-light dark:text-text-dark">{tool.title}</p>
            <p className="flex-1 text-sm text-text-muted-light dark:text-text-muted-dark">{tool.description}</p>
            <span className="flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400">
              Open tool
              <ArrowRight size={15} strokeWidth={2} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
