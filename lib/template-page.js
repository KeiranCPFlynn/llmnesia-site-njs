import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';

const templateDir = path.join(process.cwd(), 'content');

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!match) {
    throw new Error('Could not find <body> in template HTML.');
  }
  return match[1].trim();
}

export const getTemplateBody = cache((templateName) => {
  const templatePath = path.join(templateDir, templateName);
  const html = fs.readFileSync(templatePath, 'utf8');
  return extractBody(html);
});
