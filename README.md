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

- Canonical domain: `https://llmnesia.com`
- `middleware.js` enforces host canonicalization and 301 redirects for:
  - `/index.html` -> `/`
  - `/privacy-policy.html` -> `/privacy-policy`

## Analytics

GA4 is optional and enabled via env vars:

- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

Tracked events:

- `install_click`
- `email_signup`
- `contact_submit`

## Deployment (Vercel)

1. Push to GitHub.
2. Import repository in Vercel.
3. Set any env vars above if needed.
4. Deploy.
