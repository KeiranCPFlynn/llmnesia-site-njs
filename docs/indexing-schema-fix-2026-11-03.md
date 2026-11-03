# Indexing and schema improvements, 3 November 2026

Prepared locally from production source `8e756bf0984976f56423a82a13e82b57e157295f` on `codex/indexing-schema`. The primary site checkout contains separate unpublished Pro pricing work, so this change is isolated from it.

## Changes

- Blog posts no longer emit a promotional SoftwareApplication node. Their Article, Breadcrumb, FAQ and applicable HowTo markup remains. Factual software markup on product pages is unchanged.
- The Writers landing page now walks through finding a saved draft, recovering its prompt and revision context, and writing a reusable revision brief.
- The Researchers landing page now walks through finding a past decision, checking its assumptions and original sources, and recording the evidence in existing research notes.
- Both pages have shorter titles and descriptions, current modification dates, practical fictional examples and links to the broader informational blog guides. The copy explains import coverage and distinguishes the free local index from optional Vault sync.

The two landing pages were reported by Google's indexed inspection as discovered but not indexed. These changes improve their usefulness and reduce overlap with general guides; they cannot guarantee Google's index selection. The exact older 401/robots exclusion rows and Ahrefs' 30 missing-Article rows were not available through the chosen APIs, so no speculative crawl, redirect or template changes were made for them.

## Verification

- Optimised production build passed using installed dependencies, webpack and one static-generation worker. The worker limit was temporary verification configuration; `next.config.mjs` was restored unchanged.
- Static export checks passed for all 225 content/category routes.
- Homepage/installation localization checks passed for three languages and two installation guides; core localization checks passed for 15 pages.
- The new exported-schema contract fails against the original blog export and passes against the candidate. All 191 generated blog pages retain Article, FAQ and Breadcrumb nodes, with zero SoftwareApplication nodes.
- Both generated landing pages have one H1, expected self-canonicals, no noindex, valid Article modification dates and no broken internal links. Their descriptions are 131 and 130 characters respectively.
- No new dependency, browser interaction, live indexing submission, deployment or security-setting change was used.

## Publication

This is a local candidate. Publishing requires the usual explicit request. The source branch can be integrated with the intended site changes after checking the shared checkout and current remote; pushing main deploys production. After publication, verify the deployed article markup and both pages, then use the existing review cadence to observe indexing and search performance. Do not claim the historical alerts are resolved solely because the local build passes.
