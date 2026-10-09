# German acquisition pilot

Prepared scope: a German introduction at `/de`, installation guidance at `/de/installation`, an English/German selector on the homepage, and a German store-listing draft. The extension, Vault, checkout, and wider documentation remain in English. The German pages disclose this before installation.

## Display and discovery

Each language has its own URL. German is suggested on the English homepage when the visitor's first browser language is German or they previously chose German. Explicitly choosing English, or dismissing the suggestion, suppresses it. Choices are saved in local browser storage when available. There are no forced redirects, IP lookups, or geographic restrictions.

The homepages have reciprocal English/German `hreflang` links and their own canonicals. Both German routes are included in the sitemap. The German setup guide always offers both official store links; its explicit Chrome button is not changed to Edge by browser detection.

## Translation workflow

Put `DEEPL_AUTH_KEY` in the existing ignored `.env.local` file. Do not give it a `NEXT_PUBLIC_` prefix. The key is used by the preparation script, never by the browser or production site.

```sh
npm run translate:german -- --dry-run
npm run translate:german
npm run test:site-language
npm run build
```

The script uses only Node's installed built-in APIs. No additional dependency is needed. It sends the public copy in `content/locales/en.json` to DeepL with product context and informal German tone. It requests the quality-optimized model when available, without silently upgrading the account. Only official `api.deepl.com` and `api-free.deepl.com` origins are accepted. The origin is inferred from the key's `:fx` suffix; an explicit `DEEPL_API_URL` can select either official origin if the account requires it.

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

German installation links use campaign `german_pilot` and placement-specific attribution. Existing `install_click` tracking remains in place, including accurate attribution for the guide's explicit store choices. The selector records `site_language_selected`; the homepage guide link records `german_setup_guide_click`. These use existing production-only analytics, with no new vendor, account, or live configuration changes.

Use production-host traffic, language, landing page, device, and source breakdowns. Separate install clicks from actual installs. Assess first successful search and returning usage only where available instrumentation can support those claims. Website/store events do not establish extension activation or retention. Observe roughly 4–6 weeks and extend the window if volumes are sparse.

## Publication

The local pages and listing copy are preparation artifacts. Deployment and store submission require separate approval. The listing should retain honest English-interface disclosure, and screenshots must show the actual interface rather than pretend the extension is translated. Existing platform/import lists are reused so supported-platform claims stay in sync with the English site.

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
