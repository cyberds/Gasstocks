import { NextResponse } from 'next/server';

import {
  checkMasterPassword,
  createSession,
  isAuthorized,
  masterEmail,
  normalizeEmail,
  verifyOtp,
} from '../../../../../lib/server/admin-auth';
import { clientIp, rateLimit } from '../../../../../lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Step 2 of login: check the master password or the emailed code. */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`admin:verify:${ip}`, 15);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  const body = (await request.json().catch(() => null)) as { email?: unknown; password?: unknown; code?: unknown } | null;
  const email = typeof body?.email === 'string' ? normalizeEmail(body.email) : '';
  if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 });

  try {
    if (email === masterEmail()) {
      if (typeof body?.password !== 'string' || !checkMasterPassword(body.password)) {
        return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
      }
      await createSession(email);
      return NextResponse.json({ ok: true });
    }

    if (typeof body?.code !== 'string' || !/^\d{6}$/.test(body.code.trim())) {
      return NextResponse.json({ error: 'Enter the 6-digit code from your email.' }, { status: 400 });
    }
    const result = await verifyOtp(email, body.code);
    if (result === 'invalid') return NextResponse.json({ error: 'That code is incorrect.' }, { status: 401 });
    if (result === 'expired') return NextResponse.json({ error: 'That code has expired. Request a new one.' }, { status: 401 });
    if (result === 'locked') return NextResponse.json({ error: 'Too many wrong codes. Request a new one.' }, { status: 401 });

    // The email could have been removed while the code was in flight.
    if (!(await isAuthorized(email))) {
      return NextResponse.json({ error: 'This email is not authorized to access the admin dashboard.' }, { status: 403 });
    }
    await createSession(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin-auth] verification failed with an error', err);
    return NextResponse.json(
      { error: 'Sign-in failed because of a technical fault on our side. Please report this to the site administrator.' },
      { status: 500 },
    );
  }
}
