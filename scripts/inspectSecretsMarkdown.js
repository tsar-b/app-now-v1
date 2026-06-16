import { readFile } from 'node:fs/promises';

const source = process.argv[2];
if (!source) {
  console.error('Usage: node scripts/inspectSecretsMarkdown.js /path/to/secrets.md');
  process.exit(1);
}

const text = await readFile(source, 'utf8');
const lines = text.split('\n');

for (let index = 0; index < lines.length; index += 1) {
  const line = lines[index];
  if (!/mongo|supabase|api|jwt|token|key|url|service|role/i.test(line)) continue;

  const redacted = line
    .replace(/https?:\/\/[^\s`'"]+/gi, '<URL>')
    .replace(/eyJ[A-Za-z0-9._-]+/g, '<JWT>')
    .replace(/[A-Za-z0-9_-]{32,}/g, '<TOKEN>')
    .replace(/([=:|])\s*([^|\s`'"]{8,})/g, '$1 <REDACTED>');

  console.log(`${index + 1}: ${redacted}`);
}
