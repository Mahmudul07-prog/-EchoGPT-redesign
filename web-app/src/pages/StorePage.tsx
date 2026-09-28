import { useNavigate } from "react-router-dom";
import { Store, Sparkles } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { PERSONAS } from "../lib/personas";
import { useChatStore } from "../store/chatStore";

export default function StorePage() {
  const startSession = useChatStore((s) => s.startSession);
  const selectedModelId = useChatStore((s) => s.selectedModelId);
  const navigate = useNavigate();

  function handleUse(personaId: string) {
    const persona = PERSONAS.find((p) => p.id === personaId);
    if (!persona) return;
    startSession({ title: persona.name, personaId: persona.id, seedAssistantText: persona.intro, modelId: selectedModelId });
    navigate("/");
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <PageHeader
        title="Store"
        description="Ready-made personas that frame a whole conversation around one job — pick one to start a chat pre-seeded with its opening message."
        icon={<Store size={20} strokeWidth={1.75} />}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PERSONAS.map((persona) => (
          <div
            key={persona.id}
            className="flex flex-col gap-3 rounded-card border border-border-light bg-surface-light p-5 shadow-[0_2px_20px_-4px_rgba(124,58,237,0.08)] transition hover:shadow-[0_8px_30px_-6px_rgba(124,58,237,0.25)] dark:border-border-dark dark:bg-surface-dark"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 text-brand-600 dark:text-brand-400">
              <Sparkles size={18} strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-text-light dark:text-text-dark">{persona.name}</p>
              <p className="text-xs font-medium text-brand-600 dark:text-brand-400">{persona.tagline}</p>
              <p className="mt-1.5 text-sm text-text-muted-light dark:text-text-muted-dark">{persona.description}</p>
            </div>
            <button
              type="button"
              onClick={() => handleUse(persona.id)}
              className="mt-auto rounded-full bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              Use
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
