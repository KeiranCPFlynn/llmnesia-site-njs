# Cannibalization Audit & Pillar Map (June 2026)

Snapshot: 179 blog posts. Intent split: 151 informational, 24 how-to, 4 commercial.
Method: pairwise primaryKeyword Jaccard, filtered to same-platform (or both platform-agnostic) pairs. 120 overlapping pairs surfaced; the large majority are the intended cluster pattern. This doc isolates the genuinely harmful overlaps and gives a fix per case, plus the pillar internal-linking map.

## How to read this

- **Cluster pattern (not harmful):** posts that share keyword tokens but target distinct long-tail queries (e.g. `how-to-export-claude-*` vs `claude-conversation-history-limits`). These are fine **as long as** each links up to its pillar. No action beyond linking.
- **True cannibalization (act):** two posts competing for the *same* search intent. Splits link equity and confuses Google on which to rank. Fix by consolidating (merge + 301) or differentiating sharply (distinct title/H1/intent + cross-link).

---

## IMPLEMENTATION LOG (June 2026)

Done in this pass:
- **Pillar map (Section E) wired:** added the pillar slug to `relatedSlugs` on 45 spoke posts (16 already linked). All 61 spoke->pillar links now in place. Build green, all relatedSlugs resolve.
- **`deepseek-grok-mistral-chat-history` repositioned** as a hub (not retired): `primaryKeyword` changed from "deepseek chat history" (competed with `search-deepseek-conversation-history`) to "emerging ai tools chat history"; competing secondary keywords replaced with multi-platform terms; `relatedSlugs` repointed to the dedicated per-platform search posts + the best-ai pillar so it links out as a hub.

Deliberately NOT done (course-correction after reading the files):
- **No deletions.** On inspection, the two flagged "duplicates" are differentiated, substantial posts, not throwaways. `ai-chat-history-backup-strategy` (3-2-1 strategy framing, ~1,200 words) is distinct from `how-to-backup-ai-conversations` (practical how-to) and already cross-links; both kept. Mechanically deleting either would have destroyed good content.
- **find-old/search differentiation (Section B)** and **ChatGPT pile-up re-scoping (Section C)** deferred: these should be governed by GSC data (only act where two URLs actually compete for the same query). Don't redirect/rewrite indexed pages on a hunch.

---

## A. Consolidate (true duplicates — merge + 301 redirect) [SUPERSEDED — see log above]

On review, treat these as differentiate-and-keep, not delete:

These target the same query with no meaningful distinction. Pick the stronger URL as canonical, merge any unique content into it, delete the other, add a 301.

| Keep (canonical) | Merge & redirect | Why |
|---|---|---|
| `how-to-backup-ai-conversations` | `ai-chat-history-backup-strategy` | Jaccard 1.00, identical intent ("back up AI conversations") |
| Retire/repurpose → see note | `deepseek-grok-mistral-chat-history` | Legacy 3-platform mashup that now cannibalizes the dedicated deepseek/grok/mistral search, export, organize, limits, and is-deepseek-safe posts (overlaps 6+ pages) |

Note on `deepseek-grok-mistral-chat-history`: either retire it (301 to `best-ai-for-conversation-history`) or repurpose it into a genuine 3-way comparison that links *out* to the per-platform posts rather than competing with them.

## B. The "find-old vs search" systemic overlap (differentiate, every platform)

`how-to-find-old-{platform}-conversations` and `search-{platform}-conversation-history` scored **1.00** (grok, character, copilot) and 0.50+ elsewhere. They chase the same intent: "locate a past chat." This pattern repeats across ~8 platforms, so mass-redirecting is risky. Differentiate instead:

- **`search-{platform}-conversation-history`** = the canonical "how to search your {platform} history" page (the method + the tool). Make this the pillar for the platform.
- **`how-to-find-old-{platform}-conversations`** = scope tightly to "I'm trying to recover one specific old chat" (browsing, scrolling, account/date tactics), and link up to the search page.
- Give each a distinct title tag and opening paragraph so the SERP snippet and H1 don't read as duplicates, and cross-link them.

If GSC shows both URLs competing for the same query on the same platform (impressions on both, clicks on neither), collapse that pair to the canonical search page.

## C. The ChatGPT "can't find my chat" pile-up (re-scope around one pillar)

Five posts crowd the same problem space:

- `find-old-chatgpt-conversations`
- `search-chatgpt-conversation-history`
- `chatgpt-conversation-disappeared`
- `why-is-chatgpt-not-saving-conversations`
- `chatgpt-history-not-loading-fix`

They are *differentiable* but currently blur. Lock each to one distinct problem and point them all at one pillar:

| Post | Locked scope |
|---|---|
| `search-chatgpt-conversation-history` | **Pillar.** How to search your ChatGPT history (method + tool). |
| `find-old-chatgpt-conversations` | Locating one specific older chat you know exists. |
| `chatgpt-conversation-disappeared` | A chat that *was there and vanished* (account/archive/deleted). |
| `why-is-chatgpt-not-saving-conversations` | *New* chats not being saved (Temporary Chat / history-off / settings). |
| `chatgpt-history-not-loading-fix` | The sidebar/list failing to load (glitch/cache/outage). |

Action: tighten each opening paragraph + title to its lane, and have the four spokes link to the search pillar. (`why-is-chatgpt-not-saving` and `how-to-use-chatgpt-without-saving-history` also overlap at 0.40 — make one the "it's broken" framing and the other the "do this on purpose" framing, and cross-link.)

## D. Keep, but cross-link (hub/spoke, not cannibalization)

These look overlapping in the data but target distinct intents. No consolidation; just ensure the spoke links to the hub.

- `what-is-a-prompt-library` (definition) → `searchable-ai-prompt-library` (product/how-to).
- `what-is-local-first-software` (definition) → `local-first-ai-tools-privacy` (application).
- `ai-chat-history-for-researchers` vs `ai-chat-history-for-ux-researchers` — distinct audiences; keep.
- `recover-deleted-chatgpt-conversation` vs `recover-deleted-chatgpt-project` — distinct features; keep.
- All `{X}-vs-{Y}-conversation-history` head-to-heads — each targets a unique pair query; keep, link to pillar.
- All `{feature}-vs-conversation-history` (memory/projects/artifacts/spaces) — distinct feature queries; keep.

---

## E. Pillar internal-linking map

Designate one pillar per intent cluster. Every spoke sets `relatedSlugs` to include its pillar; the pillar links down to its top spokes. This concentrates authority on the page you actually want to rank for the head term.

| Pillar (rank target) | Head term | Spokes link up to it |
|---|---|---|
| `how-to-stop-ai-from-training-on-your-data` | "stop AI training on your data" | does-{chatgpt,claude,gemini,grok}-train, is-deepseek-safe, can-my-employer-see-my-chatgpt-conversations, how-to-use-chatgpt-without-saving-history, are-ai-conversations-private, ai-conversation-privacy-explained, local-first-ai-tools-privacy |
| `best-ai-for-conversation-history` | "best AI for conversation history" | all `{X}-vs-{Y}-conversation-history` head-to-heads |
| `how-to-search-multiple-ai-chatbots-at-once` | "search all AI chats" | per-platform `search-{platform}-conversation-history`, why-cant-i-find-my-old-ai-conversations |
| `ai-conversation-history-limits-compared` | "AI conversation history limits" | per-platform `{platform}-conversation-history-limits` |
| `how-to-backup-ai-conversations` | "back up AI conversations" | per-platform `how-to-export-{platform}-conversation-history` |
| `ai-chat-retrieval-explained` | "AI chat retrieval" | why-ai-chatbots-dont-remember, ai-second-brain-chat-history, ai-knowledge-base-vs-chat-history |
| `what-is-a-prompt-library` | "what is a prompt library" | searchable-ai-prompt-library |

Two of these pillars (`how-to-stop-ai-from-training-on-your-data`, `best-ai-for-conversation-history`) were built as roundups already; they just need the spokes pointing in.

---

## F. Priority order

1. **Consolidate Section A** (2 merges) — quick, removes the only outright duplicates.
2. **Wire the pillar map (Section E)** via `relatedSlugs` — highest ratio of ranking benefit to effort; concentrates authority.
3. **Re-scope the ChatGPT pile-up (Section C)** — tighten 5 intros/titles.
4. **Differentiate find-old/search (Section B)** — only mass-act if GSC confirms both URLs compete.
5. Leave Section D alone.

Governed by GSC: before consolidating anything beyond Section A, confirm in Search Console that the pages are actually indexed and that the pair competes for the same query. Do not redirect indexed pages on a hunch.
