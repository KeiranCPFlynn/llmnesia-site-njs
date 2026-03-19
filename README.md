# LLMnesia Landing Page

Static landing site for **LLMnesia**, designed to run on GitHub Pages with no build step.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `main` branch and `/ (root)` folder.
5. Save. GitHub will publish your site at `https://keirancpflynn.github.io/llmnesia-site/`.

## Edit install and GitHub links

Update these links in `index.html`:

- Install button URL (`chromewebstore.google.com/detail/your-extension-id`)
- GitHub URL (`github.com/KeiranCPFlynn/llmnesia`)
- Optional: `og:url` meta tag in the `<head>`

## Replace demo and OG images

1. Replace `assets/demo.png` with your real product screenshot/mock.
2. Replace `assets/og.png` with your social share image (recommended 1200×630).
3. Keep the same filenames or update references in `index.html`.

## Contact form setup (email stays hidden)

The contact form in `index.html` posts to Web3Forms and does **not** expose your inbox address on the public page.

1. Create a form in [Web3Forms](https://web3forms.com/) and copy your `access_key`.
2. In `index.html`, set form action to:
   - `https://api.web3forms.com/submit`
3. Add hidden fields:
   - `access_key`
   - `subject`
   - `botcheck` (honeypot)
4. Publish the site.

Security note: no web form is impossible to abuse, but this setup keeps your email out of source code. The Web3Forms access key is public-by-design in frontend forms, so rotate it from your Web3Forms dashboard if needed. For stronger abuse protection, enable CAPTCHA in your Web3Forms settings.
