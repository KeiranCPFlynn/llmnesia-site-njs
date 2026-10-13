import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import matter from 'gray-matter';

const slugs=['search-gemini-conversation-history','how-to-find-old-gemini-conversations','gemini-conversation-history-limits','recover-deleted-gemini-conversation'];
for(const slug of slugs){
  const file=new URL(`../content/blog/${slug}.mdx`,import.meta.url);
  const raw=await readFile(file,'utf8');
  const {data,content}=matter(raw);
  assert.equal(data.slug,slug);
  assert.equal(data.canonicalPath,`/blog/${slug}`);
  assert.equal(data.updatedDate,'2026-10-13');
  assert.ok(data.ctaHeadline && !/every.*ever|instantly/.test(data.ctaHeadline));
  assert.equal(raw.includes('\u2014'),false,`${slug}: em dash`);
  assert.ok(data.sources.some(s=>s.url.includes('16920332')),`${slug}: current export source missing`);
  assert.doesNotMatch(raw,/Gemini has no real history search|This searches by conversation title, not content|Every past chat still lives|doesn't delete from your activity log|Conversations before you installed LLMnesia are not retroactively indexed|\]\(\/install\)/);
  assert.ok(content.includes('indexed') || content.includes('keyword'));
  // Resolve internal blog links so a helpful next step does not become a 404.
  for(const match of content.matchAll(/\]\(\/blog\/([^#)]+)(?:#[^)]*)?\)/g)){
    await readFile(new URL(`../content/blog/${match[1]}.mdx`,import.meta.url),'utf8');
  }
}
const recovery=await readFile(new URL('../content/blog/recover-deleted-gemini-conversation.mdx',import.meta.url),'utf8');
assert.match(recovery,/deleting the chat also deletes its related activity/);
assert.match(recovery,/Installing LLMnesia now cannot recover a chat that it never saved/);
console.log('Gemini guide facts, metadata, CTA scope and internal links passed (4 guides).');
