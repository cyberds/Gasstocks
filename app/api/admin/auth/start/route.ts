import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { createOtp, discardOtp, isAuthorized, masterEmail, normalizeEmail, OTP_TTL_MS } from '../../../../../lib/server/admin-auth';
import { clientIp, rateLimit } from '../../../../../lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Step 1 of login: decide how this email signs in, and send a code if needed. */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`admin:start:${ip}`, 10);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many sign-in attempts. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === 'string' ? normalizeEmail(body.email) : '';
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  if (email === masterEmail()) {
    return NextResponse.json({ method: 'password' });
  }

  let authorized: boolean;
  try {
    authorized = await isAuthorized(email);
  } catch (err) {
    console.error('[admin-auth] could not check authorized emails', err);
    return NextResponse.json(
      { error: 'Sign-in is unavailable because of a technical fault (database unreachable). Please report this to the site administrator.' },
      { status: 503 },
    );
  }
  if (!authorized) {
    return NextResponse.json({ error: 'This email is not authorized to access the admin dashboard.' }, { status: 403 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ADMIN_FROM_EMAIL ?? process.env.CONTACT_FROM_EMAIL ?? 'Gasstocks admin <onboarding@resend.dev>';
  if (!apiKey) {
    console.error('[admin-auth] RESEND_API_KEY is not set — sign-in code was NOT sent', { email });
    return NextResponse.json(
      { error: 'We could not send your sign-in code because of a technical fault (email service not configured). Please report this to the site administrator.' },
      { status: 503 },
    );
  }

  let code: string;
  try {
    code = await createOtp(email);
  } catch (err) {
    console.error('[admin-auth] could not store sign-in code', err);
    return NextResponse.json(
      { error: 'Sign-in is unavailable because of a technical fault (database unreachable). Please report this to the site administrator.' },
      { status: 503 },
    );
  }

  const minutes = OTP_TTL_MS / 60000;
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: email,
      subject: `Your Gasstocks admin sign-in code: ${code}`,
      text: `Your sign-in code is ${code}. It expires in ${minutes} minutes.\n\nIf you did not try to sign in, you can ignore this email.`,
      html: `<p style="font-family:sans-serif">Your Gasstocks admin sign-in code is:</p>
<p style="font-family:monospace;font-size:28px;letter-spacing:6px"><strong>${code}</strong></p>
<p style="font-family:sans-serif;color:#666">It expires in ${minutes} minutes. If you did not try to sign in, you can ignore this email.</p>`,
    });
    if (error) throw error;
  } catch (err) {
    console.error('[admin-auth] email provider failed to send sign-in code', { email, err });
    await discardOtp(email).catch(() => {});
    return NextResponse.json(
      { error: 'We could not send your sign-in code because of a technical fault with our email service. This is not a problem with your email address — please try again later or report it to the site administrator.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ method: 'otp' });
}
