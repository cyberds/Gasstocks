import 'server-only';

import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ObjectId } from 'mongodb';

import { getDb } from './mongodb';

export const SESSION_COOKIE = 'gs_admin';
const SESSION_TTL_S = 60 * 60 * 12; // 12 hours
export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;

export interface AuthorizedEmailDoc {
  _id: ObjectId;
  email: string;
  addedBy: string;
  createdAt: Date;
}

interface OtpDoc {
  email: string;
  codeHash: string;
  attempts: number;
  expiresAt: Date;
}

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error('[admin-auth] ADMIN_SESSION_SECRET must be set to a random string of at least 32 characters.');
  }
  return s;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function masterEmail() {
  const m = process.env.ADMIN_MASTER_EMAIL;
  return m ? normalizeEmail(m) : null;
}

function hmac(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url');
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  // Compare against itself on length mismatch so timing doesn't leak length.
  return ab.length === bb.length ? timingSafeEqual(ab, bb) : (timingSafeEqual(ab, ab), false);
}

export function checkMasterPassword(password: string) {
  const expected = process.env.ADMIN_MASTER_PASSWORD;
  if (!expected) return false;
  // Hash both sides so the comparison is fixed-length.
  return safeEqual(hmac(`pw:${password}`), hmac(`pw:${expected}`));
}

// ── authorized emails ────────────────────────────────────────────────────

export async function authorizedEmails() {
  return (await getDb()).collection<AuthorizedEmailDoc>('authorized_emails');
}

export async function isAuthorized(email: string) {
  const e = normalizeEmail(email);
  if (e === masterEmail()) return true;
  return (await (await authorizedEmails()).countDocuments({ email: e }, { limit: 1 })) > 0;
}

// ── one-time codes ───────────────────────────────────────────────────────

export async function createOtp(email: string) {
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const db = await getDb();
  await db.collection<OtpDoc>('admin_otps').updateOne(
    { email },
    { $set: { email, codeHash: hmac(`otp:${email}:${code}`), attempts: 0, expiresAt: new Date(Date.now() + OTP_TTL_MS) } },
    { upsert: true },
  );
  return code;
}

export async function discardOtp(email: string) {
  await (await getDb()).collection<OtpDoc>('admin_otps').deleteOne({ email });
}

export type OtpResult = 'ok' | 'invalid' | 'expired' | 'locked';

export async function verifyOtp(email: string, code: string): Promise<OtpResult> {
  const col = (await getDb()).collection<OtpDoc>('admin_otps');
  const doc = await col.findOne({ email });
  if (!doc || doc.expiresAt.getTime() < Date.now()) return 'expired';
  if (doc.attempts >= OTP_MAX_ATTEMPTS) {
    await col.deleteOne({ email });
    return 'locked';
  }
  if (!safeEqual(doc.codeHash, hmac(`otp:${email}:${code.trim()}`))) {
    await col.updateOne({ email }, { $inc: { attempts: 1 } });
    return 'invalid';
  }
  await col.deleteOne({ email }); // single use
  return 'ok';
}

// ── sessions ─────────────────────────────────────────────────────────────
// Stateless signed cookie: base64url(json).signature. Authorization is
// re-checked against the database on every request, so removing an email from
// the list revokes that person's access immediately.

export async function createSession(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_S })).toString('base64url');
  const jar = await cookies();
  jar.set(SESSION_COOKIE, `${payload}.${hmac(`session:${payload}`)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_S,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getAdmin(): Promise<{ email: string; isMaster: boolean } | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split('.');
  if (!payload || !sig || !safeEqual(sig, hmac(`session:${payload}`))) return null;
  let data: { email?: string; exp?: number };
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (!data.email || !data.exp || data.exp < Date.now() / 1000) return null;
  if (!(await isAuthorized(data.email))) return null;
  return { email: data.email, isMaster: data.email === masterEmail() };
}

/** For server components and server actions. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect('/admin/login');
  return admin;
}
