import { useId, useState, type FormEvent } from "react";
import { ChevronDown, LifeBuoy, Send } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { useUiStore } from "../store/uiStore";
import { cn } from "../lib/utils";

const FAQS = [
  {
    question: "Is EchoGPT's AI real in this demo?",
    answer:
      "No — every response is generated locally in your browser from a small bank of hand-written replies. There's no live model and no data ever leaves your device.",
  },
  {
    question: "Can I use my own OpenAI or Anthropic API key?",
    answer: "Not in this build. This is a frontend redesign demo with a simulated AI layer, not a functioning backend integration.",
  },
  {
    question: "Where is my chat history stored?",
    answer: "Entirely in your browser's local storage. Clearing your browser data or using a different device/browser will not carry it over.",
  },
  {
    question: "Do the Connectors and Subscriptions actually do anything?",
    answer: "They're fully interactive but purely local — toggles and plan changes are just demo state, with no real OAuth, network calls, or payment processing.",
  },
  {
    question: "Does the mic or read-aloud button actually work?",
    answer:
      "Yes — those use your browser's real Web Speech APIs (speech-to-text and text-to-speech). They're the one part of this demo that isn't simulated, and they gracefully disable if your browser doesn't support them.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="rounded-xl border border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <span className="text-sm font-medium text-text-light dark:text-text-dark">{question}</span>
        <ChevronDown size={16} strokeWidth={2} className={cn("shrink-0 text-text-muted-light transition-transform dark:text-text-muted-dark", open && "rotate-180")} />
      </button>
      {open && (
        <p id={id} className="px-4 pb-3.5 text-sm text-text-muted-light dark:text-text-muted-dark">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function SupportPage() {
  const addToast = useUiStore((s) => s.addToast);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    addToast("Message queued — this is a demo, so it won't actually be sent anywhere.", "success");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
      <PageHeader title="Support" description="Answers to common questions, plus a way to reach us." icon={<LifeBuoy size={20} strokeWidth={1.75} />} />

      <div className="space-y-2">
        {FAQS.map((f) => (
          <FaqItem key={f.question} question={f.question} answer={f.answer} />
        ))}
      </div>

      <div className="mt-8 rounded-card border border-border-light bg-surface-light p-5 dark:border-border-dark dark:bg-surface-dark">
        <h2 className="mb-1 font-display text-base font-semibold text-text-light dark:text-text-dark">Contact us</h2>
        <p className="mb-4 text-sm text-text-muted-light dark:text-text-muted-dark">
          This form doesn't send anywhere real in this demo — submitting just queues a confirmation toast.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="support-name" className="sr-only">
              Name
            </label>
            <input
              id="support-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full rounded-xl border border-border-light bg-bg-light px-3.5 py-2.5 text-sm text-text-light outline-none placeholder:text-text-muted-light focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-bg-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
            />
          </div>
          <div>
            <label htmlFor="support-email" className="sr-only">
              Email
            </label>
            <input
              id="support-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-border-light bg-bg-light px-3.5 py-2.5 text-sm text-text-light outline-none placeholder:text-text-muted-light focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-bg-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
            />
          </div>
          <div>
            <label htmlFor="support-message" className="sr-only">
              Message
            </label>
            <textarea
              id="support-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="How can we help?"
              required
              className="w-full resize-none rounded-xl border border-border-light bg-bg-light px-3.5 py-2.5 text-sm text-text-light outline-none placeholder:text-text-muted-light focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-border-dark dark:bg-bg-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <Send size={15} strokeWidth={2} />
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}
