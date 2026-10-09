# German and Spanish core website pages

Prepared locally on 9 October 2026. Not deployed. This expands the existing German acquisition pilot and prepared Spanish pilot; it does not translate the extension or Vault app.

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
