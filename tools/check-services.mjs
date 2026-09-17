/* Verifies every external service the admin dashboard depends on.
 *
 *   npm run check:services
 *
 * Exits non-zero if anything is misconfigured, so it can gate a deploy.
 */
import { v2 as cloudinary } from 'cloudinary';
import { MongoClient } from 'mongodb';

import { ensureSrvResolvable } from '../lib/server/mongo-dns.mjs';

let ok = true;
const pass = (m) => console.log(`✓ ${m}`);
const fail = (m, err) => {
  ok = false;
  console.error(`✗ ${m}${err ? `\n    ${err.message ?? err}` : ''}`);
};

// ── MongoDB ──
if (!process.env.MONGODB_URI) {
  fail('MONGODB_URI is not set');
} else {
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  try {
    await ensureSrvResolvable(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'gasstocks');
    await db.command({ ping: 1 });
    // Round-trip a write so we know the user has readWrite, not just connect.
    const probe = db.collection('_healthcheck');
    await probe.insertOne({ at: new Date() });
    await probe.drop();
    pass(`MongoDB reachable and writable (database "${db.databaseName}", ${await db.collection('portfolios').countDocuments()} project(s))`);
  } catch (err) {
    fail('MongoDB connection or write failed', err);
  } finally {
    await client.close();
  }
}

// ── Cloudinary ──
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  fail('CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET are not all set');
} else {
  cloudinary.config({ cloud_name: CLOUDINARY_CLOUD_NAME, api_key: CLOUDINARY_API_KEY, api_secret: CLOUDINARY_API_SECRET });
  try {
    await cloudinary.api.ping();
    pass('Cloudinary credentials valid');
  } catch (err) {
    fail('Cloudinary ping failed', err.error ?? err);
  }
}

// ── Admin auth ──
if (!process.env.ADMIN_MASTER_EMAIL || !process.env.ADMIN_MASTER_PASSWORD) fail('ADMIN_MASTER_EMAIL and ADMIN_MASTER_PASSWORD must be set');
else if (process.env.ADMIN_MASTER_PASSWORD.length < 12) fail('ADMIN_MASTER_PASSWORD should be at least 12 characters');
else pass('Master admin configured');

if (!process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) fail('ADMIN_SESSION_SECRET must be at least 32 characters');
else pass('Session secret configured');

// ── Email (OTP delivery) ──
if (!process.env.RESEND_API_KEY) fail('RESEND_API_KEY is not set — staff sign-in codes cannot be sent');
else pass('Resend API key present');
if (!process.env.ADMIN_FROM_EMAIL && !process.env.CONTACT_FROM_EMAIL) {
  console.warn('! No ADMIN_FROM_EMAIL/CONTACT_FROM_EMAIL — codes send from onboarding@resend.dev, which only delivers to the Resend account owner');
}

process.exit(ok ? 0 : 1);
