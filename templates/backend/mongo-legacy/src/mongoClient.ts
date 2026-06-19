import { MongoClient } from 'mongodb';

let cachedClient: MongoClient | null = null;

export async function getMongoClient() {
  if (cachedClient) return cachedClient;

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is required for legacy Mongo module');

  cachedClient = new MongoClient(uri);
  await cachedClient.connect();
  return cachedClient;
}

export async function closeMongoClient() {
  if (!cachedClient) return;
  await cachedClient.close();
  cachedClient = null;
}
