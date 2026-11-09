# Chrome Web Store listing refresh

Prepared 2026-11-09. Nothing has been uploaded. The live listing is unchanged.

## Why

In matched Monday to Saturday windows (26–31 Oct vs 2–7 Nov), store sessions
held (238 → 234) and site install clicks held (148 → 149), but store install
events fell (101 → 74). The fall showed up for direct and blog visitors alike.
The listing never says "Google AI Mode", although the AI Mode guide's button
promises "Search AI Mode history". The current screenshots date from the first
release. Evidence: `llmnesia-insights/.insights/acquisition-diagnosis-2026-11-09.json`.

## What changes

All three parts go live together as one listing refresh.

1. **Screenshots (Developer Dashboard → Store listing).** Replace all five with
   `docs/store-assets/store-screenshot-1-search.png` to `-5-setup.png`, in
   that order. Each is 1280×800.
   1. Find any old AI chat in seconds (search across Google AI Mode, ChatGPT,
      Claude, Gemini, Character.AI)
   2. Bring in the chats you already have (import progress, Google AI Mode)
   3. Private by design
   4. Your desktop AI can use them too (MCP)
   5. Guided first import (the welcome page)
2. **Description (Developer Dashboard).** Paste
   `docs/store-assets/chrome-store-description.txt`. The opening names five
   platforms (ChatGPT, Claude, Gemini, Google AI Mode, Character.AI), moves
   "What it does" to the top,
   puts Vault last, and adds one line that LLMnesia cannot bring back chats
   deleted before installation. All Vault, MCP, privacy and analytics
   disclosures from the current description are kept word for word.
3. **Summary (extension package).** The store summary comes from the manifest
   `description`. It was changed on extension `main` in `a10f4815`:
   "Find old chats from ChatGPT, Claude, Gemini, Google AI Mode, Character.AI
   and more in one search. Free and private, on your device." (131 of 132
   characters). It ships with the next release built from that commit or later.

The store title is unchanged. `package-release.mjs` sets it, and it carries the
listing's search ranking.

## Content rules followed

- Keyword spam (the earlier rejection): Chrome allows at most five named
  supported sites or brands in the description and asks that a keyword appear
  fewer than five times. The description names five platforms once, keeps the
  "More than a dozen AI platforms" wording instead of a list, and uses every
  brand and keyword no more often than the approved live description does
  ("Vault" 6 vs 7 live, "search" 7 vs 9). The full platform list lives in the
  screenshots, which is where Google suggests putting it. Do not paste the
  Edge description's long platform list into Chrome.

- The UI images come from the real build (`extension/prod`, 0.4.23 composition)
  with the video pipeline's `chrome.*` demo stub. All chats and the terminal
  answer are invented. No real account is shown.
- The terminal in image 4 is illustrative, as in the main product video. The
  tool name `search_conversations` is LLMnesia's real MCP tool.
- Every claim is taken from the current listing: free extension, local search,
  no account, encrypted optional Vault, links back to original chats when source
  URLs are available. Google AI Mode and Character.AI import are both released
  (0.4.14+ and 0.2.4+). No prices appear in the images.

## Measurement

The Chrome Web Store has no A/B testing, and releases ship every few days, so
this is a before/after read with releases treated as normal background. The
baseline weeks had releases too.

- **Before:** 26–31 Oct and 2–7 Nov (already measured above).
- **After:** the first two complete Monday–Saturday windows after the
  screenshots and description go live, starting on the first full day after
  publication (GA4 store property calendar). Note the date in the insights log.
- **Primary:** store install events ÷ store sessions, reported separately for
  Google organic, direct and blog `inline_cta`. Google organic is the cleanest
  read: those visitors land on the listing with no site page in between.
  Counts are aggregate, not a per-visitor rate.
- **Call it a win** only if the rate rises clearly in at least two of the three
  sources in both after-weeks. Counts are about 230 sessions a week, so anything
  smaller than a large shift is inconclusive.
- **Things that would spoil the read:** another listing change, or a release
  that adds install-time permissions (a bigger install warning). Ordinary
  releases are fine. Avoid editing `/blog/google-ai-mode-history` in the same
  window.

## First-run note (activation, not installs)

The welcome page offers ChatGPT, Claude, Gemini and Perplexity as one-click
imports. Google AI Mode and Character.AI sit behind "Use a different AI", so a
reader arriving from those guides does not see their platform first.

## Regenerating the images

Sources are in `docs/store-assets/src/`. Copy `LLMnesia/extension/prod` to a
scratch folder, put `chrome_stub.js` (from `video/tools/demo_chrome_stub.js` on
the video branch) before the module script in `popup.html` and
`onboarding.html`, and serve the folder on 127.0.0.1:5311. Then, from `src/`:

```bash
CLIP='{"x":0,"y":0,"width":384,"height":340}' node capture.mjs popup.html lisbon ui-popup-crop.png 400 600
```

```bash
CLIP='{"x":0,"y":76,"width":384,"height":258}' node scrollshot.mjs popup.html ui-import-crop.png 400 600 '{"backfill":{"platform":"google_ai_mode","processed":212,"total":318,"lastTitle":"Best month to visit Lisbon","etaMs":95000}}' "Import chats" 40
```

```bash
CLIP='{"x":209,"y":352,"width":862,"height":496}' node scrollshot.mjs onboarding.html ui-onb-crop.png 1280 1000 '{}'
```

```bash
node make.mjs
```

Playwright is loaded from the existing install in `firecrawl-ctf/node_modules`.
