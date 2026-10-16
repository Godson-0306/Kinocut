import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;

const globalForMongo = globalThis as unknown as { mongo?: Promise<MongoClient>; indexes?: Promise<void> };

export async function db(): Promise<Db> {
  if (!uri) throw new Error("MongoDB is not configured");
  if (!globalForMongo.mongo) {
    globalForMongo.mongo = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 }).connect().catch((error: unknown) => {
      globalForMongo.mongo = undefined;
      throw error;
    });
  }
  const database = (await globalForMongo.mongo).db("kinocut");
  globalForMongo.indexes ??= ensureIndexes(database).catch((error: unknown) => {
    globalForMongo.indexes = undefined;
    throw error;
  });
  await globalForMongo.indexes;
  return database;
}

async function ensureIndexes(database: Db) {
  await database.collection("users").createIndex({ email: 1 }, { unique: true });
  await database.collection("bays").createIndex({ txRef: 1 }, { unique: true });
  await database.collection("bays").createIndex({ userId: 1 });
  await database.collection("requests").createIndex({ bayId: 1, position: 1 });
  await database.collection("notes").createIndex({ requestId: 1, createdAt: 1 });
}
