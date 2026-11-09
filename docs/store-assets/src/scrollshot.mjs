import { createRequire } from 'node:module';
import { CORPUS } from './corpus.mjs';
const require = createRequire('/Users/Kdog/Code-Projects/firecrawl-ctf/node_modules/');
const { chromium } = require('playwright');
const [url, out, w, h, extra, text, offset='0'] = process.argv.slice(2);
const demo = Object.assign({ corpus: CORPUS, stats: { conversations: 5176, messages: 148230 },
  platformCounts: { chatgpt: 2140, claude: 1580, gemini: 612, google_ai_mode: 318, character_ai: 266 } }, JSON.parse(extra||'{}'));
const b = await chromium.launch(); const p = await (await b.newContext({ viewport:{width:+w,height:+h}, deviceScaleFactor:2 })).newPage();
await p.addInitScript(`window.__DEMO = ${JSON.stringify(demo)};`);
await p.goto('http://127.0.0.1:5311/'+url); await p.waitForTimeout(2000);
await p.addStyleTag({ content: '*{scrollbar-width:none!important} *::-webkit-scrollbar{display:none}' });
if (text) await p.evaluate(([t,off]) => {
  const el=[...document.querySelectorAll('body *')].filter(e=>e.offsetParent&&e.children.length===0&&(e.textContent||'').trim()===t)[0];
  el.scrollIntoView({block:'start'}); let s=el.parentElement; while(s&&s.scrollHeight<=s.clientHeight) s=s.parentElement; (s||document.scrollingElement).scrollTop-=+off;
}, [text, offset]);
await p.waitForTimeout(400); await p.mouse.move(1,1);
const clip = process.env.CLIP ? JSON.parse(process.env.CLIP) : undefined;
await p.screenshot({ path: out, clip }); await b.close();
