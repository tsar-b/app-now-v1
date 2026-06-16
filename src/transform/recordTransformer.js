import { mapFields } from '../lib/objectPath.js';

export function transformRecords(records, collection) {
  return records.map((record) => {
    const mapped = mapFields(record, collection.mapping);
    return cleanUndefined({
      ...mapped,
      migrated_at: new Date().toISOString(),
      migration_source: collection.name
    });
  });
}

function cleanUndefined(input) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  );
}
