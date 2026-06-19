import { getMongoClient } from './mongoClient';

export async function exportLegacyCollection(database: string, collection: string, query = {}) {
  const client = await getMongoClient();
  return client.db(database).collection(collection).find(query).toArray();
}
