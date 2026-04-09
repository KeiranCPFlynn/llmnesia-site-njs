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

## Notes

- Use page path contains filters for each directory.
- Keep date windows aligned across GA4 and Search Console.
- Record annotations when new pages are published.
