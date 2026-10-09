import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_LANGUAGES } from '../lib/site-language.js';

// The static export shares one Next.js root layout. Set each registered locale
// on its exported HTML, including no-JS clients; SiteLanguage handles navigation.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const {code, path: route, guidePath} of SITE_LANGUAGES.filter(item => item.code !== 'en')) {
  const routes = [route, ...(guidePath ? [guidePath] : [])];
  for (const localizedRoute of routes) {
    const filename = path.join(root, 'out', `${localizedRoute.slice(1)}.html`);
    const html = await fs.readFile(filename, 'utf8');
    if (!/<html\b[^>]*\blang="[^"]+"/.test(html)) throw new Error(`Missing document language in ${localizedRoute}.`);
    await fs.writeFile(filename, html.replace(/(<html\b[^>]*\blang=")[^"]+("[^>]*>)/, `$1${code}$2`));
  }
}
console.log('Registered locale document languages set.');
