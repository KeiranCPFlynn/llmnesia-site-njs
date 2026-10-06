# Article install CTA experiment: /blog/google-ai-mode-history

Recorded 2026-10-06 for the handoff `GROWTH_ARTICLE_CTA_EXPERIMENT.md`
(llmnesia-insights). This page documents the experiment definition, the
attribution verification, and the honesty check that motivated the copy
change. Local commit only: deployment requires separate founder approval.

## Background

The 23 September conversion audit (`conversion-audit-2026-09-23.md`) told us
to hold the five September 20 landing variants through the completed window
21 September to 4 October before judging them. The top organic article in the
latest evidence pack (week 28 September to 4 October,
`llmnesia-insights/.insights/evidence-pack.json`) is
`/blog/google-ai-mode-history` with 415 views. The site earned 342,156 Google
impressions that week at a 0.48 percent click rate, and the queries this
article ranks for barely click through ("ai mode history": 2,012 impressions,
5 clicks; "google ai mode history": 585 impressions, 1 click).

## Attribution verification (handoff task 2)

One GA4 Data API read, 28 September to 4 October 2026, production hosts only
(`www.llmnesia.com`, `llmnesia.com`), `install_click` events split by
`pagePath`:

| pagePath | install_click events |
|---|---:|
| /blog/google-ai-mode-history | 56 |
| / | 53 |
| /mcp | 12 |
| /blog/search-character-ai-conversation-history | 9 |
| /blog/how-to-find-old-character-ai-conversations | 6 |
| all remaining paths | 24 or fewer each |

Per-page `install_click` attribution works today. The delegated handler in
`app/components/site-behavior.js` fires `install_click` for every store link,
and `lib/analytics.js` enriches every event with `page_path`; GA4's built-in
`pagePath` dimension splits the event without any new instrumentation. The
article-CTA event `cta_install_click` additionally carries `family`,
`position` (intro/foot), `platform`, `slug`, and `store`, so per-page and
per-placement analysis stays available.

Important correction to the handoff premise: the article is not missing a
CTA. It has carried an install CTA (intro placement after the first
paragraph, bottom placement before the footer, one shared component) since
the September 20 deployment of commit `8f961c4`, and that CTA already
converts: 56 install clicks on 415 views in the completed week (about 13.5
events per 100 views). The experiment below is therefore a copy change on
that one existing CTA unit, not the addition of a second one.

## Honesty check (handoff premise)

The live Chrome Web Store version is 0.4.11 (confirmed by the owner on
2026-10-04, per `GOOGLE_AI_MODE_RELEASE_SCOPE_2026-10-04.md` in the extension
repository). Google AI Mode full-page conversation capture has been live
since 0.4.5. The Google AI Mode history importer lives only in the 0.4.13
local candidate ("in_review... no store submission performed", per
`GOOGLE_AI_MODE_PAGING_2026-10-05.md`), so it must not be promised.

The control copy failed that check for this article's reader:

- Control headline: "Search Google AI Mode alongside ChatGPT, Claude, Gemini
  and more. LLMnesia indexes supported conversations locally so one search
  finds the earlier thinking."
- Control button: "Search AI Mode history, free"

A reader who arrived asking how to find their past AI Mode history reads
"Search AI Mode history" as a promise that installing unlocks a searchable
index of existing chats. The live store build cannot do that; it captures
AI Mode conversations from installation onward.

## Variant (the change)

One CTA unit, same component (`InlineInstallCta`), same placements, same
central tracking. Only the article's frontmatter copy changed
(`content/blog/google-ai-mode-history.mdx`):

- Variant headline: "Keep a searchable copy of the AI Mode conversations you
  have from now on. LLMnesia saves and indexes your Google AI Mode chats
  locally, alongside ChatGPT, Claude, Gemini and more."
- Variant button: "Save AI Mode chats, free"

The copy leads with the live capability (forward capture, local index,
cross-platform search), states the "from now on" scope, and makes no
unreleased-feature claim.

## Experiment definition

- Page: `/blog/google-ai-mode-history` (no other page changes).
- Variant: honest copy on the existing single CTA unit (intro and bottom
  placements unchanged in position and tracking).
- Control: the copy live since 20 September 2026, quoted above.
- Metric: per-page install_click rate, reported as organic landing sessions
  containing `install_click` divided by organic landing sessions on the page
  (the audit's definition), with `install_click` events per page view as the
  coarse weekly signal and `cta_install_click` by `position` for placement
  analysis. GA4 only for the rate; PostHog counts are never mixed in.
- Baseline: 56 install_click events on 415 views (28 September to 4 October
  2026, about 13.5 events per 100 views); session-grain baseline figures
  come from the weekly review's landing-session cohort read.
- Observation window: one completed week minimum, counted from the first
  full day after the change deploys to production, in the GA4 property's
  Asia/Bangkok dates, following the audit's completeness rules (confirm
  source freshness rather than assuming it).
- Success threshold for rolling the treatment to other articles: the
  completed week's session-grain rate is not materially below the control
  rate, judged with numerators, denominators, and binomial uncertainty as
  the audit requires, and subject to the audit's sparse-data gate (at least
  100 eligible sessions and 10 converted sessions; otherwise extend to a
  second week rather than deciding on a thin cell). Because the change
  removes an over-claim, holding the conversion rate within noise is a
  success; a material drop triggers copy iteration, not a revert to the
  over-claim. Roll-out applies only to articles whose current copy makes the
  same kind of unreleased-capability promise.

## Boundaries respected

No other page, the pricing page, or the purchase flow was touched. Nothing
was pushed or deployed; deployment is a separate founder-approved step.
