import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { closeSourceConnections, fetchSourceCollection } from '../connectors/source.js';
import { filterApproved } from '../transform/approval.js';
import { transformRecords } from '../transform/recordTransformer.js';
import { assertValidTransformedRecords } from '../validation/recordValidator.js';
import { log } from '../lib/logger.js';

export async function runExport(config) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputDir = join(config.paths.outputDir, timestamp);
  await mkdir(outputDir, { recursive: true });

  const manifest = {
    createdAt: new Date().toISOString(),
    collections: []
  };

  try {
    for (const collection of config.collections) {
      const raw = await fetchSourceCollection(config, collection);
      const approved = filterApproved(raw, collection);
      const transformed = transformRecords(approved, collection);
      assertValidTransformedRecords(collection, transformed);

      await writeJson(join(outputDir, `${collection.name}.raw.json`), raw);
      await writeJson(join(outputDir, `${collection.name}.approved.json`), approved);
      await writeJson(join(outputDir, `${collection.name}.supabase.json`), transformed);

      manifest.collections.push({
        name: collection.name,
        supabaseTable: collection.supabaseTable,
        rawCount: raw.length,
        approvedCount: approved.length,
        transformedCount: transformed.length,
        requiredFields: collection.requiredFields ?? [],
        files: {
          raw: `${collection.name}.raw.json`,
          approved: `${collection.name}.approved.json`,
          supabase: `${collection.name}.supabase.json`
        }
      });

      log.info(`${collection.name}: raw=${raw.length}, approved=${approved.length}, transformed=${transformed.length}`);
    }
  } finally {
    await closeSourceConnections(config);
  }

  await writeJson(join(outputDir, 'manifest.json'), manifest);
  log.info(`Export complete: ${outputDir}`);
  return { outputDir, manifest };
}

async function writeJson(path, data) {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}
