# Weekly KPI Dashboard Spec

Website analytics run only on `www.llmnesia.com` and `llmnesia.com`. Local and
preview hosts do not initialize GA4 or PostHog. Insights also filters every
website GA4 report to those two hosts, including historical periods; the
Chrome Web Store property is separate and remains unfiltered. GA4's raw
property still contains earlier local events, so apply the same hostname
filter in any ad hoc GA4 report. Do not delete raw events to repair this.

Use GA4 + Search Console and track these directory segments:

- `/blog`
- `/compare`
- `/use-cases`

## Metrics

- Search impressions (Search Console)
- Search clicks (Search Console)
- CTR (Search Console)
- Install CVR = `install_click / organic_sessions` (GA4)

## Weekly table template

| Week Start | Directory | Impressions | Clicks | CTR | Organic Sessions | Install Clicks | Install CVR |
|------------|-----------|-------------|--------|-----|------------------|----------------|-------------|

## Required GA4 events

- `install_click`
- `email_signup`
- `contact_submit`
- `vault_checkout_started`
- `vault_purchase_completed`

## Conversion definitions

- **Primary key event:** `install_click`. This is the verified outbound click
  from the website to the Chrome Web Store or Edge Add-ons listing. It is not a
  completed extension install, so reconcile it with the store dashboards each
  week.
- **Secondary key event:** `mobile_email_capture`. This is a successful
  request to email a desktop install link to a mobile visitor. Use its
  `emailed` parameter to separate messages actually sent from fallback links.
- `cta_install_click` and `blog_install_cta_clicked` duplicate the article CTA
  portion of `install_click`. Keep them for page and placement analysis, but do
  not add them to `install_click` in totals.
- `recovery_search_guide_click` records recovery-article visitors who choose
  the "not sure it was deleted" route to a find-old-chat guide. It indicates a
  missing-history problem rather than immediate extension-purchase intent.
- **Vault completion key event (to configure after deployment):**
  `vault_purchase_completed`. `vault_checkout_started` is a funnel step, not a
  key event. These website events are separate from the extension's
  `vault_checkout_opened` event. Do not sum them as one checkout metric.

## Website Vault purchase measurement

Prepared 22 October 2026. Not deployed by this change. GA4 property: `533614466`;
PostHog project: `132419`. Both events use the central `trackEvent` function and
the existing production-host restrictions. No SDK or cloud resource was added.

| Event | Trigger | Additional properties |
| --- | --- | --- |
| `vault_checkout_started` | The authenticated checkout call returns a URL, immediately before leaving for Stripe | `surface: website_purchase`, `plan: annual/monthly`, `checkout_source: payoff/unknown` |
| `vault_purchase_completed` | A success return from a checkout started in the same tab, for the same signed-in account, after the entitlement RPC confirms `entitled: true` | The original plan and allowlisted source, plus `verification: entitled_return` |

The pending checkout expires after 24 hours and is consumed before sending
completion. Its account binding stays in tab-scoped session storage until it
is consumed, replaced, cancelled or the tab closes. This prevents entitlement
polls, reloads, an unrelated account and a typed success URL from inflating the
count. Cancellation clears it. The account binding is never included in an
event. No email, account ID, checkout ID, request ID or Stripe URL is sent.
If tab storage is unavailable, checkout still works, but completion is omitted.
Completion delivery waits up to ten seconds for either analytics SDK to load;
each provider receives it at most once. Checkout uses immediate beacon delivery
and never waits for tracking to finish.

This event measures a verified entitled return, not a server-confirmed payment.
People who close Stripe without returning, change device/tab or have analytics
blocked can be absent. Do not infer revenue from it or report historic missing
events as zero purchases. Weekly Insights Stripe invoice/payment evidence is
the source of truth for paid subscriptions and revenue. Source attribution lives
on Stripe Checkout Session and subscription `metadata.checkout_source`.

After an approved deployment, mark `vault_purchase_completed` as a GA4 key
event. No GA4 administration setting is changed by this code. Compare users
with `vault_checkout_started` followed by `vault_purchase_completed` in the same
provider and a 24-hour window, with source and plan breakdowns in PostHog. Do not
mix GA4 identities with PostHog identities or the extension's checkout events.
Use the existing Stripe report for actual paid counts.

Verification commands: `npm run test:vault-analytics`,
`npm run test:localization-analytics`, `npm run test:vault-release`,
`npm run test:vault-sign-in`, and `npm run build`.

Read-only Stripe check on 22 October: the existing restricted live key could
read all subscriptions created since 20 October. One non-founder subscription
was returned, with no `checkout_source=payoff`. Checkout Session listing and
account-name lookup returned HTTP 403; permissions were not changed. Thus no
real payoff-attributed purchase has been verified by this check. No checkout,
subscription, email or charge was created for verification.

SDK reference: [PostHog capture before page unload](https://posthog.com/docs/libraries/js/usage).

Local verification on 22 October: all nine purchase-analytics tests and the
existing localization, Vault release and sign-in checks passed. The production
build and static export checks passed. An isolated headless Chrome canary
loaded these modules from a local server and carried synthetic checkout state
from `/vault` to `/account`: each stubbed provider received exactly one start
and one completion, with the original plan/source. The localhost run received
zero events. All analytics were stubbed, network connections were blocked by
the fixture's Content Security Policy, and the disposable browser profiles
were removed. This is not evidence of a real Stripe purchase.

## CTA dimensions

The GA4 property registers these event-scoped dimensions for CTA reporting:

| Dimension | Parameter | Purpose |
|---|---|---|
| Platform | `platform` | Platform named in the CTA copy |
| Placement | `placement` | UTM-level CTA placement |
| CTA family | `family` | Intent family, such as loss, export, reliability, privacy, or capability |
| CTA position | `position` | Article placement: intro or foot |
| CTA page slug | `slug` | Article responsible for the click |
| Extension store | `store` | Chrome or Edge destination |

Custom dimensions apply to data received after their creation. Build the CTA
report after sufficient fresh traffic has accumulated, then compare
`install_click` and `mobile_email_capture` by page, family, position, and
store.

## Notes

- Use page path contains filters for each directory.
- Keep date windows aligned across GA4 and Search Console.
- Record annotations when new pages are published.
