import { getMongoClient } from './mongoClient';

export async function countLegacyCollections(database: string, collections: string[]) {
  const client = await getMongoClient();
  const db = client.db(database);

  const counts: Record<string, number> = {};
  for (const collection of collections) {
    counts[collection] = await db.collection(collection).estimatedDocumentCount();
  }
  return counts;
}
