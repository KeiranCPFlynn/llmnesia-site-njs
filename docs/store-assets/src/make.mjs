// Renders the five 1280x800 store screenshots. UI crops come from capture.mjs /
// scrollshot.mjs (real 0.4.23 build + demo stub). All chat content is invented.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire('/Users/Kdog/Code-Projects/firecrawl-ctf/node_modules/');
const { chromium } = require('playwright');
const dir = path.dirname(fileURLToPath(import.meta.url));
const outDir = process.argv[2] || path.join(dir, 'out');
fs.mkdirSync(outDir, { recursive: true });

const CSS = `
html,body{margin:0;width:1280px;height:800px;overflow:hidden}
body{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Arial,sans-serif;
  background:radial-gradient(1000px 620px at 50% 78%, #1d4f5f 0%, #102a35 55%, #0b1c24 100%);color:#fff;position:relative}
.head{position:absolute;top:58px;left:0;right:0;text-align:center}
h1{margin:0;font-size:60px;font-weight:700;letter-spacing:-1px}
.sub{margin-top:14px;font-size:27px;color:#cfe3ea;font-weight:500}
.card{position:absolute;left:50%;transform:translateX(-50%);border-radius:18px;overflow:hidden;
  box-shadow:0 30px 80px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.08);background:#fffdf6}
.card img{display:block;width:100%;height:100%}
.foot{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:19px;color:#9fc0cb}
.term{position:absolute;left:50%;top:250px;transform:translateX(-50%);width:900px;height:400px;border-radius:14px;background:#0d1117;
  box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.1);font:20px/1.55 "SF Mono",Menlo,monospace;color:#d7e3e8;overflow:hidden}
.term .bar{height:38px;background:#1a222b;display:flex;align-items:center;gap:8px;padding:0 16px}
.term .bar i{width:12px;height:12px;border-radius:50%;background:#3a4652;display:block}
.term pre{margin:0;padding:22px 28px;font:inherit;white-space:pre-wrap}
.you{color:#fff;font-weight:600}.dim{color:#7f97a3}.tool{color:#c5d97f}.hl{color:#fff;font-weight:700}
.pts{position:absolute;left:50%;top:262px;transform:translateX(-50%);width:980px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.pt{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:34px 28px;min-height:300px;box-sizing:border-box}
.pt .ic{width:58px;height:58px;border-radius:14px;background:#c5d97f;color:#13313b;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800}
.pt .ic svg{width:30px;height:30px;stroke:#13313b;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.pt h2{margin:24px 0 12px;font-size:28px;line-height:1.2}
.pt p{margin:0;font-size:21px;line-height:1.45;color:#cfe3ea}
`;
const page = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}</body></html>`;
const head = (h, s) => `<div class="head"><h1>${h}</h1><div class="sub">${s}</div></div>`;
const card = (src, w, h, top = 232) => `<div class="card" style="top:${top}px;width:${w}px;height:${h}px"><img src="${src}"></div>`;
const foot = (t) => `<div class="foot">${t}</div>`;

const SHOTS = {
  '1-search': page(head('Find any old AI chat in seconds', 'ChatGPT, Claude, Gemini, Google AI Mode, Character.AI and more')
    + card('ui-popup-crop.png', 576, 510) + foot('Free · Searches on your device · No account needed')),
  '2-import': page(head('Bring in the chats you already have', 'Import past history from ChatGPT, Claude, Gemini, Google AI Mode, Character.AI and more')
    + card('ui-import-crop.png', 700, 470, 250) + foot('New chats are added automatically after setup')),
  '3-private': page(head('Private by design', 'Your history stays yours')
    + `<div class="pts">
      <div class="pt"><div class="ic"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div><h2>Searched on your device</h2><p>Your chats are indexed inside your browser. Search runs locally.</p></div>
      <div class="pt"><div class="ic"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><h2>No account needed</h2><p>The extension, local search and desktop AI connection are free.</p></div>
      <div class="pt"><div class="ic"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></div><h2>Optional encrypted backup</h2><p>Vault encrypts on your device before upload. Off until you set it up.</p></div>
    </div>`),
  '4-desktop-ai': page(head('Your desktop AI can use them too', 'Connect Claude, Cursor, Codex and more. Answers link back to the original chats.')
    + `<div class="term"><div class="bar"><i></i><i></i><i></i></div><pre><span class="dim">~/trips</span>
<span class="you">› What did I decide about Sintra for the Lisbon trip?</span>

<span class="tool">● LLMnesia · search_conversations</span> <span class="dim">"Lisbon Sintra"</span>
<span class="dim">  3 conversations · Gemini, ChatGPT, Google AI Mode</span>

From your Gemini chat <span class="hl">Lisbon to Sintra day trip by train</span>:
  Train from Rossio, about every 20 minutes, 40 minutes each way.
  <span class="hl">Go early on the Saturday</span>: Pena Palace queues build after 10am.
<span class="dim">  ↗ Open the original chat</span></pre></div>` + foot('Free MCP connection, set up from LLMnesia Settings')),
  '5-setup': page(head('Guided first import', 'Pick the AI you use most. Add the others whenever you like.')
    + `<div class="card" style="top:226px;width:862px;height:520px;background:#fff;padding:24px 0 0;box-sizing:border-box"><img src="ui-onb-crop.png" style="height:auto"></div>`)
};

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
for (const [name, html] of Object.entries(SHOTS)) {
  const f = path.join(dir, `_${name}.html`);
  fs.writeFileSync(f, html);
  await p.goto('file://' + f);
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(outDir, `store-screenshot-${name}.png`) });
  fs.unlinkSync(f);
}
await b.close();
console.log(fs.readdirSync(outDir).join('\n'));
