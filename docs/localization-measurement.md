# Website localization measurement

Prepared on 9 October 2026 for the existing LLMnesia website and GA4 property **533614466**, from the report supplied by the user. The user approved deployment, the three GA4 definitions and the comparison report. German and Spanish homepages, guides and core website pages, plus their analytics code, are deployed. All three GA4 event-scoped definitions and the private comparison exploration were created and verified through the user's authorized Brave session. The Insights service-account administration request received HTTP 403; no service-account permissions were changed.

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

## Approved live setup

Deployment to the existing production website is complete. GA4's read-only Data API verified receipt of `localized_page_viewed` at 06:11 UTC on 9 October. The supplied GA4 property had six existing definitions and no matching language fields. These three **event-scoped** definitions were added on 9 October 2026 and verified in the table:

| Display name | Event parameter |
|---|---|
| Website language | `site_language` |
| Localization page type | `page_type` |
| Install CTA position | `cta_position` |

Use built-in Language/Language code, Device category, Browser, Country, Host name and acquisition dimensions in GA4. The additional `browser_language` property is useful directly in PostHog and need not consume another GA4 custom-definition slot. There is no need to register custom page paths or user/session identifiers. Do not mark page views or language selections as key events.

The private GA4 exploration **Website language pilot** is saved with German and English funnel tabs, the same production-host, desktop, Chrome/Edge and German-browser-language filters, and a session acquisition-channel breakdown. It uses the existing property and services, without provisioning resources or changing subscriptions. This is a small increase of one explicit localization event per eligible page view. The user approved this deployment and configuration. Report setup alone cannot collect the new events before code deployment, or reconstruct missing historical events.

Google says registered custom data generally becomes reportable after 24–48 hours. [Custom dimensions](https://support.google.com/analytics/answer/14240153?hl=en).

## Website click comparison

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
- Chrome store campaigns `german_pilot` and `spanish_pilot`: count actual `install` events separately from website `install_click`. See the completed-install measurement below. First successful search, retention and purchase attribution to website language are not established by these events.

Review 4–6 weeks of complete post-deployment data, allowing reporting delay. As a practical sparse-data warning, avoid ranking a language/device/channel cell with fewer than 100 eligible visitors or 10 converters; these are readability gates, not proof of statistical significance. Publish uncertainty alongside rates and extend the observation window when sparse. Never combine GA4 and PostHog identities or counts into a single funnel. Annotate the actual verified deployment date and any owner/synthetic live checks.

## Verification

`npm run test:localization-analytics` exercises delayed SDK loading in either order, duplicate-ready notifications, English comparison collection without a GA key, cleanup before SDK readiness, locale properties, and local/preview/private-route exclusion. It uses local fakes and sends no events to analytics providers. The production build and shared-design export checks also passed. Live page inspection and GA4 event receipt passed after deployment; the three definitions and private comparison exploration were also verified in Brave. See the [deployment record](german-pilot.md).

## Adding another language

The registry automatically includes future homepages/guides in the denominator and language properties. No new event name or provider is needed for each language. Spanish was selected as the second website/guide pilot: the reviewed CSV's Spanish-country proxy had 451 active-user counts, 211 engaged sessions and 28 key events, versus 367/199/27 for Germany and Austria. These sums do not establish preferred language, unique audiences or localization uplift.

After preparing Spanish, the verified DeepL counter was 39,825 of 1,000,000 characters (3.98%), with 960,175 remaining. Spanish used 17,391 billable characters. At that earlier homepage/guide checkpoint, the English catalog had 336 strings and 22,926 source characters including markup. This historical catalog size is not an estimate for the expanded core-page scope. After that expansion, the counter was 134,527 / 1,000,000 characters, with 865,473 remaining; see `core-page-localization.md` for the verified receipt. This is capacity, not an ROI estimate or a promise of recurring free usage. DeepL's plans have different billing/allowance structures. [DeepL API plans](https://support.deepl.com/hc/en-us/articles/360021200939-DeepL-API-plans).

Current decision: keep the live German and Spanish website pilots and add no further language now. The extension, Vault app and external checkout remain English with clear disclosure. Hold a broad language rollout until browser-language demand and actual installs support it. Review, terminology, layout QA and keeping translations current are the remaining costs; there is still no native reviewer. See the [country assessment](language-support-assessment-2026-10-09.md).

## Saved report receipt

[Open Website language pilot](https://analytics.google.com/analytics/web/?authuser=0#/analysis/a391857932p533614466/edit/WL9Gl5GtTLCz5bzmt7zFdA). Verified on 9 October in property **LLMNesia site (533614466)** under account **LLMnesia (391857932)**. The Explorations list identifies owner Keiran Flynn and explicitly says **Exploration is not shared**.

Tabs: **German homepage to install** and **English homepage to install**. Both are closed funnels: event name exactly `localized_page_viewed` AND Localization page type exactly `homepage` AND Website language exactly `de` or `en`, then `install_click` indirectly within 30 minutes. Language is restricted only at the entry step, allowing later English-page installation clicks.

Both tabs use these identical report filters: Hostname matches `^(www\.)?llmnesia\.com$`; Device category exactly `desktop`; Browser matches `^(Chrome|Edge)$`; Language code matches `^de([_-].*)?$`. Breakdown: **Session primary channel group (Default Channel Group)**. The default rolling Last 28 days range excluded launch day when configured (11 September–8 October), so no data was expected. It advances with complete dates; exclude the prelaunch period and allow custom-dimension processing before drawing conclusions. Owner checks on 9 October are internal verification traffic.

All-visitor/device and supporting guide/CTA views above remain analysis instructions, rather than extra saved tabs. The primary private comparison is complete. Spanish is live and uses the same measurement contract. The saved exploration currently contains only the German/English comparison; Spanish data is collected and can be queried through the existing Data API, but the equivalent Spanish/English saved tabs have not been created.

## Completed-install measurement — verified 9 October 2026

The business question is whether the translated acquisition pages generate enough completed installs to justify keeping their translations current and handling resulting support demand. Website store-link clicks are a diagnostic step, not the primary outcome.

The existing Chrome Web Store GA4 property **529666179** is readable through the founder OAuth connection already configured in LLMnesia Insights. A bounded read-only Data API check at **2026-10-09T12:23:05Z** successfully returned `install` and `page_view` events broken down by `sessionCampaignName`, `sessionSource` and `sessionMedium`. For example, `blog_install_cta` had 142 install events in 11 September–8 October; this verifies that completed installs are available with campaign attribution, not just website clicks. No new access, resources, subscriptions or extension telemetry were added.

Chrome documents that its `install` event is sent after the user accepts the permission prompt, and that store URL campaign parameters carry through to both listing views and installs. Data can take 24–48 hours to finalize. [Chrome Web Store GA4 integration](https://developer.chrome.com/docs/webstore/google-analytics).

| Website language | Store campaign | Source | Medium |
| --- | --- | --- | --- |
| German | `german_pilot` | `german_page` | `cta` |
| Spanish | `spanish_pilot` | `spanish_page` | `cta` |

Use the store property's **Session campaign** dimension with **Event name = install** and report **Event count** plus **Total users** for each campaign. Also report listing-view users for context; do not divide independent event-user aggregates and call the result a closed installation funnel. If a store conversion rate is needed, use a closed listing-view-to-install user funnel within the store property. Do not join website and store user identities or divide their differently collected populations into an exact end-to-end user conversion rate.

The launch-day read returned no German/Spanish campaign rows yet. This is not a finding of zero demand: 9 October is incomplete and processing is pending. The store property's timezone is **America/Los_Angeles**; use complete store dates and document differences from the website report timezone. Exclude or annotate owner verification traffic on launch day.

A public audit of all 44 store links across 14 German/Spanish routes found six attribution gaps: the closing MCP button and both privacy-page store buttons in each language. The deployed correction adds the corresponding language campaign to those links; a build check now verifies every store link on the translated core pages. The production build and all export checks passed with the correction, including campaign checks on all ten translated core pages. The user approved publication, and commit `6b337ea` was deployed on 9 October 2026 to the existing Vercel project `llmnesia-site-njs`, deployment `dpl_EsCqMF313DSrgDrQSdZjAEGncf7c`, READY and aliased to `www.llmnesia.com`. A public check verified campaign, source and medium on all 44 store links across the 14 German/Spanish routes, without clicking store links or generating test installs. Additional live checks passed for 20 routes and 12 assets, including document languages, shared designs, metadata, language switching, sitemap, GA configuration and the apex redirect. The production build and export checks passed. Rollback reference: banner-fix deployment `dpl_25QtwaSaA2XTshivh7aRUFnMBPGd`. The main homepages, guides and other core-page links already have their language campaigns.

Attribution covers the tagged store link that the user follows. A visitor who switches to an English page and clicks an English CTA may receive that page's campaign instead. Attribution therefore does not capture every install that might have been influenced by a translated page. Exact Edge campaign install attribution and activation/retention/purchase by website language are not verified by this check.

First check campaign receipt after the 24–48-hour processing window. Review approximately **6–20 November 2026**, after 4–6 weeks of complete postlaunch data, extending the window if counts are sparse. Compare website-language cohorts within the same browser-language audience and acquisition channel; use actual campaign installs as the business outcome and website click funnels to explain drop-off. Record ongoing translation maintenance and support effort. Cheap DeepL capacity alone is not evidence that a language is worthwhile.

The pilot is observational: attributed installs show acquisition through these pages, but do not prove how many additional installs would have occurred compared with keeping everything in English. A causal uplift claim would require a separately planned controlled test.
