# Weekly KPI Dashboard Spec

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
