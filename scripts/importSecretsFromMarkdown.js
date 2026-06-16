import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const SOURCE = process.argv[2];
const TARGET = resolve(process.argv[3] ?? '.env');

const KEY_ALIASES = new Map([
  ['MONGO_API_BASE_URL', 'MONGO_API_BASE_URL'],
  ['MONGODB_API_BASE_URL', 'MONGO_API_BASE_URL'],
  ['MONGO_API_URL', 'MONGO_API_BASE_URL'],
  ['MONGODB_API_URL', 'MONGO_API_BASE_URL'],
  ['API_BASE_URL', 'MONGO_API_BASE_URL'],
  ['MONGO_URI', 'MONGO_URI'],
  ['MONGODB_URI', 'MONGO_URI'],
  ['MONGO_DATABASE', 'MONGO_DATABASE'],
  ['MONGODB_DATABASE', 'MONGO_DATABASE'],
  ['MONGO_API_TOKEN', 'MONGO_API_TOKEN'],
  ['MONGODB_API_TOKEN', 'MONGO_API_TOKEN'],
  ['ADMIN_JWT', 'MONGO_API_TOKEN'],
  ['ADMIN_TOKEN', 'MONGO_API_TOKEN'],
  ['JWT', 'MONGO_API_TOKEN'],
  ['SUPABASE_URL', 'SUPABASE_URL'],
  ['SUPABASE_PROJECT_URL', 'SUPABASE_URL'],
  ['SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
  ['SUPABASE_SERVICE_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
  ['SUPABASE_KEY', 'SUPABASE_SERVICE_ROLE_KEY']
]);

if (!SOURCE) {
  console.error('Usage: node scripts/importSecretsFromMarkdown.js /path/to/secrets.md [.env]');
  process.exit(1);
}

const text = await readFile(SOURCE, 'utf8');
const values = new Map();

for (const line of text.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;

  const parsed = parseLine(trimmed);
  if (!parsed) continue;

  const canonical = KEY_ALIASES.get(normalizeKey(parsed.key));
  if (canonical && parsed.value) {
    values.set(canonical, stripQuotes(parsed.value));
  }
}

const defaults = {
  APPNOW_CONFIG: './appnow.config.json',
  APPNOW_OUTPUT_DIR: './data/exports',
  APPNOW_DRY_RUN: 'true'
};

const orderedKeys = [
  'APPNOW_CONFIG',
  'APPNOW_OUTPUT_DIR',
  'MONGO_URI',
  'MONGO_DATABASE',
  'MONGO_API_BASE_URL',
  'MONGO_API_TOKEN',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'APPNOW_DRY_RUN'
];

const lines = orderedKeys.map((key) => `${key}=${values.get(key) ?? defaults[key] ?? ''}`);
await writeFile(TARGET, `${lines.join('\n')}\n`, 'utf8');

const found = orderedKeys.filter((key) => values.has(key));
const missing = orderedKeys.filter((key) => !values.has(key) && !defaults[key]);

console.log(`Imported ${found.length} sensitive value(s) into ${TARGET}.`);
console.log(`Found keys: ${found.join(', ') || 'none'}`);
console.log(`Missing keys: ${missing.join(', ') || 'none'}`);

function parseLine(line) {
  const table = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/);
  if (table) return { key: table[1], value: table[2] };

  const equals = line.match(/^`?([A-Za-z0-9_ -]+)`?\s*=\s*(.+)$/);
  if (equals) return { key: equals[1], value: equals[2] };

  const colon = line.match(/^(?:[-*]\s*)?`?([A-Za-z0-9_ -]+)`?\s*:\s*(.+)$/);
  if (colon) return { key: colon[1], value: colon[2] };

  return null;
}

function normalizeKey(key) {
  return String(key).trim().toUpperCase().replaceAll(' ', '_').replaceAll('-', '_');
}

function stripQuotes(value) {
  return String(value).trim().replace(/^['"`]/, '').replace(/['"`]$/, '');
}
