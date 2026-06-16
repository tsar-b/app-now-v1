import { fetchCollection as fetchMongoApiCollection } from './mongoApi.js';
import { closeMongoDbConnection, fetchMongoDbCollection } from './mongoDb.js';

export async function fetchSourceCollection(config, collection) {
  if (getSourceKind(config) === 'mongodb') {
    return fetchMongoDbCollection(config, collection);
  }

  return fetchMongoApiCollection(config, collection);
}

export async function closeSourceConnections(config) {
  if (getSourceKind(config) === 'mongodb') {
    await closeMongoDbConnection();
  }
}

export function getSourceKind(config) {
  const kind = String(config.source?.kind ?? '').toLowerCase();
  if (kind === 'mongo' || kind === 'mongodb') return 'mongodb';
  if (kind === 'api' || kind === 'http') return 'api';

  if (process.env.MONGO_URI && !process.env.MONGO_API_BASE_URL) {
    return 'mongodb';
  }

  return 'api';
}
