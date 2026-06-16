import { MongoClient } from 'mongodb';
import { log } from '../lib/logger.js';

let cachedClient = null;

export async function fetchMongoDbCollection(config, collection) {
  const client = await getClient(config);
  const databaseName = getDatabaseName(config);
  const collectionName = collection.mongoCollection ?? collection.name;
  const query = collection.mongoQuery ?? {};
  const limit = Number(collection.limit ?? 0);

  log.info(`Fetching ${collection.name} from MongoDB ${databaseName}.${collectionName}`);

  const cursor = client
    .db(databaseName)
    .collection(collectionName)
    .find(query);

  if (limit > 0) cursor.limit(limit);

  return cursor.toArray();
}

export async function closeMongoDbConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
  }
}

async function getClient(config) {
  if (cachedClient) return cachedClient;

  const uriEnv = config.source?.uriEnv ?? 'MONGO_URI';
  const uri = process.env[uriEnv];
  if (!uri) throw new Error(`Missing required environment variable: ${uriEnv}`);

  cachedClient = new MongoClient(uri);
  await cachedClient.connect();
  return cachedClient;
}

function getDatabaseName(config) {
  if (process.env.MONGO_DATABASE) return process.env.MONGO_DATABASE;
  if (config.source?.database) return config.source.database;

  const uri = process.env[config.source?.uriEnv ?? 'MONGO_URI'];
  const parsed = new URL(uri);
  const pathDatabase = decodeURIComponent(parsed.pathname.replace(/^\//, '').split('/')[0] ?? '');
  if (pathDatabase) return pathDatabase;

  throw new Error('Missing Mongo database name. Set MONGO_DATABASE or source.database.');
}
