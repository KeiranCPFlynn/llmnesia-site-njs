# Search snippet CTR experiment, October 2026

Recorded 2026-10-20 for the handoff `SITE_SEARCH_SNIPPET_CTR.md`
(llmnesia-insights). Local commit only: the founder deploys.

## Question

The top blog pages rank well but win almost no clicks. Titles and meta
descriptions are the one lever we control. Does a snippet that leads with the
direct answer lift Google click-through, compared with matched pages left
unchanged?

## Baseline (Google Search Console, 21 Sep to 18 Oct 2026)

Source: `gsc_rows` in the insights database, apex and www URLs merged.

| Page (`/blog/…`) | Impr. | Clicks | CTR | Pos. | Group |
| --- | ---: | ---: | ---: | ---: | --- |
| recover-deleted-chatgpt-conversation | 40,413 | 128 | 0.3% | 3.5 | **Changed** (pair A) |
| recover-deleted-claude-conversation | 11,016 | 40 | 0.4% | 3.0 | Control (pair A) |
| does-chatgpt-keep-deleted-conversations | 8,926 | 40 | 0.4% | 6.6 | **Changed** (pair B) |
| chatgpt-conversation-disappeared | 5,951 | 54 | 0.9% | 5.1 | Control (pair B) |
| how-to-find-old-character-ai-conversations | 32,380 | 116 | 0.4% | 5.7 | **Changed** (pair C) |
| google-ai-mode-history | 58,654 | 214 | 0.4% | 6.6 | Control (pair C) |
| how-to-find-an-old-claude-code-conversation | 5,828 | 3 | 0.1% | 8.1 | Control (unpaired) |
| recover-deleted-gemini-conversation | 5,690 | 12 | 0.2% | 7.8 | **Excluded** |

Weekly CTR over the four baseline weeks was steady for each page (for example
recover-deleted-chatgpt 0.28 to 0.35%, does-chatgpt-keep 0.30 to 0.54%), so
four weeks is a usable baseline.

## Eligibility

`git log -L` on each file's title and description lines:

- **recover-deleted-gemini-conversation: excluded.** Its description was
  rewritten in `5537717` on 13 Oct 2026, inside the baseline window (it is on
  `origin/main`). Re-test it after a clean four weeks.
- google-ai-mode-history and how-to-find-old-character-ai-conversations had
  their last snippet change in `8f961c4` on 20 Sep 2026, one day before the
  window, so they stay eligible. Google can take days to show a new snippet, so
  the first baseline week may carry a little of that change. It is small
  against four weeks of data and does not favour either group.
- The other five pages last changed their snippet on 11 Sep or earlier.

## Split and matching

Seven eligible pages, so three matched pairs plus one unpaired page. Pairs
share intent and a similar position and query mix. In each pair the page with
more impressions was changed, except pair C:

- **A.** recover-deleted-chatgpt (changed) vs recover-deleted-claude
  (control). Same "recover deleted chats" problem queries, position 3 to 3.5.
- **B.** does-chatgpt-keep (changed) vs chatgpt-conversation-disappeared
  (control). Both ChatGPT, problem queries, mid-page-one.
- **C.** how-to-find-old-character-ai (changed) vs google-ai-mode-history
  (control). Both are big, and both rank for a head query that may be partly
  navigational ("old character ai", "ai mode history").
  google-ai-mode-history is the control on purpose: it runs the install-CTA
  experiment (`experiment-google-ai-mode-history-install-cta.md`), and a
  snippet change there would shift the traffic that experiment measures.
- **Unpaired.** how-to-find-an-old-claude-code-conversation stays as an extra
  control. It is the smallest page (about 1,400 impressions a week) and has no
  natural partner among the eligible pages. Change it in a second wave once this read is in.

That is 3 changed and 4 held, not 3.5 and 3.5. The larger control is the
conservative side.

## Query review

Top queries, 21 Sep to 18 Oct (impressions, clicks):

- **recover-deleted-chatgpt:** "chatgpt deleted chats" (795, 3), "can you
  recover deleted chatgpt chats" (522, 1), "how to see deleted chats on
  chatgpt" (445, 2), "where is trash in chatgpt" (344, 2). Problem queries,
  none navigational.
- **does-chatgpt-keep:** "does chatgpt delete old chats" (354, 0), "if i delete
  a chat from chatgpt is it gone forever" (307, 0), "does chatgpt delete chats
  after 30 days" (147, 3). Problem queries, none navigational.
- **how-to-find-old-character-ai:** "old character ai" (24,684, 64), "old.character
  ai" and similar variants (about 4,000 together), "character ai old chat" (230, 0).
  **Mostly navigational**: about three quarters of impressions come from
  "old character ai" alone, people who most likely want the old Character.AI
  site. A snippet cannot fix that, so expect little lift
  here. It is still the only pair C page with problem queries to test.
- **recover-deleted-claude (control):** "claude deleted chats" (672, 2),
  "claude recover deleted chat" (321, 1). Problem queries.
- **chatgpt-conversation-disappeared (control):** "chatgpt chat disappeared"
  (164, 2), "chatgpt chats disappeared" (98, 5). Problem queries.
- **google-ai-mode-history (control):** "ai mode history" (8,389, 19), "google
  ai history" (2,780, 29). Head terms, partly navigational.
- **how-to-find-an-old-claude-code-conversation (control):** "claude list
  previous sessions" (231, 0), "claude previous session" (137, 0). Searchers
  want the CLI command (`claude --resume`), which the title does not answer.

## Snippets

The rendered `<title>` adds ` | LLMnesia` (the layout template), so titles are
written to fit about 60 characters including the suffix.

### recover-deleted-chatgpt-conversation

- Old title: ChatGPT Recently Deleted Chats: What You Can Still Check
- New title: Deleted ChatGPT Chats: No Undo, But Check These (58 with suffix)
- Old description: ChatGPT recently deleted chats cannot be recovered. Check
  Archived Chats and missing-history fixes first, then protect future
  conversations.
- New description: ChatGPT has no Recently Deleted folder, so deleted chats
  can't be restored. Archived or missing chats often can. Run these checks
  first. (136)

### does-chatgpt-keep-deleted-conversations

- Old title: Does ChatGPT Keep Deleted Conversations? 2026 Retention Rules
- New title: Are Deleted ChatGPT Chats Gone? The 30-Day Rule (58 with suffix)
- Old description: Yes, briefly: deleted ChatGPT chats are normally scheduled
  for permanent deletion within 30 days. See the exceptions and why that does
  not mean recovery.
- New description: Deleted ChatGPT chats leave your account at once and are
  normally purged from OpenAI's systems within about 30 days. Legal holds can
  extend that. (145)

### how-to-find-old-character-ai-conversations

- Old title: How to Find Old Character.AI Chats and History (2026)
- New title: Old Character.AI Chats: How to Find Them (2026) (58 with suffix)
- Old description: Find old Character.AI chats by character, browser history,
  export, or full-text search. See what works when a past conversation seems
  missing.
- New description: Character.AI stores chats per character, with no global
  search. Open the character, check your data export, or search saved chats
  locally. (138)

Every claim matches the article body. None implies LLMnesia can recover chats
it never captured. The Character.AI description says "saved chats" and does not
promise full history, in line with the one-chat-per-character backfill scope.

## Dates and read

- **Prepared:** 2026-10-20 (local commit; nothing is live).
- **Change date:** the day the founder deploys. The test clock starts then,
  not at the commit.
- **Read date:** four weeks after deployment. If deployed on 2026-10-21, read
  on 2026-11-18, covering 2026-10-22 to 2026-11-18 (GSC dates) against the
  baseline above.
- **Read method:** compare each changed page's CTR with its paired control's
  CTR over the same four weeks, then pool the three pairs. Judge a lift by
  how many percentage points the changed page's CTR moves relative to its
  control, not by absolute CTR. Keep position in view: a change that also
  moves average position by more than about 1 is not a clean snippet read.
  Pair C starts from mostly navigational demand, so judge it on its own and
  do not let it drag the pooled result.
- **Success:** a changed page's CTR rises by at least 25% relative to its
  control's change (for example 0.3% to 0.4%), repeated on at least two of the
  three pairs. The sample is small, so treat anything weaker as inconclusive,
  not as a loss.

## Boundaries respected

Only `title` and `description` were edited. `updatedDate` was not bumped
because no article content changed. CTAs, URLs and body text are untouched, and
no dependencies were installed. Nothing was pushed or deployed.
