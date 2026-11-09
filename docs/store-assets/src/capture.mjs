// Capture the real search UI with demo data. Usage: node capture.mjs <page> <query> <out.png> [w] [h]
import { createRequire } from 'node:module';
import { CORPUS } from './corpus.mjs';
const require = createRequire('/Users/Kdog/Code-Projects/firecrawl-ctf/node_modules/');
const { chromium } = require('playwright');
const [page = 'search.html', query = 'lisbon', out = 'ui.png', w = '760', h = '560', theme = 'light'] = process.argv.slice(2);
const demo = { corpus: CORPUS, stats: { conversations: 5176, messages: 148230 },
  platformCounts: { chatgpt: 2140, claude: 1580, gemini: 612, google_ai_mode: 318, character_ai: 266 } };
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2, colorScheme: theme });
const p = await ctx.newPage();
p.on('pageerror', (e) => console.error('pageerror', e.message));
await p.addInitScript(`window.__DEMO = ${JSON.stringify(demo)};`);
await p.goto(`http://127.0.0.1:5311/${page}`);
await p.waitForTimeout(1500);
const input = p.locator('input.search, input[type="search"], input').first();
await input.click();
await input.type(query, { delay: 40 });
await p.waitForTimeout(1500);
await p.addStyleTag({ content: '*{scrollbar-width:none!important} *::-webkit-scrollbar{display:none}' });
await p.mouse.move(1, 1);
const clip = process.env.CLIP ? JSON.parse(process.env.CLIP) : undefined; await p.screenshot({ path: out, clip, omitBackground: !!process.env.TRANSPARENT });
console.log(await p.evaluate(() => document.body.innerText.slice(0, 1500)));
await browser.close();
