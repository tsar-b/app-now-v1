import { log } from '../lib/logger.js';

export async function fetchCollection(config, collection) {
  const baseUrl = readEnv(config.source?.baseUrlEnv ?? 'MONGO_API_BASE_URL');
  const token = readOptionalEnv(config.source?.tokenEnv ?? 'MONGO_API_TOKEN');
  const url = new URL(collection.sourcePath, baseUrl);

  const headers = { accept: 'application/json' };
  if (token) {
    const header = config.source?.authHeader ?? 'Authorization';
    const prefix = config.source?.authPrefix ?? 'Bearer';
    headers[header] = prefix ? `${prefix} ${token}` : token;
  }

  log.info(`Fetching ${collection.name} from ${url.toString()}`);
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Source API failed for ${collection.name}: ${response.status} ${body}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.items ?? data.data ?? [];
}

function readEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function readOptionalEnv(name) {
  return process.env[name] || '';
}
