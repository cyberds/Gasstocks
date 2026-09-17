import 'server-only';

import { MongoClient, type Db } from 'mongodb';

import { ensureSrvResolvable } from './mongo-dns.mjs';

/* One client per process. In dev, Next re-evaluates modules on every HMR
   reload, so the promise is parked on globalThis or each save would open a new
   connection pool until Atlas starts refusing connections. */
const g = globalThis as unknown as { __gsMongo?: Promise<MongoClient>; __gsIndexes?: Promise<void> };

function uri() {
  const value = process.env.MONGODB_URI;
  if (!value) {
    throw new Error('[mongodb] MONGODB_URI is not set — add it to .env.local (and to the Vercel project settings).');
  }
  return value;
}

function clientPromise() {
  if (!g.__gsMongo) {
    const value = uri();
    const client = new MongoClient(value, { serverSelectionTimeoutMS: 8000 });
    g.__gsMongo = ensureSrvResolvable(value).then(() => client.connect()).catch((err) => {
      /* Don't cache a failed connection — the next request should retry
         rather than inherit the old rejection forever. */
      g.__gsMongo = undefined;
      console.error('[mongodb] connection failed', err);
      throw err;
    });
  }
  return g.__gsMongo;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise();
  const db = client.db(process.env.MONGODB_DB || 'gasstocks');
  if (!g.__gsIndexes) {
    g.__gsIndexes = ensureIndexes(db).catch((err) => {
      g.__gsIndexes = undefined;
      console.error('[mongodb] index creation failed', err);
      throw err;
    });
  }
  await g.__gsIndexes;
  return db;
}

/** Idempotent — createIndex is a no-op when the index already exists. */
async function ensureIndexes(db: Db) {
  await Promise.all([
    db.collection('portfolios').createIndex({ slug: 1 }, { unique: true }),
    db.collection('portfolios').createIndex({ order: 1, createdAt: -1 }),
    db.collection('authorized_emails').createIndex({ email: 1 }, { unique: true }),
    // Expired codes are removed by Mongo itself.
    db.collection('admin_otps').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection('admin_otps').createIndex({ email: 1 }, { unique: true }),
  ]);
}
