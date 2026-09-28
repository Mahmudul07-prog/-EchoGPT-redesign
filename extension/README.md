# EchoGPT — Multi-AI Chat Sidebar (redesign concept)

A Chrome Manifest V3 extension redesign of **EchoGPT — Multi-AI Chat Sidebar**: a compact
quick-launcher popup plus a fluid-width side panel with multi-model chat, page summarization,
explain-selected-text, history, and settings. This is one of three linked deliverables in the
EchoGPT redesign assignment (see the repo-root `DESIGN_SPEC.md` and `SOURCE_ANALYSIS.md`); this
folder is the standalone, independently loadable extension.

There is no real EchoGPT backend or model API key for this assignment — every reply comes from a
local **simulated AI layer** (see below). Nothing in this extension ever makes a network request.

## Tech stack

- Vite + React 19 + TypeScript
- `@crxjs/vite-plugin` for the Manifest V3 build (manifest, background service worker, content
  script, popup and side panel all built from one Vite config)
- Tailwind CSS v4 (`@tailwindcss/vite`, no `tailwind.config.js` — tokens live in `src/index.css`
  as `@theme` entries) implementing the shared `DESIGN_SPEC.md` color/type/motion system
- `zustand` for state (settings + chat sessions), `framer-motion` for motion,
  `lucide-react` for icons, self-hosted `@fontsource-variable` fonts

## Getting started

Install dependencies once from this folder:

```bash
npm install
```

### Build and load as a real unpacked extension

```bash
npm run build
```

This produces `dist/` (manifest, popup, side panel, background worker, content script, icons).
Then, in Chrome:

1. Go to `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select this project's `extension/dist` folder.
4. Click the EchoGPT toolbar icon to open the popup, or press **Ctrl+Shift+E**
   (**Cmd+Shift+E** on macOS) to toggle the side panel from any tab. Right-click a page or a text
   selection for the "Summarize this page with EchoGPT" / "Explain with EchoGPT" context menu
   items.

Re-run `npm run build` after any source change and click the refresh icon on the extension's card
in `chrome://extensions` to pick it up (Chrome does not hot-reload unpacked extensions).

### Preview in a normal browser tab (fast iteration, no packing/reloading)

```bash
npm run dev
```

Vite serves `popup.html` and `sidepanel.html` as ordinary pages. Every `chrome.*` call is guarded
by `isExtensionEnv` (`src/lib/chrome-shim.ts`), so outside a loaded extension the UI falls back to
an in-memory/localStorage-backed mock of `chrome.storage.local` (`src/lib/storage.ts`) instead of
throwing — the whole popup and side panel are fully clickable and visually inspectable this way.
Anything that genuinely requires a real browser tab/extension host (opening the side panel,
reading the active tab's selection or page text) is simply disabled with an explanatory tooltip
in this mode.

## Project structure

```
src/
  background/index.ts     Service worker: context menus, opens the side panel, writes
                           echogpt_pending_action for the panel to pick up
  content/index.ts        Injected on http/https pages; returns {title,url,text} on request
  components/             Reusable UI: Logo, IconButton, Dialog/ConfirmDialog, Switch,
                           SegmentedControl, ModelPicker, Composer, MessageBubble, MarkdownLite,
                           EmptyState, QuickActionChip, SessionListItem
  lib/
    chrome-shim.ts         isExtensionEnv — real extension vs. dev-preview detection
    storage.ts             chrome.storage.local wrapper w/ localStorage fallback + change events
    mockAi.ts              The entire simulated AI layer (see below)
    pageContext.ts         Fetch page text / selection from the active tab
    id.ts / time.ts / version.ts   small helpers
  store/
    settingsStore.ts       theme / default model / include-page-context (zustand, persisted)
    sessionStore.ts        chat sessions + messages (zustand, persisted)
  types/index.ts           Shared types (Settings, ChatMessage, ChatSession, PendingAction, …)
  popup/App.tsx            Compact quick-launcher popup
  sidepanel/
    App.tsx                Top bar + view switching + pending-action/pending-nav handling
    views/ChatView.tsx      Chat, streaming replies, quick actions
    views/HistoryView.tsx   Search/delete/resume past conversations
    views/SettingsView.tsx  Theme, model, page-context toggle, clear data, about
```

## How the popup and side panel talk to each other

Both read and write the exact same `chrome.storage.local` keys via `src/lib/storage.ts`:

- `echogpt_settings`, `echogpt_sessions`, `echogpt_active_session_id` — shared state.
- `echogpt_pending_action` — `{type:'explain', text}` or `{type:'summarize-page', url}`, written
  by the background script (context menu) or the popup (quick actions), and consumed once by the
  side panel, which clears it after acting on it.
- `echogpt_pending_nav` — `'settings' | 'history' | {view:'session', sessionId}`, written by the
  popup so an about-to-open (or already-open) side panel jumps straight to that view/session.

The side panel reads both on mount and also subscribes to `chrome.storage.onChanged`, so an
action queued while the panel is already open (e.g. a second context-menu click) is picked up
live, not just at first load.

## Simulated AI layer

`src/lib/mockAi.ts` is the whole "AI" in this build: `generateMockReply(prompt, modelId, context)`
classifies the prompt with keyword heuristics (resume/CV → career coaching, "summar…" → a
page-context-aware summary, code-flavored keywords or a fenced code block → a reply with a code
sample, "explain" → a plain-language breakdown of the current selection/page, otherwise a general
reply), picks one of a few hand-written on-brand variants per category at random, reshapes it per
model "personality" (Turbo trims to the first sentence or two, Pro restructures into a lead line
plus bullets, Vision appends a short visual-context remark), and streams it back in small
multi-token chunks with a per-model delay/jitter to simulate token-by-token generation. It never
makes a network call. This is disclosed in the Settings → About section and in the chat empty
state.

## Key assumptions & notable decisions

- **Popup vs. side panel split**: the popup is a fast quick-launcher (open panel, jump to a quick
  action, switch model, jump into a recent chat, open settings) — it is not a second chat surface.
  All actual conversation happens in the side panel, matching the real product's "side panel first"
  model described in `SOURCE_ANALYSIS.md`.
- **`chrome.sidePanel.open()` and user gestures**: every call site that opens the side panel is
  invoked directly from a click handler (the primary popup button chains only
  `chrome.windows.getCurrent()` → `chrome.sidePanel.open()`; the quick actions add at most one more
  already-awaited extension call first, mirroring the pattern the existing verified background
  script already uses for the keyboard-shortcut command) so Chrome's user-gesture requirement is
  preserved.
- **No mic/attach buttons in the composer**: the spec allows them but requires them to be either
  real or clearly marked as demo-only; rather than ship a fake-looking affordance, the composer
  stays to text input + send, keeping the panel "focused and uncluttered" as instructed.
- **Google sign-in**: represented only as a disabled "Sign in with Google" button with an
  explanatory tooltip/caption in Settings → Account — never a real credential form, and the app
  otherwise behaves as an already-usable guest.
- **Confirm dialogs close by unmounting, not by an animated exit**: `Dialog`/`ConfirmDialog` still
  animate in on open, but intentionally don't animate out on close — they simply stop rendering
  the instant `open` becomes `false`. This guarantees "Cancel"/"Clear all"/Escape always actually
  close the dialog instead of depending on an animation-library exit lifecycle completing.
- **Model choice is session-scoped**: switching the model in the side panel's top bar changes the
  *current* conversation's model going forward (and updates the default used for the *next* new
  chat); each stored session remembers which model "answered" each message.
- **Storage writes are throttled during streaming**: only the user message, the initial empty
  assistant placeholder, and the final assistant message are persisted to storage; the
  in-between streamed chunks only update in-memory state, to avoid writing on every token.

## Additional features beyond the minimum spec

- Session search (title + message content) and per-session delete with a confirm dialog in
  History.
- Copy-to-clipboard button on every rendered code block.
- A custom lightweight Markdown renderer (`MarkdownLite`) for the mock AI's bold text, bullet
  lists, blockquotes, and fenced code blocks — including graceful mid-stream rendering of a code
  fence that hasn't closed yet.
- Full keyboard support: Enter to send / Shift+Enter for a newline, arrow-key navigation in the
  model dropdown, focus-trapped dialogs that close on Escape and restore focus to their trigger,
  visible focus rings everywhere, and `aria-label`s on every icon-only button.
- Light/dark/system theme with live OS-theme syncing while set to "system", persisted and shared
  between the popup and the side panel.
- Time-of-day greeting and a live "Ctrl+Shift+E" vs "Cmd+Shift+E" shortcut hint depending on
  platform.
