/**
 * Simulated AI layer (see DESIGN_SPEC.md → "Simulated AI layer").
 *
 * There is no real EchoGPT backend or model API key for this assignment, so every reply is
 * produced locally: the prompt is classified with cheap keyword heuristics, a hand-written,
 * on-brand canned response is picked at random from a small set of variants for that category,
 * lightly reshaped per model "personality", and then streamed back chunk by chunk to simulate
 * token-by-token generation. Nothing here ever makes a network call.
 */

export type ModelId = 'echo-core' | 'echo-turbo' | 'echo-pro' | 'echo-vision'

export type ModelStyle = 'standard' | 'terse' | 'structured' | 'standard-vision'

export interface ModelInfo {
  id: ModelId
  name: string
  shortName: string
  description: string
  badge?: 'PRO'
  style: ModelStyle
  baseDelayMs: number
  jitterMs: number
}

export const MODELS: ModelInfo[] = [
  {
    id: 'echo-core',
    name: 'EchoGPT Core',
    shortName: 'Core',
    description: 'Balanced everyday model for general chat.',
    style: 'standard',
    baseDelayMs: 18,
    jitterMs: 10,
  },
  {
    id: 'echo-turbo',
    name: 'EchoGPT Turbo',
    shortName: 'Turbo',
    description: 'Fastest replies — short and to the point.',
    style: 'terse',
    baseDelayMs: 9,
    jitterMs: 6,
  },
  {
    id: 'echo-pro',
    name: 'EchoGPT Pro',
    shortName: 'Pro',
    badge: 'PRO',
    description: 'Slower, more structured answers with more depth.',
    style: 'structured',
    baseDelayMs: 26,
    jitterMs: 16,
  },
  {
    id: 'echo-vision',
    name: 'EchoGPT Vision',
    shortName: 'Vision',
    badge: 'PRO',
    description: 'Tuned for pages, screenshots and visual context.',
    style: 'standard-vision',
    baseDelayMs: 20,
    jitterMs: 12,
  },
]

export const DEFAULT_MODEL_ID: ModelId = 'echo-core'

export function getModel(modelId: ModelId): ModelInfo {
  return MODELS.find((m) => m.id === modelId) ?? MODELS[0]
}

export type MockCategory = 'career' | 'summary' | 'code' | 'explain' | 'creative' | 'generic'

export interface MockReplyContext {
  /** The raw text the user typed (or a synthesized prompt for a quick action). */
  prompt: string
  /** Force a category instead of classifying `prompt` — used by quick actions / pending actions. */
  categoryHint?: MockCategory
  /** Page title, when page context is available/enabled. */
  pageTitle?: string
  /** Page body text captured by the content script, when page context is available/enabled. */
  pageExcerpt?: string
  /** Selected text, for "Explain selection". */
  selectionText?: string
}

/** Classifies a prompt into a mock-reply category using cheap keyword heuristics. */
export function classifyPrompt(prompt: string): MockCategory {
  const p = prompt.toLowerCase()
  if (/\b(resume|cv|cover letter|interview)\b/.test(p)) return 'career'
  if (/summar/.test(p)) return 'summary'
  if (
    /```/.test(prompt) ||
    /\b(function|bug|component|error|exception|stack trace|debug|typescript|javascript|python|regex|api)\b/.test(p)
  ) {
    return 'code'
  }
  if (/\b(explain|define|what does .* mean|what is)\b/.test(p)) return 'explain'
  if (/\b(write|draft|story|poem|caption|tagline|tweet|social post|blog)\b/.test(p)) return 'creative'
  return 'generic'
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function snippet(text: string, maxLen: number): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLen) return clean
  const cut = clean.slice(0, maxLen)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : maxLen)}…`
}

const CAREER_VARIANTS = [
  "Let's make your resume impossible to skip past. Start with a tight summary line naming your target role and your single strongest outcome — a number if you have one. Rewrite each bullet as impact, not duties: what changed because you were there? Trim anything older than ten years unless it's directly relevant, and keep the whole thing to one page if you're under eight years of experience.",
  "Treat your resume like a landing page: a recruiter scans it for about six seconds before deciding to read on. Put your best, most quantified accomplishment in the top third. Mirror two or three keywords straight from the job description, and swap generic verbs like 'responsible for' for concrete ones like 'shipped', 'negotiated', or 'reduced'.",
  "If you're prepping for an interview off the back of this, pick your three strongest stories and structure each with the STAR method — Situation, Task, Action, Result. Practice saying the Result out loud first; it's the part people usually bury under the setup.",
]

const CODE_VARIANTS = [
  "Here's a pattern that usually cleans this up:\n\n```ts\nfunction retry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {\n  return fn().catch((err) =>\n    attempts > 1 ? retry(fn, attempts - 1) : Promise.reject(err),\n  )\n}\n```\n\nA couple of things worth checking alongside this: make sure the error you're catching is actually the one you expect (log it once before deciding to retry), and cap the total wait time so a flaky dependency can't hang the whole request.",
  "Before touching the code, try to shrink the bug to its smallest reproduction — comment out everything that isn't strictly needed to trigger it. Nine times out of ten the fix reveals itself once the noise is gone. If it's a state bug in a component, log the props and state right before the failing render:\n\n```ts\nconsole.log('render', { props, state })\n```\n\nand diff the last good render against the first bad one.",
  "One thing that trips this up a lot: an async effect that's still resolving after the component using it has unmounted. Guard it with a cancelled flag:\n\n```ts\nuseEffect(() => {\n  let cancelled = false\n  run().then((result) => {\n    if (!cancelled) setValue(result)\n  })\n  return () => {\n    cancelled = true\n  }\n}, [])\n```\n\nThat one pattern quietly fixes a surprising number of 'it works, but only sometimes' bugs.",
]

const CREATIVE_VARIANTS = [
  "Here's a first pass — punchy and a little playful:\n\n> Some ideas don't wait for permission. This is one of them.\n\nIf you want it warmer or more premium-sounding, give me the vibe in one word (playful, bold, minimal) and I'll rewrite around that.",
  "Draft one: lead with a concrete image instead of an abstract claim — readers remember pictures, not adjectives.\n\n> Three tabs open, one deadline, zero panic. That's the idea in one sentence.\n\nWant a longer version, or a shorter, punchier one?",
  "Here's a rougher, more conversational take:\n\n> We didn't set out to build another chat app. We set out to stop switching between four of them.\n\nTell me the audience and I'll adjust the register — this reads fine for a landing page, less so for a formal announcement.",
]

const GENERIC_VARIANTS = [
  "Good question. Give me a bit more to go on — the outcome you want, any constraints, or an example of 'good' — and I can get specific instead of general. In the meantime, here's a reasonable starting point: break it into the smallest piece you can act on today, and iterate from there.",
  "Happy to help with that. Since this is a simulated reply for the demo, I'm keeping it general — but the shape of a real answer would start by clarifying the goal, listing two or three options, and picking one with a clear reason. Want me to walk through that structure for your specific case?",
  "Here's how I'd think about it: separate the part that's a decision from the part that's just execution. The decision usually only needs one or two sentences once you say it out loud; the execution is where people tend to overspend time. Want to talk through the decision first?",
]

function composeSummary(ctx: MockReplyContext): string {
  const title = ctx.pageTitle?.trim() || 'this page'
  const hook = ctx.pageExcerpt ? snippet(ctx.pageExcerpt, 160) : undefined
  const variants = hook
    ? [
        `Here's the gist of **${title}**: it opens with "${hook}" and builds its supporting argument from there. The rest of the page mostly adds examples and detail around that same point — tell me what you're trying to get out of it and I can go deeper on just that part.`,
        `Quick take on **${title}**: "${hook}" is basically the thesis — everything after it is supporting detail. If you need this for someone else (a recap, a citation, a decision), tell me the audience and I'll reshape the summary around that.`,
      ]
    : [
        `Here's a summary of **${title}**: the page opens with its main claim, then spends the rest of the space backing it up with detail and examples. Ask me about a specific section and I can zoom in further.`,
        `Quick take on **${title}**: it's structured like most explainer pages — a claim up top, evidence in the middle, and a takeaway at the end. Let me know which part you want expanded.`,
      ]
  return pick(variants)
}

function composeExplain(ctx: MockReplyContext): string {
  const raw = ctx.selectionText?.trim()
  const snip = raw ? snippet(raw, 180) : undefined
  const variants = snip
    ? [
        `You highlighted: "${snip}". Broken down, that's making a claim and then backing it with a supporting detail — it just reads denser than it needs to. Tell me which part is unclear (a term, the logic, or how it connects to what came before) and I'll zoom in on just that.`,
        `Taking that selection at face value: it's dense mostly because of the vocabulary, not the idea underneath. Strip the jargon and it's saying something fairly ordinary. Want me to rewrite it in plain language, or explain one specific word?`,
      ]
    : [
        `Here's a plain-language pass on this page: the core idea usually sits in the first paragraph or the heading right above the fold, and everything after tends to be supporting detail. Select a specific sentence and I can be a lot more precise.`,
        `Without a specific selection I'm explaining at the page level: expect the opening section to carry the main claim, with the rest expanding on it. Highlight the exact part you want unpacked and I'll go line by line.`,
      ]
  return pick(variants)
}

function composeBase(category: MockCategory, ctx: MockReplyContext): string {
  switch (category) {
    case 'career':
      return pick(CAREER_VARIANTS)
    case 'summary':
      return composeSummary(ctx)
    case 'code':
      return pick(CODE_VARIANTS)
    case 'explain':
      return composeExplain(ctx)
    case 'creative':
      return pick(CREATIVE_VARIANTS)
    default:
      return pick(GENERIC_VARIANTS)
  }
}

function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+(?=[A-Z0-9"'`*])/)
}

function toTerse(text: string): string {
  const sentences = splitSentences(text)
  return sentences.slice(0, 2).join(' ').trim()
}

function toStructured(text: string): string {
  const sentences = splitSentences(text).filter(Boolean)
  if (sentences.length <= 1) return text
  const lead = sentences[0].trim()
  const bullets = sentences.slice(1, 4)
  const rest = sentences.slice(4).join(' ').trim()
  const bulletBlock = bullets.length ? `\n\n${bullets.map((s) => `- ${s.trim()}`).join('\n')}` : ''
  return `**${lead}**${bulletBlock}${rest ? `\n\n${rest}` : ''}`
}

function withVisionNote(text: string, hasPageContext: boolean): string {
  const note = hasPageContext
    ? "\n\n*(Vision tip: if this were an image or a screenshot, I could describe the layout and call out any visible text too.)*"
    : "\n\n*(Tip: attach or describe an image and I can factor in what's visually on the page too.)*"
  return text + note
}

function applyStyle(category: MockCategory, style: ModelStyle, base: string, hasPageContext: boolean): string {
  let text = base
  if (category !== 'code') {
    if (style === 'terse') text = toTerse(text)
    if (style === 'structured') text = toStructured(text)
  }
  if (style === 'standard-vision') text = withVisionNote(text, hasPageContext)
  return text
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Groups streamed text into small multi-token chunks, roughly simulating token output. */
function chunkText(text: string): string[] {
  const tokens = text.match(/\S+\s*/g) ?? [text]
  const chunks: string[] = []
  for (let i = 0; i < tokens.length; i += 2) {
    chunks.push(tokens.slice(i, i + 2).join(''))
  }
  return chunks
}

/**
 * Streams a fully local, canned reply chunk by chunk. Never touches the network — this is the
 * entire "AI" for this project, per DESIGN_SPEC.md's Simulated AI layer contract.
 */
export async function* generateMockReply(
  prompt: string,
  modelId: ModelId,
  context: Omit<MockReplyContext, 'prompt'> = {},
): AsyncGenerator<string, void, unknown> {
  const ctx: MockReplyContext = { prompt, ...context }
  const category = ctx.categoryHint ?? classifyPrompt(prompt)
  const model = getModel(modelId)
  const base = composeBase(category, ctx)
  const hasPageContext = Boolean(ctx.pageExcerpt || ctx.pageTitle)
  const full = applyStyle(category, model.style, base, hasPageContext)
  for (const chunk of chunkText(full)) {
    await sleep(model.baseDelayMs + Math.random() * model.jitterMs)
    yield chunk
  }
}
