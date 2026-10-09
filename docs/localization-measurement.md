# Website localization measurement

Prepared on 9 October 2026 for the existing LLMnesia website and GA4 property **533614466**, from the report supplied by the user. This code is local preparation; the German pages and these analytics changes have not been deployed, and no live GA4 definitions or reports have been changed.

## Collection contract

| Event | What it measures | Relevant properties |
|---|---|---|
| `page_view` | Existing GA4 page views | `page_path`, `site_language`, `browser_language`, `page_type` |
| `localized_page_viewed` | A visit to a registered homepage or installation guide, including the English comparison homepage | Same properties; the path excludes query strings |
| `site_language_selected` | An explicit language choice | Source `site_language`, destination `language` |
| `german_setup_guide_click` | Clicking the German homepage's guide link | German page context |
| `install_click` | Opening a store listing, not completing installation | Page context, `store`, `cta_position`, existing `platform`/`placement` |

`site_language` identifies the page's language, not the person's nationality. `browser_language` is the browser's primary language code (`de` groups `de-DE` and `de-AT`); it is a preference proxy. `page_type` is `homepage`, `installation_guide` or `other`. Install positions are `header`, `hero`, `features`, `closing`, `footer`, `guide_chrome` and `guide_edge` on these pages. Existing event names and attribution fields are retained.

GA4 receives the counters through its existing configured tag. PostHog receives the localization denominator and the existing mirrored interactions only when its existing key is configured. The local environment has a GA4 ID and no PostHog key; this is not verification of the production deployment's PostHog configuration. The page counter waits for each SDK separately and sends once per page effect/provider. It does not enable general PostHog automatic page views, autocapture or session recording.

Only `www.llmnesia.com` and `llmnesia.com` collect events. Localhost, previews and `/open` remain excluded. No conversation content, search queries, form messages, email addresses or new identifiers are added by this change. Existing GA4 page-view query handling is retained; the localization event adds no query or fragment data.

## Live setup to approve

Deploy the reviewed German pilot and this measurement code to the existing production website. In the supplied GA4 property, inspect existing custom definitions first and reuse matching definitions. If missing, register these three **event-scoped** definitions:

| Display name | Event parameter |
|---|---|
| Website language | `site_language` |
| Localization page type | `page_type` |
| Install CTA position | `cta_position` |

Use built-in Language/Language code, Device category, Browser, Country, Host name and acquisition dimensions in GA4. The additional `browser_language` property is useful directly in PostHog and need not consume another GA4 custom-definition slot. There is no need to register custom page paths or user/session identifiers. Do not mark page views or language selections as key events.

Create a private GA4 exploration named **Website language pilot** using the funnel below, with German and English versions and separate device/channel breakdowns. It uses the existing property and services, without provisioning resources or changing subscriptions. This is a small increase of one explicit localization event per eligible page view. Deployment and GA4 administrative configuration require the user's approval. Report setup alone cannot collect the new events before code deployment, or reconstruct missing historical events.

Google says registered custom data generally becomes reportable after 24–48 hours. [Custom dimensions](https://support.google.com/analytics/answer/14240153?hl=en).

## Primary comparison

Use a **closed, user-based funnel**, not total clicks divided by page views:

1. `localized_page_viewed`, `page_type = homepage`, `site_language = de` (or `en` in the comparison).
2. `install_click`, indirectly following step 1, within **30 minutes**. Do not require a German page at step 2: a person may visit an English pricing or documentation page before clicking install.

Report **users completing step 2 / users entering step 1**, including both counts. Repeated clicks do not become extra converting people. This is a user funnel with an elapsed-time constraint; it is not a session-conversion rate or an installation rate. [GA4 funnel definitions](https://support.google.com/analytics/answer/9327974?hl=en).

Start with German-language browsers (`de`, including regional variants) on desktop Chrome/Edge. Compare English and German homepage cohorts over the same complete date range, timezone, device/browser and acquisition channel. Add all visitors and mobile/tablet as separate views. Keep geography as a secondary breakdown rather than substituting it for language. Filter both numerator and denominator to the production hosts. A person can visit both languages and appear in both cohorts; do not add their denominators together.

The language choice is voluntary, so this comparison is observational. It can show acquisition, preferences and install intent; it cannot establish causal uplift from translation. A randomized test would be a separate proposal if a causal answer becomes necessary.

## Supporting views

- Homepage audience and acquisition by language, source/medium, country, browser language and device; distinguish first landing on `/de` from switching languages after arrival.
- Guide use: German homepage → guide click → guide page view → install click. Keep this optional path separate from the primary funnel, which permits direct installation clicks.
- Direct-guide visitors: guide page view → install click, with Chrome and Edge choices separated.
- CTA-position breakdown: distinct clicking users and event counts, labelled separately; do not infer a position's conversion rate without its own exposure denominator.
- Language choices: use destination page views and the existing choice event to inspect English/German switching. No new custom dimension for the legacy `language` parameter is required for the primary comparison.
- Store campaign `german_pilot`: use the stores' available acquisition/install reporting separately. A website click does not prove a store installation, first successful search, retention or purchase. The current country CSV cannot supply those downstream outcomes.

Review 4–6 weeks of complete post-deployment data, allowing reporting delay. As a practical sparse-data warning, avoid ranking a language/device/channel cell with fewer than 100 eligible visitors or 10 converters; these are readability gates, not proof of statistical significance. Publish uncertainty alongside rates and extend the observation window when sparse. Never combine GA4 and PostHog identities or counts into a single funnel. Annotate the actual verified deployment date and any owner/synthetic live checks.

## Verification

`npm run test:localization-analytics` exercises delayed SDK loading in either order, duplicate-ready notifications, English comparison collection without a GA key, cleanup before SDK readiness, locale properties, and local/preview/private-route exclusion. It uses local fakes and sends no events to analytics providers. The production build and shared-design export checks also passed. Live receipt and the saved report remain to be checked after approved deployment/configuration.

## Adding another language

The registry automatically includes future homepages/guides in the denominator and language properties. No new event name or provider is needed for each language. Spanish is the next recommended website/guide pilot: the reviewed CSV's Spanish-country proxy had 451 active-user counts, 211 engaged sessions and 28 key events, versus 367/199/27 for Germany and Austria. These sums do not establish preferred language, unique audiences or localization uplift.

The last verified DeepL counter was 22,434 of 1,000,000 characters (2.24%). The current English catalog has 336 strings and 22,926 source characters including markup: a fresh full locale is roughly 2.3% of that observed allowance before any draft repetition; actual billable characters can differ. This is capacity, not an ROI estimate or a promise of recurring free usage. DeepL's plans have different billing/allowance structures. [DeepL API plans](https://support.deepl.com/hc/en-us/articles/360021200939-DeepL-API-plans).

Recommendation: make German measurement live, then add Spanish as one further acquisition pilot. Keep the extension, Vault and checkout in English with clear disclosure. Hold a broad language rollout until browser-language demand and adoption support it. Review, terminology, layout QA and keeping translations current are the remaining costs; there is still no native reviewer. See the [country assessment](language-support-assessment-2026-10-09.md).
