import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export async function loadConfig() {
  loadDotEnv();

  const configPath = resolve(process.env.APPNOW_CONFIG ?? './appnow.config.json');
  const raw = await readFile(configPath, 'utf8');
  const config = JSON.parse(raw);

  if (!Array.isArray(config.collections) || config.collections.length === 0) {
    throw new Error('appnow.config.json must define at least one collection.');
  }

  return {
    ...config,
    paths: {
      configPath,
      outputDir: resolve(process.env.APPNOW_OUTPUT_DIR ?? './data/exports')
    },
    runtime: {
      dryRun: process.env.APPNOW_DRY_RUN !== 'false'
    }
  };
}

function loadDotEnv() {
  try {
    const envPath = resolve('.env');
    const text = readFileSync(envPath, 'utf8');
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env is optional; CI or shell env can provide everything.
  }
}
