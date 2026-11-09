# Chrome Web Store test: first screenshot

Prepared 2026-11-09. Nothing has been uploaded. The live listing is unchanged.

## Why

In matched Monday to Saturday windows (26–31 Oct vs 2–7 Nov), store sessions
held (238 → 234) and site install clicks held (148 → 149), but store install
events fell (101 → 74). The fall showed up for direct and blog visitors alike.
The listing never says "Google AI Mode", although the AI Mode guide's button
promises "Search AI Mode history". Going by page order, the current first
screenshot appears to be an uncaptioned popup with March-dated chats, and its
platform filter row does not include AI Mode. Evidence:
`llmnesia-insights/.insights/acquisition-diagnosis-2026-11-09.json`.

## The change (test 1: the screenshot only)

Upload `docs/store-assets/store-screenshot-1.png` (1280×800) as the **first**
screenshot. Keep the other screenshots in their current order after it. Change
nothing else in the same window.

- Headline: "Find any old AI chat in seconds"
- Subline: "ChatGPT, Claude, Gemini, Google AI Mode, Character.AI and more"
- Footer: "Free · Searches on your device · No account needed". These match the
  listing's own claims: the extension is free, search runs locally, and the
  free extension needs no account.
- The UI is the real 0.4.23 popup, rendered from the built extension with the
  video pipeline's `chrome.*` demo stub. All five chats are invented (one search
  for "lisbon" returns one each from Google AI Mode, ChatGPT, Claude, Gemini and
  Character.AI). No real account is shown.

The upload is a Developer Dashboard edit (Store listing → Screenshots). It needs
no package upload and no review of a new extension version.

## Summary line (separate, later)

The store summary ("Local-first search index for your AI chat conversations
across ChatGPT, Claude, Gemini, and more.") comes from the `description` field
in `extension/public/manifest.json`, so changing it means shipping a new
extension version. Put this in the next release's manifest, after the
screenshot read is in. That keeps a release from muddying the read.

> Find old chats from ChatGPT, Claude, Gemini, Google AI Mode, Character.AI and more in one search. Free and private, on your device.

131 characters (limit 132).

A later description edit, also not part of test 1: move "WHAT IT DOES" above
the Vault and desktop AI sections, and name Google AI Mode and Character.AI in
the opening paragraph.

## Measurement

The Chrome Web Store has no A/B testing, so this is a before/after read.

- **Before:** the two most recent complete Monday–Saturday windows before the
  upload.
- **After:** the first two complete Monday–Saturday windows after it, starting
  on the first full day after the upload (GA4 store property calendar).
- **Primary:** store install events ÷ store sessions, reported separately for
  blog `inline_cta`, direct and Google organic. These are aggregate counts,
  not a per-visitor rate.
- **Call it a win** only if the rate rises clearly in at least two of the three
  sources in both after-weeks. Counts are about 230 sessions a week, so anything
  smaller than a large shift is inconclusive.
- **Hold still during the read:** no extension release, no other listing edits
  and no edits to `/blog/google-ai-mode-history`. Note the upload date in the
  insights log so the weekly review lines up the windows.

## Regenerating the image

Sources are in `docs/store-assets/first-screenshot-src/`. Copy the prod build
(`LLMnesia/extension/prod`) to a scratch folder, add `chrome_stub.js` (from
`video/tools/demo_chrome_stub.js` on the video branch) before the module script
in `popup.html`, serve the folder on 127.0.0.1:5311, then:

```bash
CLIP='{"x":0,"y":0,"width":384,"height":340}' node capture.mjs popup.html lisbon ui-popup-crop.png 400 600
node frame.mjs
```

Playwright is loaded from the existing install in `firecrawl-ctf/node_modules`.
