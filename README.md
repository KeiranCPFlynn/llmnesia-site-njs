# LLMnesia Site (Next.js)

Next.js App Router site for LLMnesia, optimized for SEO + AEO/GEO discovery and deployment on Vercel.

## Run locally

```bash
npm install
npm run dev
```

## Build and start

```bash
npm run build
npm run start
```

## Content architecture

- `Blog` hub: `/blog`
- `Comparison` hub: `/compare`
- `Use cases` hub: `/use-cases`

Dynamic content is MDX-based and lives in:

- `content/blog/*.mdx`
- `content/compare/*.mdx`
- `content/use-cases/*.mdx`

## MDX frontmatter schema

Every content page requires these fields:

- `title`
- `slug`
- `description`
- `publishDate`
- `updatedDate`
- `author`
- `primaryKeyword`
- `secondaryKeywords`
- `intent`
- `faq`
- `sources`
- `canonicalPath`

Validation runs during build via `lib/content.js`.

## Discovery + crawl assets

- `app/robots.js` -> `robots.txt`
- `app/sitemap.js` -> `sitemap.xml`
- `app/feed.xml/route.js` -> `feed.xml`
- `public/llms.txt`
- `public/llms-full.txt`

## Canonical and redirects

- Canonical domain: `https://www.llmnesia.com` (www, not apex).
  **Do not flip this to apex.** The canonical host was flip-flopped apex<->www
  multiple times historically, which stalled Google's host consolidation and
  produced a large "Page with redirect" tail in Search Console. It is settled on
  www: `SITE_URL` in `lib/site.js`, all canonicals, the sitemap, and the
  apex->www redirect must all stay on www. Any new absolute link (code or
  `content/`) must use `https://www.llmnesia.com`.
- `next.config.mjs` `redirects()` enforces:
  - apex -> www (`llmnesia.com` -> `www.llmnesia.com`, 308)
  - `/index.html` -> `/`, `/privacy-policy.html` -> `/privacy-policy`
  - `/contact` -> `/#contact`, `/privacy` -> `/privacy-policy`

## Analytics

GA4 is optional and enabled via env vars:

- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `LEADS_WEBHOOK_URL` server-side webhook for `/api/leads`
- `LEADS_WEBHOOK_KEY` optional shared key for the leads webhook

The `/api/leads` route accepts direct website and extension JSON payloads. The
homepage signup can override attribution with `lead_source` and `lead_context`
query params, for example links from the extension founding prompt.

## Install-link email

The mobile blog CTA ("Email me the link") sends the reader the Chrome Web Store
link, because mobile visitors cannot install a desktop extension where they are
standing. Delivery lives in `lib/install-email.js` and runs through Resend:

- `RESEND_API_KEY` **required for sending.** Without it the lead is still
  captured, the API responds `emailed: false`, and the CTA shows the link inline
  instead of claiming an inbox delivery.
- `LEADS_FROM_EMAIL` sender, e.g. `LLMnesia <hello@llmnesia.com>`. The domain
  must be verified in Resend or sends are rejected.
- `LEADS_REPLY_TO` optional reply-to address.

Sends are capped at 5 per IP per hour, per function instance, since the endpoint
is unauthenticated. The message body is fixed and contains no caller-supplied
content.

Tracked events:

- `install_click`
- `email_signup`
- `contact_submit`
- `mobile_email_capture` — carries `emailed: true|false` so captures that sent
  the install link are separable from ones that fell back to the inline link

## Deployment (Vercel)

1. Push to GitHub.
2. Import repository in Vercel.
3. Set any env vars above if needed.
4. Deploy.
