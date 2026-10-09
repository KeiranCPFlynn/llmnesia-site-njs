# German and Spanish core website pages

Deployed with approval on 9 October 2026. This expands the existing German acquisition pilot and releases the Spanish pilot; it does not translate the extension or Vault app.

| Page | German | Spanish |
| --- | --- | --- |
| Vault | `/de/vault` | `/es/vault` |
| MCP | `/de/mcp` | `/es/mcp` |
| Pricing | `/de/pricing` | `/es/pricing` |
| About | `/de/about` | `/es/about` |
| Privacy Policy | `/de/privacy-policy` | `/es/privacy-policy` |

All five reuse the English page design and existing CSS. English routes are thin wrappers around the same server components used by German and Spanish. The policy uses one HTML template. Main-content text and element/class/id structure were compared against the previous English exports and preserved, with one subsequent functional addition: the purchase loading state now exposes the existing purchase anchor before hydration.

Navigation between available core translations stays in the selected language. The compact language menu switches to the equivalent core page. Each route has its own canonical URL, equivalent English/German/Spanish hreflang links, Open Graph locale, sitemap entry and exported HTML language. Homepage/guide links lead to translated core pages. Wider articles, comparisons, use-case pages, changelog and coding-agent guides remain English.

The on-page subscription widget, validation, authentication/billing feedback and plan CTA labels are translated. Its sign-in, subscription checks, billing plans and external Stripe destinations retain their existing behavior. Extension, Vault web app, account management, sign-in emails and external payment pages retain English interfaces. A translated footer notice states the interface/documentation boundary. Existing analytics attaches `site_language` and the current page path to page views and interactions on these routes; the saved homepage comparison funnel and its homepage denominator are unchanged.

## Translation and usage

DeepL drafts were compared with English and corrected with AI assistance. Review included annual versus monthly discount meaning, cancellation and restore behavior, encryption/key claims, browser permission identifiers, actual English interface labels, code/URLs, inline markup and tone. No native-speaker or legal review was performed. The English policy text, its date (30 September 2026), retention periods, destinations and commitments were preserved.

Official DeepL usage counter checked at `2026-10-09T08:45:29.389Z`:

- Before this expansion: **39,825 characters** used.
- After this expansion: **134,527 / 1,000,000 characters** used (**13.45%**).
- Additional usage: **94,702 characters** for both languages.
- Remaining allowance: **865,473 characters**.

No plan changes or new service resources were created. Builds and page views use the saved catalogs and do not call DeepL.

## Verification

- Production static build: 260 routes; existing 223 content-route checks and three-homepage/two-guide checks pass.
- `test:core-localization`: all 15 English/German/Spanish core pages, shared design structures, metadata, language switching URLs, sitemap entries, anchors, prices, policy dates/retention details, permissions, code and escaped dynamic bindings.
- Existing Vault release-contract, sign-in normalization/recovery, language preference, localization analytics and private Viewer handoff checks.
- Browser verification: all ten translated pages at requested 1440 × 1000 and 390 × 844 viewports, with no horizontal document overflow. Language menu switched `/de/vault` to `/es/vault` successfully. Invalid-email submission on German and Spanish pricing pages returned the correct translated validation; no email was sent and no checkout was opened.

Local previews: [German pricing](http://127.0.0.1:3100/de/pricing), [Spanish Vault](http://127.0.0.1:3100/es/vault).

## Production release — 9 October 2026

The user approved publication with “push live”. Release commit `909c685` includes the core translations from `b0388bd` and the production HTML-language correction. Existing Vercel project `llmnesia-site-njs` (`prj_PdeeqYxiRqRNFKpO6pkXngd7nuNy`) in `keiranflynns-projects` is READY at deployment `dpl_Fd6b4Y86HTvnChXdpDXC3z9wMjrd`, assigned to `www.llmnesia.com` and the existing project aliases. Deployment URL: https://llmnesia-site-e0x05cutu-keiranflynns-projects.vercel.app. No new project, plan or recurring resource was created.

Published scope: German and Spanish homepages, installation guides, Vault, MCP, Pricing, About and Privacy Policy. The original English routes remain available. Live examples: [German pricing](https://www.llmnesia.com/de/pricing), [Spanish Vault](https://www.llmnesia.com/es/vault).

The first public check caught `lang="en"` in raw localized HTML even though JavaScript corrected it. Vercel's Next adapter copies the prerendered documents into `.next/output/static` during `next build`, before the site's postbuild export patch. The postbuild script now patches that actual deployment copy as well as the export and prerender sources; build checks cover the adapter copy. The correction was verified with the installed Vercel adapter locally and on production.

Final public checks at `2026-10-09T09:09:58.329Z`: all 20 English/German/Spanish checked routes returned 200, with correct raw document languages, translated headings, shared core designs, equivalent-page picker links, canonical/hreflang URLs and sitemap entries. Twelve sampled local CSS/JS assets returned 200; GA4 measurement configuration was present; the apex domain redirected correctly. Browser switching from German Vault to Spanish Vault succeeded, with no browser console errors observed. This verifies deployed configuration and navigation, not GA4 report processing or completed conversions.

Rollback reference before this release: German-only deployment `dpl_DBELQtQFXhYhjvXsNzoy21Pr9rvx` at https://llmnesia-site-gwzyfa85l-keiranflynns-projects.vercel.app. Publishing used clean archives of committed source, excluding local secrets and unrelated untracked work.
