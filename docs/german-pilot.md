# German acquisition pilot

Prepared scope: the existing English homepage translated at `/de`, installation guidance at `/de/installation`, a compact language dropdown separate from the main menu, and a German store-listing draft. The extension, Vault, checkout, and wider documentation remain in English. The German pages disclose this before installation.

The German website pilot and tracking were deployed with approval on **9 October 2026**. The homepage and guide are live at `https://www.llmnesia.com/de` and `/de/installation`. The store listing remains an unsubmitted draft.

## Display and discovery

Each language has its own URL. German is suggested on the English homepage when the visitor's first browser language is German or they previously chose German. Explicitly choosing English, or dismissing the suggestion, suppresses it. Choices are saved in local browser storage when available. There are no forced redirects, IP lookups, or geographic restrictions.

The homepages have reciprocal English/German `hreflang` links and their own canonicals. Both German routes are included in the sitemap. The homepages share one template, all sections, styling and behavior; language changes copy instead of selecting a different design. See [shared website localization](site-localization.md) for editing and adding languages. The German setup guide always offers both official store links; its explicit Chrome button is not changed to Edge by browser detection.

## Translation workflow

Put `DEEPL_AUTH_KEY` in the existing ignored `.env.local` file. Do not give it a `NEXT_PUBLIC_` prefix. The key is used by the preparation script, never by the browser or production site.

```sh
npm run translate:german -- --dry-run
npm run translate:german
npm run test:site-language
npm run build
```

The script uses Node’s built-in APIs and the existing locale registry. No additional dependency is needed. The shared `translate:site` script (`translate:german` remains an alias) sends the public copy in `content/locales/en.json` to DeepL with product context and informal German tone. It requests the quality-optimized model when available, without silently upgrading the account. Only official `api.deepl.com` and `api-free.deepl.com` origins are accepted. The origin is inferred from the key's `:fx` suffix; an explicit `DEEPL_API_URL` can select either official origin if the account requires it.

The script checks the existing account allowance before translation, limits a run to 25,000 source characters, and saves each completed batch. Source hashes identify changed strings. Already translated strings, including manually reviewed edits, are retained until their English source changes. Changing an English string requires a new translation and review. No account, subscription, cloud glossary, or other resource is created by the script. It never retries a failed request automatically. If a translation request times out, check account usage before rerunning it.

`de.json` contains the prepared website text. `de.translation.json` records the source hashes, original machine-output hashes, reviewed-text hashes, models, and translation dates. Later corrections can differ from the original machine output. After reviewing changed text against its source, update its `reviewedHash` with SHA-256 of the final German string; the export check rejects unreviewed changes. Review is AI-assisted; no native human review is available. Preserve the distinctions between free local search, optional paid Vault, limited analytics, and the English application interface.

The build uses only saved translations. A post-export step sets `lang="de"` in both German HTML documents because the existing Next.js root layout is shared with English routes. The language component maintains the same document language after client navigation. German content also has an explicit `lang="de"` wrapper. Builds make no DeepL requests.

## Product-language checks

The current shared tokenizer was inspected and exercised locally on 9 October 2026. Normal composed umlauts and `ß` survived tokenization, as did mixed German/English terms. Limitations remain:

- `Straße` and `Strasse` become different tokens.
- Composed `Müller` produces `müller`; the equivalent decomposed text produces `mu` and `ller`.
- The English stopword list removes German `was`.
- The extension embedder still uses `Xenova/all-MiniLM-L6-v2`.

These are tokenizer checks, not end-to-end capture, retrieval, or semantic-search quality validation. The pilot does not claim reliable German semantic search or cross-language search. No extension code or models are changed in this website task.

## Measurement

German installation links use campaign `german_pilot`; the guide's explicit store choices also identify their placements. Existing `install_click` tracking remains in place, including accurate attribution for those choices. The selector records `site_language_selected`; the homepage guide link records `german_setup_guide_click`. These use existing production-only analytics, with no new vendor, account, or live configuration changes.

Use production-host traffic, language, landing page, device, and source breakdowns. Separate install clicks from actual installs. Assess first successful search and returning usage only where available instrumentation can support those claims. Website/store events do not establish extension activation or retention. Observe roughly 4–6 weeks and extend the window if volumes are sparse.

The prepared [localization measurement plan](localization-measurement.md) adds an explicit homepage/guide denominator for English and German, page/browser-language context and CTA positions. It fixes page-view delivery when analytics loads after the component mounts. The plan defines a comparable visitor funnel and the three GA4 custom definitions to register after approval. Code and local tests are prepared; deployment, live definition/report setup and live receipt verification remain separate steps.

## Publication

The German pages and tracking are deployed after approval. Store submission still requires separate approval. The listing should retain honest English-interface disclosure, and screenshots must show the actual interface rather than pretend the extension is translated. Existing platform/import lists are reused so supported-platform claims stay in sync with the English site.

## Preparation and verification — 9 October 2026

- DeepL translated 89 strings from 7,585 source characters using the existing account allowance. No subscription or additional resource was created. Saved translations received AI-assisted comparison against the English source and terminology/tone corrections; no native human review was performed.
- [German store-listing draft](german-store-listing.md) includes the English-interface disclosure. It has not been submitted.
- Production build and export checks passed for 223 existing content routes plus both German routes, including document language, canonical/alternate metadata, source freshness, reviewed copy and store links. Language-preference tests and existing private Viewer hand-off tests passed.
- Browser checks covered English navigation at 980px, the German desktop page, both German pages at 390px, mobile-menu navigation, remembered German selection, English dismissal across reload, document language and separate store choices. No horizontal overflow or browser warnings/errors were observed on the German pages.
- Website pages are prepared locally. No website deployment, store submission or extension translation was performed.

## References

- [Language-support assessment](language-support-assessment-2026-10-09.md)
- [DeepL text API](https://developers.deepl.com/api-reference/translate/request-translation)
- [DeepL API plans](https://support.deepl.com/hc/en-us/articles/360021200939-DeepL-API-plans)
- [Google multilingual-site guidance](https://developers.google.com/search/docs/advanced/crawling/managing-multi-regional-sites)

## Shared-design correction — 9 October 2026

The initial shortened German page was replaced with a full translation of the existing English homepage. Both locales now render `Homepage` and `index.template.html`, retaining all 18 sections, original kinetic animation, typography, grids, platform list and footer. The initial inline EN/Deutsch menu links were replaced by a compact independent dropdown generated from the language registry. The English page’s main text and element structure were compared with the original and preserved.

The shared translation workflow covers homepage text and contact/signup feedback. Locale builds reject missing, stale or unreviewed copy and changed inline markup; the homepage check also verifies that locale structures match. Original extension-demo controls and examples remain English, matching the product. No form messages or signups were submitted during verification.

The final DeepL usage counter is 22,434 of 1,000,000 characters (977,566 remaining). This includes the initial pilot and the shared-homepage correction, including one repeated batch after the initial markup check stopped it. Future builds and page views consume no DeepL characters.

The corrected production build passed, including the 223 existing content-route checks and shared-design checks for both homepages and 275 copy slots. Language-preference and private Viewer hand-off tests passed; the translation dry run reports no pending strings. Browser verification covered the restored desktop animation and step layout, German homepage and guide at 390px, separate Chrome/Edge guide links, guide skip navigation, and the selector on an existing English page. The closed desktop selector is approximately 60px wide. Opening it closes the mobile menu; Escape dismisses it. No horizontal overflow or browser warnings/errors were observed. These checks did not submit any forms or publish the site.

## Approved deployment — 9 October 2026

Release commit `3e3dba53ebc6d7b028aea077b89afd8ad5aad6e4` was deployed to the existing `llmnesia-site-njs` Vercel project. Deployment `dpl_DBELQtQFXhYhjvXsNzoy21Pr9rvx` is READY and assigned to `www.llmnesia.com`, `llmnesia.com` and the existing project aliases. The previous production deployment was `dpl_Rxk4MNoXBuEfrCfZJvN2BaitcpZ8`, available as a rollback reference.

The cloud build and export checks passed. Live browser inspection confirmed German document language, canonical/alternate metadata, all 18 homepage sections, compact selector and CTA-position labels. The installation guide has separate Chrome/Edge store choices. GA4's existing read-only Data API returned `localized_page_viewed` with an event count of one at 06:11 UTC, verifying receipt after the live check. Agent verification visits around 06:07–06:11 UTC are internal checks, not new customer demand. No install, message, signup or purchase was submitted.

A preparation error initially created an empty temporary Vercel project named `llmnesia-german-release-3e3dba5`. The attempt was stopped before the existing site's alias changed. The user approved cleanup, and Vercel confirmed removal of that exact temporary project. The corrected release directory was explicitly checked against the existing project's and team's IDs before deployment.
