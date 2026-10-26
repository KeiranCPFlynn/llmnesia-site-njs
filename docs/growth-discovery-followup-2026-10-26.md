# Gemini discovery and Bing snippet follow-up, 26 October 2026

Status: prepared locally. Production publication has not been authorized in this task. The intervention starts when these changes are published, not when they are committed. No new recurring job or paid experiment is needed.

## Purpose and changes

- `search-gemini-conversation-history`: address the observed finding/viewing-history queries with explicit computer and phone instructions, a missing-history route, and a comparison of native search, browser find and a saved local archive. Keep capture/import and keyword-index readiness explicit. The extension is not presented as a phone app.
- `gemini-conversation-history-limits`: answer the retention question immediately, compare the personal-account settings, and explain how to inspect them. Distinguish temporary chats, managed accounts, server retention, available history and context windows.
- `does-chatgpt-keep-deleted-conversations`: align the snippet with the retention question, and explain that the 30-day deletion rule is not an automatic expiry date for all old chats. No recovery promise.
- `how-to-find-old-character-ai-conversations`: distinguish looking for a past chat from navigating to the old Character.AI website. Only the title and description change. The article's 22 October factual update date is retained.

Sources checked on 26 October: Google chat-management help (computer, Android and iPhone), activity controls and Privacy Hub; OpenAI chat and file retention help. Existing Character.AI service-status and importer content is unchanged. URLs, canonical paths and CTA instrumentation are preserved.

## Baseline

Read-only evidence in the Insights repo: `.insights/citation-audits/2026-10-26-diagnosis.json` and `2026-10-26-growth-outcomes.json`.

Matched Google Search Console weekdays, 12–16 versus 19–23 October:

| Page | Impressions, previous → current | Clicks | Average position |
| --- | ---: | ---: | ---: |
| Search Gemini history | 4,029 → 1,514 | 12 → 0 | 7.32 → 8.92 |
| Gemini history limits | 3,353 → 1,489 | 12 → 2 | 5.39 → 6.08 |

Bing's weekly page buckets dated 16 and 23 October (a different period from the matched weekday site totals): deleted-ChatGPT retention, 17 → 7 clicks at reported position 5 in both buckets; finding old Character.AI chats, 10 → 3 clicks at position 6 → 5. Page/query breakdowns are subsets, not site totals.

## Preserve experiment history

`experiment-snippet-ctr-2026-10.md` records an earlier set of snippets. The two Bing pages above already use those variants publicly as of 26 October. Their exact first deployment date has not been established here. Do not erase that experiment or present a later result as a clean test of its original variants.

On publication, record the actual date and commit for this follow-up. Split the two affected pages' before/after series at that date. The Gemini guides and ChatGPT retention page have body changes as well as metadata changes, so any movement measures the combined intervention, not title-only uplift. Leave the other original experiment pages and controls unchanged. Character.AI's predominantly navigational legacy-site queries should be reported separately from past-chat retrieval queries.

## Readout and decision

At the next existing weekly audit after publication, confirm discovery and data availability; treat it as an early read. Use four completed weeks after publication for a directional decision, compared with four preceding completed weeks. Report Google and Bing separately, with matched weekdays and source-specific freshness. Compare impressions, clicks, CTR, position and query mix. Search engines can rewrite titles and snippets; the published metadata is not proof of what a searcher saw.

The primary business outcome is successful first search among mature new external installs, alongside store install volume and later search return. Website install-button events are an intermediate measure. There is no person-level join from these pages or assistant sources to the extension, so do not attribute an activation improvement to these edits. Record both counts and denominators, and avoid rates for small cells.

If visibility recovers but install-button engagement falls, inspect the page's product handoff. If impressions recover but CTR remains weak at comparable positions and query mix, reconsider the snippet. If page discovery remains weak, inspect the queries and competing results before expanding content broadly. Keep local-search, import and deleted-history claims accurate throughout.

## Validation

The production build, static-content export, homepage/core localization checks, Gemini guide checks and seven Character.AI rendered-content checks passed. Public-facing changed files contain no em dashes. Browser visual review could not run because local browser use is disabled in Work settings; no access restriction was bypassed.
