import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { upsertIntoSupabase } from '../connectors/supabaseRest.js';
import { assertValidTransformedRecords } from '../validation/recordValidator.js';
import { log } from '../lib/logger.js';

export async function runUpload(config, outputDir = null) {
  const selectedDir = outputDir ?? await findLatestExportDir(config.paths.outputDir);
  const results = [];

  for (const collection of config.collections) {
    const file = join(selectedDir, `${collection.name}.supabase.json`);
    const records = JSON.parse(await readFile(file, 'utf8'));
    assertValidTransformedRecords(collection, records);

    const result = await upsertIntoSupabase(collection, records, {
      dryRun: config.runtime.dryRun
    });
    results.push({ collection: collection.name, ...result });
  }

  log.info(`Upload complete from ${selectedDir}`);
  return results;
}

async function findLatestExportDir(baseDir) {
  const entries = await readdir(baseDir, { withFileTypes: true });
  const dirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  if (dirs.length === 0) {
    throw new Error('No export directories found. Run npm run export first.');
  }

  return join(baseDir, dirs.at(-1));
}
