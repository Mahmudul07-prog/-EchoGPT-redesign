// The "simulated AI layer" — see DESIGN_SPEC.md's "Simulated AI layer" section.
//
// There is no real EchoGPT backend or model API key for this assignment, so
// every reply below is hand-written and picked at random from a small bank of
// on-brand variants, then streamed back chunk-by-chunk to fake token
// streaming. No network request is ever made here.

import type { ModelInfo, ReplyCategory } from "../types";
import { delay, pickRandom, randInt } from "./utils";

interface ReplyVariant {
  text: string;
  length: "short" | "long";
}

const RESUME_REPLIES: ReplyVariant[] = [
  {
    length: "short",
    text: `Happy to help tighten your resume. A few quick wins:

- Lead every bullet with an **action verb** ("shipped", "reduced", "led"), not "responsible for"
- Attach a **number** wherever you can (%, $, time saved, users reached)
- Cut anything older than ~10 years unless it's directly relevant

Paste a specific bullet or role and I'll rewrite it with you.`,
  },
  {
    length: "long",
    text: `Let's make this resume work harder for you. Here's a structure that tends to pass both applicant-tracking systems and human skimmers:

**1. Summary (2 lines max)** — role + years of experience + your strongest domain.

**2. Experience** — reverse-chronological, 3-5 bullets per role, each shaped like:
\`Action verb + what you did + measurable outcome\`
e.g. "Redesigned onboarding flow, cutting drop-off by **31%** in 6 weeks."

**3. Skills** — group by category (Languages, Tools, Domains) so it's scannable in 3 seconds.

If you paste in a specific bullet point or your target job title, I can help rewrite it to match the role.`,
  },
  {
    length: "short",
    text: `Quick resume pass:

1. Swap passive phrasing ("was responsible for") for direct verbs ("owned", "built", "cut")
2. Keep each bullet to one line — recruiters spend ~7 seconds per resume
3. Mirror 2-3 keywords from the job post itself, naturally

Want me to rewrite a specific section? Paste it in.`,
  },
];

const SUMMARY_REPLIES: ReplyVariant[] = [
  {
    length: "short",
    text: `Here's the gist, condensed:

**Main idea:** the core argument centers on one clear trade-off, weighed against a couple of supporting points.

**Key takeaways:**
- The central claim is stated early and repeated for emphasis
- Two or three supporting examples back it up
- There's a caveat near the end worth not skipping

Paste the full text (or a link's content) and I'll tailor this to the actual source.`,
  },
  {
    length: "long",
    text: `Here's a structured summary:

**TL;DR** — the piece makes one central claim and spends most of its length defending it with examples and a counter-argument it then dismisses.

**Breakdown:**
- *Opening* sets up the problem or question being addressed
- *Middle* walks through 2-3 pieces of supporting evidence, usually strongest-first
- *Closing* either restates the claim more strongly or leaves a nuanced caveat

**Worth noting:** watch for the caveat buried near the end — it's often the most important qualifier and easiest part to skim past.

Share the actual text or article and I'll produce a real summary instead of this template.`,
  },
  {
    length: "short",
    text: `Condensed version:

- One core claim, introduced early
- Backed by a couple of concrete examples
- A brief caveat or exception near the close

Drop in the actual content (or the page you want summarized) and I'll summarize *that* specifically.`,
  },
];

const CODE_REPLIES: ReplyVariant[] = [
  {
    length: "short",
    text: `Here's a minimal pattern for that:

\`\`\`typescript
function debounce<T extends (...args: never[]) => void>(fn: T, wait = 250) {
  let handle: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(handle);
    handle = setTimeout(() => fn(...args), wait);
  };
}
\`\`\`

Common culprits when something like this misbehaves: a stale closure over \`args\`, forgetting to clear the previous timer, or calling it inside a loop that re-creates the debounced function every render.`,
  },
  {
    length: "long",
    text: `Let's work through this step by step.

**1. Isolate the failure** — reproduce it with the smallest input that still breaks. If it's a UI component, check what re-renders right before the bug appears.

**2. A common shape for this class of bug:**

\`\`\`typescript
function safeDivide(a: number, b: number): number | null {
  if (b === 0) return null; // guard the edge case explicitly
  return a / b;
}
\`\`\`

**3. Checklist:**
- Off-by-one on loop bounds or array slicing
- A \`useEffect\`/callback closing over a stale value
- An \`async\` function whose error path isn't awaited or caught
- Mutating state directly instead of returning a new object/array

Paste the actual function and the error message and I'll point at the exact line.`,
  },
  {
    length: "short",
    text: `A pattern worth trying:

\`\`\`typescript
try {
  const result = await riskyCall();
  return { ok: true, result } as const;
} catch (error) {
  console.error("riskyCall failed:", error);
  return { ok: false, error } as const;
}
\`\`\`

That keeps failure explicit in the return type instead of relying on callers to remember to \`try/catch\`. If you share the stack trace I can narrow it down further.`,
  },
];

const GREETING_REPLIES: ReplyVariant[] = [
  { length: "short", text: `Hey! Good to see you. What are we working on today?` },
  {
    length: "short",
    text: `Hi there 👋 — I'm ready when you are. Ask me anything, or try Compare mode to see a few models answer side by side.`,
  },
  { length: "short", text: `Hello! What can I help you build, write, or figure out today?` },
];

const GENERAL_REPLIES: ReplyVariant[] = [
  {
    length: "short",
    text: `Good question. Here's a starting point:

- Break it into the smallest piece you can act on today
- Write down the constraint that's actually blocking you (time, info, or a decision)
- Revisit the rest once that first piece is solved

Tell me more about the specifics and I'll go deeper.`,
  },
  {
    length: "long",
    text: `Let's think through this together.

**Framing it:** most questions like this have three moving parts — the goal, the constraint, and the option you haven't tried yet.

1. What outcome would count as a clear win here?
2. What's actually stopping you right now — time, information, or approval from someone else?
3. Is there a smaller version of this you could test before committing fully?

Give me a bit more context on your specific situation and I'll tailor the advice instead of speaking in generalities.`,
  },
  {
    length: "short",
    text: `Here's a quick take:

- Start with the version that could be wrong fastest — it teaches you the most per minute
- Keep a short list of what you've already ruled out so you don't repeat it later
- When in doubt, ship the smaller thing and iterate

What's the specific context? I can get a lot more concrete.`,
  },
];

const REPLY_BANK: Record<ReplyCategory, ReplyVariant[]> = {
  resume: RESUME_REPLIES,
  summary: SUMMARY_REPLIES,
  code: CODE_REPLIES,
  greeting: GREETING_REPLIES,
  general: GENERAL_REPLIES,
};

const RESUME_PATTERN = /\b(resume|cv|cover letter)\b/i;
const SUMMARY_PATTERN = /\bsummar(y|ize|ise|ies)\b/i;
const CODE_PATTERN = /\b(function|bug|component|code|error|exception|typescript|javascript|python|react|api|stack trace|debug)\b/i;
const GREETING_PATTERN = /^\s*(hi|hello|hey|yo|sup|good (morning|afternoon|evening))\b/i;

export function classifyPrompt(prompt: string): ReplyCategory {
  if (RESUME_PATTERN.test(prompt)) return "resume";
  if (SUMMARY_PATTERN.test(prompt)) return "summary";
  if (CODE_PATTERN.test(prompt)) return "code";
  if (GREETING_PATTERN.test(prompt) && prompt.trim().split(/\s+/).length <= 6) return "greeting";
  return "general";
}

function pickVariant(category: ReplyCategory, model: ModelInfo): string {
  const variants = REPLY_BANK[category];
  const preferred = variants.filter((v) => v.length === model.prefersLength);
  const pool = preferred.length > 0 ? preferred : variants;
  return pickRandom(pool).text;
}

/** Splits text into tokens (words + whitespace) while preserving exact reconstruction. */
function tokenize(text: string): string[] {
  return text.split(/(\s+)/).filter((t) => t.length > 0);
}

/**
 * Streams `text` back chunk-by-chunk at a pace derived from `model`, e.g. to
 * replay a persona intro or a dynamically-built (non-chat) reply through the
 * same token-reveal animation as a regular chat message.
 */
export async function* streamText(text: string, model: ModelInfo): AsyncGenerator<string> {
  const tokens = tokenize(text);
  let i = 0;
  while (i < tokens.length) {
    const size = randInt(model.chunkSize[0], model.chunkSize[1]);
    const chunk = tokens.slice(i, i + size).join("");
    i += size;
    if (chunk) yield chunk;
    await delay(randInt(model.speedMs[0], model.speedMs[1]));
  }
}

/**
 * Classifies `prompt` with cheap keyword heuristics, picks a random on-brand
 * canned reply variant that matches the given model's tone, and streams it
 * back chunk by chunk. This is the only "AI" in this demo — everything is
 * generated locally, synchronously available, and never leaves the browser.
 */
export async function* generateMockReply(prompt: string, modelId: string, model: ModelInfo): AsyncGenerator<string> {
  const category = classifyPrompt(prompt);
  const text = pickVariant(category, model);
  yield* streamText(text, model);
  // modelId is part of the public contract (per-model tone/speed) even though
  // this implementation derives behavior from the resolved `model` object.
  void modelId;
}
