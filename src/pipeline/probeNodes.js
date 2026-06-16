import { closeSourceConnections, fetchSourceCollection, getSourceKind } from '../connectors/source.js';
import { probeSupabaseTable } from '../connectors/supabaseRest.js';
import { log } from '../lib/logger.js';

export async function probeNodes(config) {
  log.info(`Probing ${getSourceKind(config)} source nodes...`);
  try {
    for (const collection of config.collections) {
      const records = await fetchSourceCollection(config, collection);
      log.info(`Source ${collection.name}: reachable, records=${records.length}`);
    }
  } finally {
    await closeSourceConnections(config);
  }

  log.info('Probing Supabase target nodes...');
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    log.warn('Skipping Supabase target probe: SUPABASE_SERVICE_ROLE_KEY is not set.');
    log.info('Probe complete with Supabase skipped.');
    return;
  }

  for (const collection of config.collections) {
    const result = await probeSupabaseTable(collection);
    log.info(`Target ${collection.supabaseTable}: reachable, sampleRows=${result.sampleRows}`);
  }

  log.info('Probe complete.');
}
