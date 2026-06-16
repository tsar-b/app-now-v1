import { log } from '../lib/logger.js';

const DEFAULT_BATCH_SIZE = 100;

export async function upsertIntoSupabase(collection, records, options = {}) {
  const supabaseUrl = readEnv('SUPABASE_URL');
  const serviceRoleKey = readEnv('SUPABASE_SERVICE_ROLE_KEY');
  const table = collection.supabaseTable;
  const batchSize = collection.batchSize ?? DEFAULT_BATCH_SIZE;

  if (!table) {
    throw new Error(`Collection ${collection.name} is missing supabaseTable.`);
  }

  if (options.dryRun) {
    log.warn(`Dry run: would upload ${records.length} records to Supabase table ${table}.`);
    return { uploaded: 0, dryRun: true };
  }

  let uploaded = 0;
  for (let index = 0; index < records.length; index += batchSize) {
    const batch = records.slice(index, index + batchSize);
    const url = buildUpsertUrl(supabaseUrl, table, collection);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify(batch)
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Supabase upload failed for ${table}: ${response.status} ${body}`);
    }

    uploaded += batch.length;
    log.info(`Uploaded ${uploaded}/${records.length} records to ${table}`);
  }

  return { uploaded, dryRun: false };
}

function buildUpsertUrl(supabaseUrl, table, collection) {
  const url = new URL(`/rest/v1/${encodeURIComponent(table)}`, supabaseUrl);
  if (collection.onConflict) {
    url.searchParams.set('on_conflict', collection.onConflict);
  }
  return url;
}

function readEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
