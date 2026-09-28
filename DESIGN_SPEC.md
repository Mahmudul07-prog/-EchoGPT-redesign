# EchoGPT Redesign — Shared Design Spec

This file is the single source of truth for visual language across all three deliverables
(`web-app`, `landing-page`, `extension`). Every project must use these exact tokens so the
three feel like one product family.

## Brand

- Product name: **EchoGPT** — multi-AI chat productivity platform.
- Logo mark: a circular gradient badge (indigo → violet → fuchsia) with a simple abstract
  "echo" glyph (concentric arcs or a stylized "E"). Wordmark uses the display font, semibold,
  tight tracking.
- Tone: confident, modern, "pro creator tool" — not corporate-enterprise, not toy-like.

## Color tokens (define as CSS variables + Tailwind v4 `@theme` block)

Use these exact hex values in every project's `src/index.css`:

```css
@import "tailwindcss";

@theme {
  /* Brand */
  --color-brand-50:  #f5f3ff;
  --color-brand-100: #ede9fe;
  --color-brand-200: #ddd6fe;
  --color-brand-300: #c4b5fd;
  --color-brand-400: #a78bfa;
  --color-brand-500: #8b5cf6;
  --color-brand-600: #7c3aed;
  --color-brand-700: #6d28d9;
  --color-brand-800: #5b21b6;
  --color-brand-900: #4c1d95;

  --color-accent-500: #d946ef; /* fuchsia accent for gradients */
  --color-accent-600: #c026d3;

  --color-gold-400: #fbbf24;  /* PRO badges */
  --color-gold-500: #f59e0b;

  --color-success-500: #22c55e;
  --color-danger-500: #ef4444;

  /* Light surfaces */
  --color-bg-light: #fafafc;
  --color-surface-light: #ffffff;
  --color-sidebar-light: #f6f4fe;
  --color-border-light: #e6e2f5;
  --color-text-light: #18181b;
  --color-text-muted-light: #6b7280;

  /* Dark surfaces */
  --color-bg-dark: #0b0a12;
  --color-surface-dark: #15141f;
  --color-sidebar-dark: #110f1a;
  --color-border-dark: #262435;
  --color-text-dark: #f4f4f5;
  --color-text-muted-dark: #a1a1aa;

  --font-display: "Plus Jakarta Sans Variable", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;

  --radius-card: 1rem;      /* 16px */
  --radius-pill: 999px;
}
```

Dark mode strategy: Tailwind v4 class-based dark mode. Add `@custom-variant dark (&:where(.dark, .dark *));`
at the top of `index.css` and toggle a `.dark` class on `<html>`. Persist the choice
(`localStorage`, key `echogpt-theme`, values `light" | "dark" | "system"`), default to `system`
(`prefers-color-scheme`).

## Typography

- Fonts self-hosted via `@fontsource-variable/inter` and `@fontsource-variable/plus-jakarta-sans`
  (npm packages) — never load from a remote CDN (the extension's CSP forbids remote fonts/scripts,
  and self-hosting keeps the web app fast).
- Headings (`h1`–`h3`, hero/section titles): `font-display`, weight 600–700, tight tracking
  (`tracking-tight`).
- Body/UI text: `font-body`, weight 400–500.
- Scale: hero `text-4xl md:text-6xl`, section title `text-3xl md:text-4xl`, card title `text-lg`,
  body `text-base`, small/meta `text-sm`.

## Shape, elevation, spacing

- Corner radius: cards/panels `rounded-2xl` (16px), buttons/inputs/avatars `rounded-full` for
  pill controls, `rounded-xl` for smaller inputs.
- Shadows: soft and tinted, e.g. `shadow-[0_2px_20px_-4px_rgba(124,58,237,0.15)]` on cards;
  avoid harsh default `shadow-lg` grays.
- Borders: 1px `border-border-light` / `border-border-dark`, never harsh black.
- Spacing rhythm: 4px base unit: p-2/p-3/p-4/p-6/p-8 conventions; page containers
  `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Buttons: primary = gradient `from-brand-600 to-accent-600`, white text, `rounded-full`,
  `hover:brightness-110 active:scale-[0.97]` transition; secondary = `border border-border`
  bg transparent; ghost = icon-only, `hover:bg-brand-50 dark:hover:bg-white/5`.

## Motion (Framer Motion)

- Entrance: fade + translateY(16px)→0, duration 0.45s, ease `[0.16,1,0.3,1]`, staggered
  children (0.06–0.08s stagger) for lists/grids.
- Hover: cards scale to 1.02 with shadow growth; buttons scale to 0.97 on tap.
- Respect `prefers-reduced-motion` via Framer's `useReducedMotion()` — disable translate/scale,
  keep opacity fades only.
- Chat message streaming: simulate token-by-token reveal (~15–30ms per chunk) with a blinking
  caret while "typing".

## Iconography

- `lucide-react` exclusively, stroke width 1.75–2, sized 18/20/24px depending on context.

## Accessibility baseline (all three projects)

- Every interactive element reachable by keyboard, visible focus ring
  (`focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2`).
- Color contrast ≥ 4.5:1 for body text in both themes (verify against the tokens above).
- Semantic landmarks (`nav`, `main`, `aside`, `header`, `footer`), `aria-label` on icon-only
  buttons, `alt` text on images, form inputs always paired with a `<label>` (visually hidden
  where the design needs it compact).
- Modal/dialog/side panels trap focus and close on `Escape`.

## Simulated AI layer (no backend/API key exists for this assignment)

There is no real EchoGPT backend or model API key available, so every project implements its
own local "mock AI" module (not shared code — each project gets its own small implementation
of the same contract, so they can stay fully standalone):

- A function `generateMockReply(prompt: string, modelId: string): AsyncGenerator<string>` (or an
  equivalent callback/stream API) that classifies the prompt with cheap keyword heuristics
  (mentions "resume"/"cv" → career-coach-flavored reply; "summar" → summary-flavored reply using
  any supplied page context; code fences / words like "function", "bug", "component" → a reply
  containing a fenced code block; otherwise a generic helpful-assistant reply) and yields a
  hand-written, on-brand canned response (several variants per category, picked randomly so
  repeat demos don't look identical) chunk by chunk to simulate token streaming (~15–30ms per
  chunk, small randomized jitter).
- Different `modelId`s should feel slightly different (e.g., a "Turbo" model replies faster and
  terser, a "Pro"/"Vision" model replies slightly slower with more structure) so Compare mode
  is visually interesting.
- Always clearly a simulation: a small helper caption near first-run or in Settings/About should
  state that responses are generated locally for demo purposes (no data leaves the browser) —
  never claim a real model is answering.
- No real network calls for "AI" functionality anywhere (fonts are bundled at build time, so
  there should be zero runtime network requests from any of the three projects).

## Source of truth for the redesigned product

See `SOURCE_ANALYSIS.md` for what the current EchoGPT web app and Chrome extension look like
today — the redesign should feel like a clear evolution of that product (same nomenclature,
same core sidebar navigation items), not an unrelated new app.
