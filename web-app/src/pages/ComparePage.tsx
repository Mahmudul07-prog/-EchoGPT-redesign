import { Columns2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { CompareWorkspace } from "../components/CompareWorkspace";

export default function ComparePage() {
  return (
    <div className="flex h-full flex-col px-4 pt-6 sm:px-6">
      <PageHeader
        title="Compare models"
        description="Send one prompt to 2–3 EchoGPT models at once and see how their tone, structure, and speed differ side by side."
        icon={<Columns2 size={20} strokeWidth={1.75} />}
      />
      <div className="-mx-4 min-h-0 flex-1 rounded-t-card border-t border-border-light sm:-mx-6 dark:border-border-dark">
        <CompareWorkspace />
      </div>
    </div>
  );
}
