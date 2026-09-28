# EchoGPT — Web App (Redesign)

A redesigned single-page web app for **EchoGPT**, a multi-AI chat productivity product. This is the
full chat-plus-surrounding-tools experience (as opposed to the marketing landing page or the browser
extension, which live in the sibling `landing-page/` and `extension/` folders of this repo).

This redesign evolves the real EchoGPT product's existing nomenclature and violet/indigo brand
family (see `../SOURCE_ANALYSIS.md`) while modernizing the visual system, adding full responsive
behavior, real accessibility support, and motion/micro-interactions, per `../DESIGN_SPEC.md`.

## Setup

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check (tsc -b) and produce a production build in dist/
npm run preview   # preview the production build locally
npm run lint       # oxlint
```

Requires Node 18+.

## Tech stack

- **React 19 + TypeScript + Vite** — app shell and build tooling.
- **Tailwind CSS v4** (via `@tailwindcss/vite`, no `tailwind.config.js`) — all design tokens
  (colors, fonts, radii) are declared in the `@theme` block in `src/index.css`.
- **react-router-dom** — client-side routing for all 13 routes.
- **zustand** (+ its `persist` middleware) — all app state: chat sessions/messages, theme,
  settings, auth, connector toggles, and generated-media history, persisted to `localStorage`.
- **framer-motion** — entrance/hover animations, the mobile sidebar drawer, dialogs, and
  streaming-reply affordances; every animated component respects `prefers-reduced-motion` via
  `useReducedMotion()`.
- **lucide-react** — iconography.
- **@fontsource-variable/inter** and **@fontsource-variable/plus-jakarta-sans** — self-hosted
  variable fonts (no remote font requests at runtime).

## Key assumption: the simulated AI layer

**There is no real EchoGPT backend or model API key for this assignment.** Every "AI" reply in
this app — chat, Compare mode, persona intros in the Store, AI Job Analysis, image/video studio
captions — is produced entirely client-side by `src/lib/mockAi.ts`:

- `generateMockReply(prompt, modelId, model)` classifies the prompt with cheap keyword heuristics
  (resume/CV, summarize, code/bug, greeting, or a general fallback) and picks a random hand-written
  reply variant from a small bank tuned to that category.
- The reply is streamed back with `streamText()`, chunk by chunk, at a pace/chunk-size derived from
  the selected model (`src/lib/models.ts`) — e.g. **EchoGPT Turbo**/**Mini** stream faster and
  terser, **EchoGPT Pro**/**Vision** stream slower with more structure — so Compare mode actually
  looks different across models.
- Image Studio and Video Studio never call a real image/video model either: `src/lib/generativeArt.ts`
  hashes the prompt (+ style/aspect) into a seeded PRNG and derives a deterministic abstract
  gradient tile, so the same prompt always renders the same "concept preview." Both pages carry an
  explicit on-screen caption saying generation is simulated.
- A first-run banner on the empty Chat screen (dismissible, tracked in Settings state) and a line
  in Settings → About both disclose that responses are generated locally and nothing typed ever
  leaves the browser. No code path in this app makes a network request for "AI" functionality.

The **one exception** is genuinely real: the composer's mic button uses the actual browser
`SpeechRecognition` API, and each assistant message's "read aloud" button uses the actual
`window.speechSynthesis` API. Both are feature-detected and degrade to a disabled, tooltipped
control when unsupported — see `src/lib/speech.ts` and `src/hooks/useSpeechRecognition.ts`.

Everything else that looks like a backend — Connectors' OAuth-style toggles, Subscriptions'
upgrade flow, the Support contact form, Settings' avatar upload — is explicitly local, mocked
state with no real network calls, no payment collection, and no password fields anywhere (sign-in
is a name-only mock modal, per the assignment's constraints).

## Routes

| Route | Page |
|---|---|
| `/` | Chat (empty state, streaming chat, Compare-mode toggle) |
| `/history` | Chat history, grouped by date, searchable, renameable, deletable |
| `/compare` | Standalone Compare-mode landing view |
| `/connectors` | Mock integration toggles (Drive, Notion, Slack, GitHub, Figma, Gmail) |
| `/store` | Persona cards that seed a new chat |
| `/image-studio` | Deterministic "generated" concept art |
| `/video-studio` | Deterministic mock 4-frame storyboard |
| `/ai-tasks` | Hub linking to the two AI Tasks tools |
| `/ai-tasks/job-analysis` | Paste-a-job-description structured breakdown |
| `/ai-tasks/sop-builder` | Process + steps → numbered SOP, copy to clipboard |
| `/settings` | Profile, appearance, default model, notifications, data, about |
| `/subscriptions` | Free/Pro/Team tiers, monthly/yearly toggle, demo upgrade modal |
| `/support` | FAQ accordion + mock contact form |

## Notable additions beyond the checklist

- A **"stop generating"** control on the composer while a reply is streaming (an in-memory abort
  flag checked between streamed chunks in `chatStore`).
- **Regenerate** picks a fresh random variant from the same category, so re-rolling a reply
  actually looks different.
- A small **generated-media gallery** (Image Studio / Video Studio) persisted via a dedicated
  `mediaStore`, so past "generations" are still there after a reload.
- A simulated **plan/billing state** in Settings/Subscriptions: confirming the demo "upgrade" modal
  actually flips your active plan (still clearly labeled as non-payment).
- Inline **expandable AI Tasks submenu** in the sidebar (Job Analysis / SOP Builder), matching the
  flatter nav vocabulary from the original product while keeping the sidebar organized.
- A hand-rolled **markdown-lite renderer** (`src/lib/markdown.tsx`) supporting bold, inline code,
  fenced code blocks (with a copy button), and bullet/numbered lists — implemented as plain React
  nodes, with no `dangerouslySetInnerHTML` anywhere in the app.

## Project structure

```
src/
  components/   Reusable UI: layout shell, dialogs, composer, message bubbles, etc.
  pages/        One file per route.
  store/        zustand stores (chat, settings, auth, connectors, media, ui/toasts).
  lib/          Mock AI layer, markdown renderer, generative art, personas/connectors data, utils.
  hooks/        useThemeEffect, useFocusTrap, useSpeechRecognition.
  types/        Shared TypeScript types + ambient SpeechRecognition typings.
```
