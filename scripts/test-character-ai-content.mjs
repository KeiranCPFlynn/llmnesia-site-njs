import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const names=fs.readdirSync(path.join(root,'content/blog')).filter(n=>n.includes('character-ai'));
for(const name of names){
 const slug=name.replace(/\.mdx$/,'');
 const html=fs.readFileSync(path.join(root,'out/blog',slug+'.html'),'utf8');
 const visible=html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'').replace(/<[^>]*>/g,' ');
 assert.match(visible,/Updated.*22 Oct 2026/);
 assert.match(visible,/Current status, checked October 22, 2026/);
 assert.match(visible,/Optional encrypted Vault sync/);
 assert.doesNotMatch(visible,/Skip the manual export|so you always own a copy|indexes every Character\.AI|No account\. No cloud\./);
 assert.doesNotMatch(visible,/\u2014/);
 assert.ok(html.includes('56967715028891-How-do-I-download-my-data'));
 assert.ok(html.includes('2026-10-22T00:00:00.000Z'));
}
const exportPage=fs.readFileSync(path.join(root,'out/blog/how-to-export-character-ai-conversation-history.html'),'utf8');
assert.ok(exportPage.includes('not included in the Chrome Web Store version'));
assert.ok(exportPage.includes('3 to 4 weeks'));
assert.ok(exportPage.includes('7 days'));
console.log(`Character.AI rendered content checks passed for ${names.length} existing guide URLs.`);
