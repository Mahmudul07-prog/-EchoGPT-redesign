# Source Analysis — current EchoGPT product (as of 2026-09-28)

Notes taken by browsing https://echogpt.live/ and reading the Chrome Web Store listing for
"EchoGPT - Multi-AI Chat Sidebar". Used as the baseline the redesign should evolve from.

## Web app (echogpt.live)

Layout: classic three-zone chat app (like ChatGPT/Poe/ChatHub).

- **Left sidebar** (light violet-tinted background, white main canvas):
  - Logo + wordmark "EchoGPT" at top.
  - Big pill "New Chat" button (solid violet).
  - Nav group "ENGAGEMENT": Image Studio (PRO badge), Video Studio (PRO badge), Compare,
    Connectors, History, Store, AI Tasks, AI Job Analysis, AI SOP Builder.
  - Nav group "HELP & SUPPORT": Support, Subscriptions, API Platform, Discord, Website, Share,
    Settings.
  - Bottom utility row: home icon, some icon, gear icon, light/dark toggle icon.
- **Main panel (empty/greeting state)**:
  - "Hello There! 👋 How can I assist you today?" headline + subhead
    "Your personal AI assistant is ready to help—ask me anything, anytime."
  - 2x2 grid of suggestion cards with a bold title + muted description, e.g. "Unlock Your
    Creative Flow", "Build a Resume That Shines", "Set a Challenge That Transforms You",
    "Write Irresistible Social Content".
  - Below that, a chat composer "card": model switcher chip ("EchoGPT" with chevron),
    small connector/rocket icons, then a pill input "Ask a question…" with a mic icon and a
    circular violet send button.
- **Top right**: "Sign In" pill button (violet) when logged out.
- History view: "My Chat History" — "Access your complete chat history across diverse topics
  and interactions with different models or characters." with an "All" filter and a grid/list
  of past chat cards.
- Overall palette: white/very light violet background, violet-600-ish primary, rounded pill
  buttons and rounded cards, generous whitespace, friendly sans-serif type.

## Chrome extension ("EchoGPT - Multi-AI Chat Sidebar", Manifest V3)

- Not a small popup — it opens as a **Chrome Side Panel** (persists while browsing).
- Multi-model support: switch between AI assistants / compare responses.
- Webpage tools: summarize the current article/page; explain selected text, optionally
  including page context.
- Google sign-in + token/session auth; API endpoint configurable; toggle "include page
  context" on/off.
- Keyboard shortcut: Ctrl+Shift+E / Cmd+Shift+E to toggle the panel.
- Dark mode supported. ~76KB installed size, v1.0.5.
- Installed from the toolbar icon; a small action click is the entry point even though the
  main surface is the side panel.

## What the redesign keeps vs. changes

Keep: the name, the violet/indigo brand color family, the same sidebar navigation vocabulary
(New Chat, Image/Video Studio, Compare, Connectors, History, Store, AI Tasks, AI Job Analysis,
AI SOP Builder, Support, Subscriptions, API Platform, Settings), the side-panel-first extension
model, the keyboard shortcut.

Change/improve: visual polish (softer gradients, better contrast, refined type scale), full
responsive behavior (today's app is desktop-only feeling), accessibility (focus states, aria
labels, keyboard nav), dark mode done properly with a real token system, motion/micro-interactions,
a real empty/loading/error state story, and — since there is no live backend/API key available
for this assignment — a believable simulated AI layer (streaming mock responses, per
`DESIGN_SPEC.md`) so every flow is fully clickable end to end.
