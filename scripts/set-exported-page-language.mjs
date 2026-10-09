import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Next's shared root layout has one document language. For this static export,
// set German on its generated documents before serving them, including no-JS
// clients. SiteLanguage maintains the same value after client navigation.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const route of ['de', 'de/installation']) {
  const filename = path.join(root, 'out', `${route}.html`);
  const html = await fs.readFile(filename, 'utf8');
  if (!/<html\b[^>]*\blang="(?:en|de)"/.test(html)) throw new Error(`Missing document language in ${route}.`);
  const localized = html.replace(/(<html\b[^>]*\blang=")en("[^>]*>)/, '$1de$2');
  await fs.writeFile(filename, localized);
}
console.log('German static document languages set.');
