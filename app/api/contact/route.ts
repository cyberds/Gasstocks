import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { COMPANY } from '../../../lib/company';
import { enquirySchema, fieldErrorsOf } from '../../../lib/enquiry';
import { clientIp, rateLimit } from '../../../lib/rate-limit';

/* Node runtime, not edge: the Resend SDK expects Node, and this route is not
   latency-critical. */
export const runtime = 'nodejs';
/* Never cached — it is a POST with side effects, but be explicit so no future
   config change starts serving a stale 200. */
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 32 * 1024;

/** Escape before interpolating user input into the HTML email body. */
function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request: Request) {
  /* Two limits, deliberately.
     The loose one guards against someone hammering the endpoint and is checked
     before any work. The strict one is checked only AFTER validation passes,
     further down — because counting validation failures against a five-per-ten
     -minutes budget locks out an ordinary person who makes a few typos, which
     is exactly the wrong user to punish. */
  const ip = clientIp(request.headers);
  const flood = rateLimit(`contact:req:${ip}`, 30);
  if (!flood.ok) {
    return NextResponse.json(
      { error: 'Too many requests from this address. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(flood.retryAfter) } },
    );
  }

  // ── parse ─────────────────────────────────────────────────────────────
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Enquiry is too large.' }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check the highlighted fields.', fields: fieldErrorsOf(parsed.error) },
      { status: 400 },
    );
  }

  const enquiry = parsed.data;

  /* Honeypot: a real browser leaves this empty because the field is hidden.
     Answer 200 so a bot cannot tell it was caught and retune. Nothing is sent. */
  if (enquiry.company_website) {
    return NextResponse.json({ ok: true });
  }

  /* The strict limit: genuine send attempts only, so typos cost nothing. */
  const sends = rateLimit(`contact:send:${ip}`, 5);
  if (!sends.ok) {
    return NextResponse.json(
      { error: 'Too many enquiries from this address. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(sends.retryAfter) } },
    );
  }

  // ── send ──────────────────────────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? COMPANY.email;
  /* Resend will only send from a domain you have verified. Until then,
     onboarding@resend.dev works and delivers to the account owner only. */
  const from = process.env.CONTACT_FROM_EMAIL ?? 'Gasstocks website <onboarding@resend.dev>';

  if (!apiKey) {
    /* Misconfiguration, not a user error. Say so plainly in the log and give
       the visitor a route that still works rather than a silent black hole. */
    console.error('[contact] RESEND_API_KEY is not set — enquiry was NOT delivered', {
      organisation: enquiry.organisation,
      email: enquiry.email,
    });
    return NextResponse.json(
      {
        error: `Our enquiry form is not accepting messages right now. Please email us directly at ${COMPANY.email}.`,
      },
      { status: 503 },
    );
  }

  const subject = `Enquiry — ${enquiry.scope} — ${enquiry.organisation}`;
  const lines: Array<[string, string]> = [
    ['Organisation', enquiry.organisation],
    ['Contact name', enquiry.name],
    ['Email', enquiry.email],
    ['Tender reference', enquiry.reference || '—'],
    ['Scope of enquiry', enquiry.scope],
  ];

  const html = `
    <h2 style="font-family:sans-serif">Website enquiry</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${lines
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc(k)}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`,
        )
        .join('')}
    </table>
    <h3 style="font-family:sans-serif">Brief</h3>
    <p style="font-family:sans-serif;white-space:pre-wrap">${esc(enquiry.brief)}</p>
  `;

  const text = [
    ...lines.map(([k, v]) => `${k}: ${v}`),
    '',
    'Brief:',
    enquiry.brief,
  ].join('\n');

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      /* So a reply in the mail client goes to the enquirer, not to us. */
      replyTo: enquiry.email,
    });

    if (error) {
      console.error('[contact] Resend rejected the message', error);
      return NextResponse.json(
        { error: `We could not send that. Please email us at ${COMPANY.email}.` },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error('[contact] send threw', err);
    return NextResponse.json(
      { error: `We could not send that. Please email us at ${COMPANY.email}.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
