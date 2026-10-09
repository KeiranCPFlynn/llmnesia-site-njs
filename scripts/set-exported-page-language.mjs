import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_LANGUAGES, LOCALIZED_CORE_PAGES } from '../lib/site-language.js';

// The static export shares one Next.js root layout. Set each registered locale
// on its exported HTML, including no-JS clients; SiteLanguage handles navigation.
// Vercel packages Next's prerendered HTML rather than our patched out/ export.
// Keep both artifacts consistent before the adapter assembles the deployment.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const {code, path: route, guidePath} of SITE_LANGUAGES.filter(item => item.code !== 'en')) {
  const routes = [route, ...LOCALIZED_CORE_PAGES.map(page => `${route}/${page}`), ...(guidePath ? [guidePath] : [])];
  for (const localizedRoute of routes) {
    for (const directory of ['out', '.next/server/app', '.vercel/output/static']) {
      const filename = path.join(root, directory, `${localizedRoute.slice(1)}.html`);
      let html;
      try { html = await fs.readFile(filename, 'utf8'); }
      catch (error) {
        if (directory !== 'out' && error.code === 'ENOENT') continue;
        throw error;
      }
      if (!/<html\b[^>]*\blang="[^"]+"/.test(html)) throw new Error(`Missing document language in ${directory}${localizedRoute}.`);
      await fs.writeFile(filename, html.replace(/(<html\b[^>]*\blang=")[^"]+("[^>]*>)/, `$1${code}$2`));
    }
  }
}
console.log('Registered locale document languages set.');
