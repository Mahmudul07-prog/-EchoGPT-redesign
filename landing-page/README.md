# EchoGPT — Landing Page

A single-page marketing site for **EchoGPT**, a multi-AI chat productivity app (web app +
companion Chrome side-panel extension). This is one of three parallel deliverables in the
EchoGPT redesign assignment — see `../DESIGN_SPEC.md` (visual language, tokens, motion,
accessibility baseline) and `../SOURCE_ANALYSIS.md` (the real product's current feature set and
navigation vocabulary) for the shared source of truth this page builds on.

## Setup

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # type-check (tsc -b) + production build to dist/
npm run preview   # preview the production build locally
npm run lint      # oxlint
```

No environment variables, backend, or API keys are required — this is a fully static page with
no real network calls for "AI" functionality (there is no chat backend to call from a landing
page in the first place; the two other deliverables — `web-app` and `extension` — implement the
simulated AI layer described in `DESIGN_SPEC.md`).

## Tech stack

- **Vite 8 + React 19 + TypeScript** (strict), scaffolded before this work began.
- **Tailwind CSS v4** via `@tailwindcss/vite` — no `tailwind.config.js`; every color/font/radius
  token from `DESIGN_SPEC.md` is declared in the `@theme` block in `src/index.css`.
- **Framer Motion** for scroll-triggered entrance animations (fade + translateY, staggered
  children) and micro-interactions, respecting `prefers-reduced-motion` via `useReducedMotion()`.
- **lucide-react** exclusively for icons.
- Self-hosted variable fonts (`@fontsource-variable/inter`, `@fontsource-variable/plus-jakarta-sans`)
  — no remote font/script CDNs.
- No router: this is a true single page, navigated via `#id` anchor links with native smooth
  scrolling and a scroll-margin offset so content clears the sticky nav.

## Structure

```
src/
  components/
    Nav.tsx            sticky nav, scrollspy, mobile drawer (focus-trapped, Escape to close)
    Hero.tsx            headline + dual CTA + fake-browser hero mockup
    Features.tsx         6-card feature grid
    Models.tsx            "AI Models" chip grid (EchoGPT Turbo/Pro/Vision/Code — invented names,
                          no third-party logos/trademarks)
    Screenshots.tsx        Chat / Compare / Image Studio tab switcher over the mockups
    WhyChoose.tsx          differentiator stat callouts (explicitly labeled illustrative)
    Pricing.tsx             Free / Pro / Team tiers, monthly-yearly billing toggle
    Faq.tsx                  accessible accordion (8 Q&As)
    Testimonials.tsx          4 fictional-persona quote cards (initials avatars, no photos)
    CtaBanner.tsx              closing CTA band
    Footer.tsx                  link columns, social icons, newsletter form (client-side only)
    Buttons.tsx                shared Primary/Secondary/"Add to Chrome"/"Try the Web App" buttons
    Logo.tsx                    inline brand mark (matches public/favicon.svg)
    ThemeToggle.tsx              light/dark toggle
    SectionHeading.tsx            shared eyebrow + title + subtitle block
    AnimatedSection.tsx            scroll-triggered stagger/fade wrapper used by every section
    mockups/                       plain-HTML/CSS "fake browser window" building blocks
      BrowserFrame.tsx              traffic-light + address-bar chrome
      SidebarStrip.tsx                icon-only nav strip echoing the real app's left nav
      ChatMockup.tsx / CompareMockup.tsx / ImageStudioMockup.tsx
  lib/
    theme.ts             light/dark/system theme hook, persisted to localStorage
                          (`echogpt-theme`), synced to `<html class="dark">`
    toast-context.tsx      lightweight toast provider (no external library) used for the
                          "Add to Chrome" / "Coming soon" / newsletter-success messages
    navigation.ts           nav link + section id source of truth
    useActiveSection.ts       IntersectionObserver-based scrollspy hook
```

## Key assumptions

- **No real backend, store listing, or checkout exists for this assignment.** Every CTA that
  would normally leave the page ("Add to Chrome", "Try the Web App", pricing "Start Pro trial" /
  "Talk to sales") instead shows a toast that says so explicitly, rather than linking to a fake
  external URL or silently doing nothing.
- **No real third-party logos or trademarks.** The "AI Models" section uses invented,
  EchoGPT-branded model names (Turbo / Pro / Vision / Code) with abstract lucide icon marks, and
  says so in a caption. Marketing copy refers to "multiple AI models" generically rather than
  naming real competing products. The installed `lucide-react` version in this project also has
  no brand/logo icons at all (e.g. no `Github`/`Chrome`/`Twitter` icons), which conveniently
  reinforces this: social links and the "Add to Chrome" CTA use generic, meaning-appropriate
  icons (`Code2`, `Puzzle`, `AtSign`, etc.) instead.
- **Testimonials are clearly fictional.** First name + last initial, initials-only avatars (no
  photos), and a caption stating these are illustrative personas for the demo.
- **"Why choose EchoGPT" stats are labeled illustrative**, not measured/audited claims, per an
  explicit footnote.
- The feature set marketed (multi-model chat, Compare mode, page summarization, explain-selected-
  text, Image/Video Studio, Connectors/AI Tasks/SOP automation) is drawn directly from
  `SOURCE_ANALYSIS.md` so the page describes the real product's actual navigation vocabulary
  rather than invented functionality.

## Notable additional touches

- **FOUC-free theme boot**: a tiny inline script in `index.html` applies the persisted/system
  theme class to `<html>` before React hydrates, so there's no light-mode flash on a dark-mode
  reload.
- **Scrollspy nav**: the active section is highlighted in the nav as you scroll
  (`useActiveSection`, IntersectionObserver-based), on top of the required anchor-scroll
  navigation.
- **Accessible mobile drawer**: traps focus with Tab/Shift+Tab cycling, restores focus to the
  menu button on close, closes on `Escape` and on overlay click, and locks body scroll while open.
- **Simulated "typing" caret** in the hero chat mockup (a CSS blink, respecting
  `prefers-reduced-motion`) to make the static preview feel alive without any real streaming.
- **Accessible tab switcher** for the Screenshots section (`role="tablist"/"tab"/"tabpanel"`)
  and FAQ accordion (`aria-expanded`/`aria-controls`, single-open accordion).
- **Pricing billing toggle** is a real `role="switch"` control (not just two buttons), and prices
  recompute live between monthly/yearly.
- **Newsletter form** does real client-side email validation (regex + `aria-invalid`/inline error)
  before showing the success toast — it never pretends to submit anywhere.
- Every icon-only control has an `aria-label`; every section is a labelled landmark
  (`nav`/`main`/`footer` plus `aria-labelledby` on each `<section>`), and focus rings follow the
  `DESIGN_SPEC.md` baseline (`focus-visible:ring-2 ring-brand-500`).

## Known limitations

- This page was verified with `npm run build` (zero TypeScript errors) and extensive DOM/ARIA and
  interaction testing (theme persistence, accordion, billing toggle, tab switcher, form
  validation, responsive breakpoints, focus trap). During development, a real bug was found and
  fixed in the Screenshots tab switcher: it originally used Framer Motion's
  `AnimatePresence mode="wait"` to cross-fade between tabs, which could get stuck mid-transition
  under React 19 and never reveal the newly selected tab's content. It was replaced with a
  simpler keyed `motion.div` (fade-in on mount only, no exit-animation dependency) so tab content
  always switches correctly regardless of animation timing.
