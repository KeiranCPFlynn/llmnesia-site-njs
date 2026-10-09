import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inlineMarkupTokens, translationSource } from '../lib/site-copy.js';
import { SITE_LANGUAGES } from '../lib/site-language.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'content/locales/en.json');
const language = process.argv.find(arg => arg.startsWith('--language='))?.split('=')[1] || 'de';
const config = SITE_LANGUAGES.find(item => item.code === language && item.code !== 'en');
if (!config) throw new Error('Select a registered non-English site language with --language=CODE.');
const targetPath = path.join(root, `content/locales/${language}.json`);
const recordPath = path.join(root, `content/locales/${language}.translation.json`);
const hash = (text) => createHash('sha256').update(text).digest('hex');
const optionalJson = async (filename) => {
  try { return JSON.parse(await fs.readFile(filename, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return {}; throw error; }
};

const source = Object.fromEntries(Object.entries(JSON.parse(await fs.readFile(sourcePath, 'utf8'))).map(([id, text]) => [id, translationSource(id, text, language)]));
const target = await optionalJson(targetPath);
const record = await optionalJson(recordPath);
const pending = Object.entries(source).filter(([id, text]) => !target[id] || record.entries?.[id]?.sourceHash !== hash(text));
const characters = pending.reduce((count, [, text]) => count + [...text].length, 0);
console.log(JSON.stringify({ pendingStrings: pending.length, sourceCharacters: characters, maximumCharacters: 25000 }));
if (process.argv.includes('--dry-run') || pending.length === 0) process.exit(0);
if (characters > 25000) throw new Error('Translation exceeds the bounded 25,000-character batch. Reduce the scope before running.');

try { process.loadEnvFile(path.join(root, '.env.local')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const apiKey = process.env.DEEPL_AUTH_KEY || process.env.DEEPL_API_KEY;
if (!apiKey) throw new Error('Add DEEPL_AUTH_KEY to the ignored .env.local file. Never use a NEXT_PUBLIC_ key.');
const origin = process.env.DEEPL_API_URL || (apiKey.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com');
if (!['https://api-free.deepl.com', 'https://api.deepl.com'].includes(origin)) throw new Error('DEEPL_API_URL must be an official DeepL API origin.');
const headers = { Authorization: `DeepL-Auth-Key ${apiKey}`, 'Content-Type': 'application/json' };
async function request(endpoint, body) {
  const response = await fetch(`${origin}/v2/${endpoint}`, {
    method: body ? 'POST' : 'GET', headers, redirect: 'error',
    ...(body && { body: JSON.stringify(body) }), signal: AbortSignal.timeout(45000)
  });
  // Never print response bodies, request headers, or keys on errors.
  if (!response.ok) throw new Error(`DeepL ${endpoint} returned HTTP ${response.status}. No automatic retry was made.`);
  return response.json();
}

const usage = await request('usage');
if (!Number.isFinite(usage.character_count) || !Number.isFinite(usage.character_limit)) throw new Error('DeepL did not return a usable character allowance.');
const remaining = usage.character_limit - usage.character_count;
console.log(JSON.stringify({ remainingCharacters: remaining, requestedCharacters: characters }));
if (characters > remaining) throw new Error('Not enough existing DeepL character allowance. No translation was submitted.');

const context = `LLMnesia is a browser extension for Chrome and Microsoft Edge. Translate this public product website from English to natural ${config.label}, using a consistent informal singular tone. Free local search stores chat content and its index in the browser on the user's device. Vault is the unchanged brand name of an optional PAID service for end-to-end encrypted backup and sync; do not confuse it with free local search. The application interface and payment pages remain in English. This translation must not imply semantic search in the target language or cross-language search is guaranteed. Preserve brand names, URLs and keyboard shortcuts. ${language === 'de' ? 'German terminology: search index = Suchindex; chat history = Chatverlauf; backup = Sicherung; end-to-end encrypted = Ende-zu-Ende-verschlüsselt.' : language === 'es' ? 'Use international Spanish understandable in Spain and Latin America, informal singular tú, without vosotros or regional idioms. Keep Vault, Ask Vault, Google AI Mode, browser permission names and product brands unchanged.' : 'Use consistent technical terminology in the target language.'}`;
const entries = record.entries || {};
for (let start = 0; start < pending.length; start += 40) {
  const batch = pending.slice(start, start + 40);
  const result = await request('translate', {
    text: batch.map(([, text]) => text), source_lang: 'EN', target_lang: language.toUpperCase(),
    formality: 'prefer_less', model_type: 'prefer_quality_optimized', context,
    preserve_formatting: true, tag_handling: 'html', ignore_tags: ['svg', 'kbd'], show_billed_characters: true
  });
  if (!Array.isArray(result.translations) || result.translations.length !== batch.length || result.translations.some((item) => !item.text?.trim())) {
    throw new Error('DeepL returned an incomplete translation batch. No automatic retry was made.');
  }
  batch.forEach(([id, text], index) => {
    const translated = result.translations[index];
    target[id] = translated.text;
    // Save drafts even when DeepL moves inline tags. Review repairs the markup;
    // export checks reject changed tags or unreviewed text before publication.
    const needsMarkupReview = JSON.stringify(inlineMarkupTokens(text)) !== JSON.stringify(inlineMarkupTokens(translated.text));
    entries[id] = { sourceHash: hash(text), machineHash: hash(translated.text), model: translated.model_type_used || 'not-reported', billedCharacters: translated.billed_characters ?? null, needsMarkupReview, translatedAt: new Date().toISOString() };
  });
  const orderedTarget = Object.fromEntries(Object.keys(source).filter((id) => target[id]).map((id) => [id, target[id]]));
  const orderedEntries = Object.fromEntries(Object.keys(source).filter((id) => entries[id]).map((id) => [id, entries[id]]));
  // Save each completed batch so a later run resumes without re-translating it.
  await fs.writeFile(targetPath, `${JSON.stringify(orderedTarget, null, 2)}\n`);
  await fs.writeFile(recordPath, `${JSON.stringify({ provider: 'DeepL', sourceLanguage: 'EN', targetLanguage: language.toUpperCase(), review: 'Machine draft; review required after translation updates.', entries: orderedEntries }, null, 2)}\n`);
  console.log(`Saved translated strings ${start + 1}–${start + batch.length}.`);
}
