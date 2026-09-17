/* One-off migration: moves the track record that used to be hard-coded in
 * lib/portfolio.ts (snapshot in tools/legacy-portfolio.json) into MongoDB,
 * uploading every image from public/ to Cloudinary.
 *
 *   npm run migrate:portfolio            # skips projects already in the database
 *   npm run migrate:portfolio -- --force # replaces them (re-uploads images)
 *
 * Safe to re-run: image public IDs are deterministic, so a re-upload overwrites
 * rather than duplicates, and existing projects are skipped by default.
 * The local image files are left in place — other pages still use some of them.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { v2 as cloudinary } from 'cloudinary';
import { MongoClient } from 'mongodb';

import { ensureSrvResolvable } from '../lib/server/mongo-dns.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FOLDER = 'gasstocks/portfolio';
const force = process.argv.includes('--force');

function requireEnv(...names) {
  const missing = names.filter((n) => !process.env[n]);
  if (missing.length) {
    console.error(`Missing environment variables: ${missing.join(', ')} (set them in .env.local)`);
    process.exit(1);
  }
}
requireEnv('MONGODB_URI', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const legacy = JSON.parse(await readFile(path.join(ROOT, 'tools/legacy-portfolio.json'), 'utf8'));
const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

let failed = false;
try {
  await ensureSrvResolvable(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db(process.env.MONGODB_DB || 'gasstocks').collection('portfolios');
  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ order: 1, createdAt: -1 });

  for (const [index, p] of legacy.entries()) {
    const existing = await col.findOne({ slug: p.slug });
    if (existing && !force) {
      console.log(`• ${p.slug}: already in database, skipped`);
      continue;
    }

    console.log(`• ${p.slug}: uploading ${p.images.length} image(s)…`);
    const images = [];
    for (const [i, src] of p.images.entries()) {
      const file = path.join(ROOT, 'public', decodeURIComponent(src));
      const base = path.basename(file, path.extname(file)).replace(/[^\w-]+/g, '-').replace(/-+$/, '');
      const res = await cloudinary.uploader.upload(file, {
        public_id: `${String(i + 1).padStart(2, '0')}-${base}`,
        folder: `${FOLDER}/${p.slug}`,
        overwrite: true,
        resource_type: 'image',
      });
      images.push({ url: res.secure_url, publicId: res.public_id });
      console.log(`    ✓ ${src}`);
    }

    const now = new Date();
    const { images: _old, ...fields } = p;
    await col.updateOne(
      { slug: p.slug },
      {
        $set: { ...fields, images, order: index, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );
    console.log(`  saved ${p.slug}`);
  }
  console.log(`\nDone. ${await col.countDocuments()} project(s) in the database.`);
} catch (err) {
  failed = true;
  console.error('\nMigration failed:', err);
} finally {
  await client.close();
}
process.exit(failed ? 1 : 0);
