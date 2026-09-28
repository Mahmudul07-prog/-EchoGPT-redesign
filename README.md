# EchoGPT — Frontend Redesign

A full frontend redesign of **EchoGPT** (a multi-AI chat productivity app), built as three linked
deliverables in one repo.

**Live demos:** [Web App](https://echogpt-web-app.vercel.app/) · [Landing Page](https://echogpt-landing-page-ochre.vercel.app/)
**Repository:** https://github.com/Mahmudul07-prog/-EchoGPT-redesign

| Folder | What it is | Stack |
|---|---|---|
| [`web-app/`](./web-app) | Redesigned EchoGPT web app — chat + every surrounding tool (history, compare, connectors, store, image/video studio, AI tasks, settings, subscriptions, support) | React 19 + TypeScript + Vite + Tailwind v4 |
| [`landing-page/`](./landing-page) | Single-page marketing site for EchoGPT | React 19 + TypeScript + Vite + Tailwind v4 |
| [`extension/`](./extension) | Real, loadable Chrome Manifest V3 extension (quick-launcher popup + side panel chat) | React 19 + TypeScript + Vite + CRXJS + Tailwind v4 |

Start with [`DESIGN_SPEC.md`](./DESIGN_SPEC.md) (the shared visual language every project follows —
color tokens, type, motion, accessibility baseline, and the "simulated AI layer" contract) and
[`SOURCE_ANALYSIS.md`](./SOURCE_ANALYSIS.md) (notes on what the current live EchoGPT web app and
Chrome extension look like today, which this redesign evolves from). Each project folder also has
its own README with full setup/structure/assumptions specific to that piece.

## Why there's no real AI backend here

There is no EchoGPT API key or backend available for this assignment. All three projects
implement their own local **simulated AI layer**: prompts are classified by keyword and answered
with hand-written, on-brand canned responses streamed back chunk-by-chunk to imitate token
generation. This is disclosed in-product (a small caption near the empty chat state / Settings →
About) rather than pretended to be real. Two things *are* real, not mocked: the mic button
(browser `SpeechRecognition`) and the "read aloud" button (`speechSynthesis`) in the web app —
both feature-detected with a graceful fallback where unsupported. Nothing in any of the three
projects makes a real network call.

## Quick start

Each project is fully standalone (its own `package.json`/`node_modules`/lockfile) so it can be
opened, installed, and deployed independently. From the repo root, convenience scripts wrap all
three:

```bash
npm run install:all     # npm install in all three projects
npm run dev:web         # http://localhost:5173
npm run dev:landing     # http://localhost:5173 (run one at a time, or pass --port yourself)
npm run dev:extension   # http://localhost:5175 — also previewable as plain pages, see extension/README.md
npm run build:all       # production build of all three
```

Or work inside a single project as usual (`cd web-app && npm install && npm run dev`).

### Loading the Chrome extension for real

```bash
cd extension
npm install
npm run build
```

Then in Chrome: `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select
`extension/dist`. Click the toolbar icon for the quick-launcher popup, or press **Ctrl+Shift+E**
(**Cmd+Shift+E** on macOS) to open the side panel. Full details in
[`extension/README.md`](./extension/README.md).

## Tech stack (shared across all three)

- **React 19 + TypeScript**, **Vite 8**
- **Tailwind CSS v4** via `@tailwindcss/vite` — no `tailwind.config.js`; every color/font/radius
  token lives in each project's `src/index.css` as a Tailwind v4 `@theme` block, copied identically
  from `DESIGN_SPEC.md`
- **Framer Motion** for motion (respecting `prefers-reduced-motion` everywhere), **lucide-react**
  for icons, self-hosted variable fonts (`@fontsource-variable/inter`,
  `@fontsource-variable/plus-jakarta-sans` — no remote font/script CDNs, which also keeps the
  extension's Manifest V3 CSP happy)
- `web-app` and `extension` additionally use **zustand** (+ its `persist` middleware) for state and
  **react-router-dom** (web app only — the extension has no router, just two React roots; the
  landing page has no router either — it's a true single page navigated by anchor links)
- `extension` additionally uses **`@crxjs/vite-plugin`** to build the Manifest V3 bundle (manifest,
  background service worker, content script, popup, side panel) from one Vite config

## Assumptions & scope decisions

- **Simulated AI, not a mock UI with dead ends.** Every route/view is fully clickable end to end —
  no placeholder "TODO" screens — the simulation is only in *what generates the reply text*, not in
  whether a feature is wired up.
- **No real third-party logos/trademarks.** "AI Models" everywhere uses invented, EchoGPT-branded
  model names (Turbo / Pro / Vision / Code) rather than reproducing OpenAI/Google/Anthropic/Meta
  branding.
- **No real payment, auth, or checkout flow.** Pricing pages are visual only ("this is a demo — no
  real payment is processed"); sign-in is a name-only "Continue as Guest"-style mock, never a
  password field.
- **Testimonials (landing page) are clearly fictional** — first name + last initial, initials-only
  avatars, captioned as illustrative.
- **GitHub repo / live demo hosting**: this development environment has no GitHub CLI or
  Vercel/Netlify CLI authenticated, so the repo could not be pushed or deployed from here. See
  **Publishing this repo** below for the exact steps to do that from your own machine/account.

## Publishing this repo (GitHub + live demo)

This folder is already a git repository with the initial work committed locally. To finish the
submission:

**1. Push to GitHub**

```bash
cd "D:\Mahmudul file\EchoGPT-Redesign"
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

(Create the empty repo first at https://github.com/new — don't initialize it with a README, so
there's no merge conflict with this repo's history.)

**2. Deploy a live demo (Vercel — same steps apply to Netlify)**

`web-app` and `landing-page` each deploy as an independent Vercel project pointed at a
**subdirectory** of this one repo:

1. https://vercel.com/new → import your GitHub repo.
2. Set **Root Directory** to `web-app` (repeat as a second Vercel project with root `landing-page`
   for the marketing site). Framework preset: Vite. Build command `npm run build`, output
   directory `dist` (Vercel usually auto-detects both).
3. Deploy — no environment variables are needed (there's no backend/API key to configure).

The `extension` isn't something you "deploy" to a URL — its deliverable is the GitHub source plus,
optionally, a zip of `extension/dist` (or the whole `extension` folder submitted to the Chrome Web
Store developer dashboard) for reviewers to load unpacked as described above.

## Repo structure

```
EchoGPT-Redesign/
  DESIGN_SPEC.md       shared design tokens, motion, a11y baseline, simulated-AI contract
  SOURCE_ANALYSIS.md    notes on the current live EchoGPT product this redesign evolves from
  package.json           root convenience scripts only (no shared workspace linking — each
                         project below is independently installable/deployable)
  web-app/               redesigned web app (see web-app/README.md)
  landing-page/          marketing site (see landing-page/README.md)
  extension/              Chrome MV3 extension (see extension/README.md)
```

## Known limitations

- Bundle size: `web-app`'s production JS chunk is ~520KB (Vite flags this as a size warning, not an
  error) — it isn't code-split by route. Splitting the AI Tasks/Image Studio/Video Studio routes
  with `React.lazy` would be the first optimization pass if this went further.
- The extension's `content_scripts`/`host_permissions` currently match `http://*/*` and
  `https://*/*` (needed so "summarize this page"/"explain selection" work on any site during
  evaluation); a real Chrome Web Store submission would typically narrow this with
  `activeTab`-only + on-demand `chrome.scripting.executeScript` instead of an always-on
  broad-match content script.
- No automated test suite (unit/e2e) was added — verification was manual (build/type-check plus
  interactive QA in a real browser) given the scope and time budget of this assignment.
