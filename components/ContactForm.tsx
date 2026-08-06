'use client';

import { useId, useState } from 'react';

import { COMPANY, DISPLAY } from '../lib/company';
import { SCOPES, enquirySchema, fieldErrorsOf, type FieldErrors } from '../lib/enquiry';

/* Contact section. Markup and inline styles are carried over from the original
   page; what changed in Phase 2 is that the form now actually submits.
   Previously it was inert (onsubmit="return false") with no validation and no
   required fields at all.

   Validation runs client-side for immediate feedback and again in
   app/api/contact/route.ts, which is the copy that counts — both import the
   same schema from lib/enquiry.ts so they cannot drift. */

type Status = { kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; message: string };

const labelStyle = {
  fontSize: '9.5px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  color: 'color-mix(in srgb,var(--color-text) 50%,transparent)',
  marginBottom: '3px',
};

const cellStyle = { background: 'var(--color-bg)', padding: '14px 16px' };

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <div id={id} role="alert" style={{ fontSize: '12px', color: '#b3261e', marginTop: '5px' }}>
      {message}
    </div>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const formId = useId();

  const sending = status.kind === 'sending';

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;

    const parsed = enquirySchema.safeParse(data);
    if (!parsed.success) {
      const fields = fieldErrorsOf(parsed.error);
      setErrors(fields);
      setStatus({ kind: 'error', message: 'Please check the highlighted fields.' });
      // Move focus to the first problem so keyboard and screen-reader users
      // are not left guessing what changed.
      const first = Object.keys(fields)[0];
      if (first) document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus({ kind: 'sending' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (body.fields) setErrors(body.fields);
        setStatus({
          kind: 'error',
          message: body.error ?? 'Something went wrong. Please try again.',
        });
        return;
      }

      setStatus({ kind: 'sent' });
    } catch {
      setStatus({
        kind: 'error',
        message: `We could not reach the server. Please email us at ${COMPANY.email}.`,
      });
    }
  }

  return (
    <section
      id="contact"
      style={{ padding: '96px 32px 104px', borderTop: '1px solid var(--color-divider)' }}
    >
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        <div
          data-gs-cols=""
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}
        >
          <div>
            <div
              style={{
                fontSize: '10.5px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-accent-700)',
                marginBottom: '10px',
              }}
            >
              Enquiries &amp; tenders
            </div>
            <h2 style={{ fontSize: '52px', lineHeight: '1', margin: '0 0 18px', maxWidth: '14ch' }}>
              Send us the scope.
            </h2>
            <p
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                margin: '0 0 30px',
                maxWidth: '44ch',
                color: 'color-mix(in srgb,var(--color-text) 72%,transparent)',
                textWrap: 'pretty',
              }}
            >
              Tender documents, ITTs and prequalification questionnaires are acknowledged within one
              working day and answered by a named engineer.
            </p>
            <div
              style={{
                display: 'grid',
                gap: '1px',
                background: 'var(--color-divider)',
                border: '1px solid var(--color-divider)',
                maxWidth: '440px',
              }}
            >
              <div style={cellStyle}>
                <div style={labelStyle}>Enquiries</div>
                <div style={{ fontSize: '15px' }}>
                  <a href={`mailto:${COMPANY.email}`} style={{ color: 'inherit' }}>
                    {COMPANY.email}
                  </a>
                </div>
              </div>
              <div style={cellStyle}>
                <div style={labelStyle}>Nigeria</div>
                <div style={{ fontSize: '15px' }}>
                  <a href={`tel:${COMPANY.phones.nigeria}`} style={{ color: 'inherit' }}>
                    {DISPLAY.phoneNigeria}
                  </a>
                </div>
              </div>
              <div style={cellStyle}>
                <div style={labelStyle}>United States</div>
                <div style={{ fontSize: '15px' }}>
                  <a href={`tel:${COMPANY.phones.usa}`} style={{ color: 'inherit' }}>
                    {DISPLAY.phoneUsa}
                  </a>
                </div>
              </div>
              {COMPANY.offices.map((office) => (
                <div key={office.label} style={cellStyle}>
                  <div style={labelStyle}>{office.label} office</div>
                  <div style={{ fontSize: '15px' }}>{office.lines.join(', ')}</div>
                </div>
              ))}
              <div style={cellStyle}>
                <div style={labelStyle}>Registration</div>
                <div style={{ fontSize: '15px' }}>{COMPANY.registrationNumber}</div>
              </div>
            </div>
          </div>

          {status.kind === 'sent' ? (
            <div
              className="blueprint"
              role="status"
              style={{ padding: '28px 30px 30px' }}
            >
              <i className="corner tl"></i>
              <i className="corner tr"></i>
              <i className="corner bl"></i>
              <i className="corner br"></i>
              <h3 style={{ fontSize: '26px', lineHeight: '1.1', margin: '0 0 12px' }}>
                Enquiry received.
              </h3>
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: '1.6',
                  margin: '0 0 20px',
                  color: 'color-mix(in srgb,var(--color-text) 72%,transparent)',
                }}
              >
                Thank you — we have your brief and will acknowledge it within one working day. If it
                is urgent, call {DISPLAY.phoneNigeria} or email {COMPANY.email}.
              </p>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setStatus({ kind: 'idle' })}
                style={{ padding: '10px 18px', fontSize: '14px' }}
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form
              className="blueprint"
              style={{ padding: '28px 30px 30px' }}
              onSubmit={onSubmit}
              noValidate
            >
              <i className="corner tl"></i>
              <i className="corner tr"></i>
              <i className="corner bl"></i>
              <i className="corner br"></i>

              {/* Honeypot: hidden from people, irresistible to bots. Not
                  display:none, which some bots skip; off-screen and removed
                  from the tab order and the accessibility tree. */}
              <div
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
              >
                <label htmlFor={`${formId}-cw`}>Company website</label>
                <input
                  id={`${formId}-cw`}
                  name="company_website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}
              >
                <div className="field">
                  <label htmlFor="gs-org">Organisation</label>
                  <input
                    className="input"
                    id="gs-org"
                    name="organisation"
                    type="text"
                    placeholder="Company or agency"
                    required
                    aria-invalid={!!errors.organisation}
                    aria-describedby={errors.organisation ? 'gs-org-err' : undefined}
                  />
                  <FieldError id="gs-org-err" message={errors.organisation} />
                </div>
                <div className="field">
                  <label htmlFor="gs-name">Contact name</label>
                  <input
                    className="input"
                    id="gs-name"
                    name="name"
                    type="text"
                    placeholder="Full name"
                    required
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'gs-name-err' : undefined}
                  />
                  <FieldError id="gs-name-err" message={errors.name} />
                </div>
              </div>

              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}
              >
                <div className="field">
                  <label htmlFor="gs-email">Email</label>
                  <input
                    className="input"
                    id="gs-email"
                    name="email"
                    type="email"
                    placeholder="name@organisation.com"
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'gs-email-err' : undefined}
                  />
                  <FieldError id="gs-email-err" message={errors.email} />
                </div>
                <div className="field">
                  <label htmlFor="gs-ref">Tender reference</label>
                  <input
                    className="input"
                    id="gs-ref"
                    name="reference"
                    type="text"
                    placeholder="Optional"
                    aria-invalid={!!errors.reference}
                  />
                  <FieldError id="gs-ref-err" message={errors.reference} />
                </div>
              </div>

              <div className="field" style={{ marginBottom: '16px' }}>
                <label htmlFor="gs-scope">Scope of enquiry</label>
                <select className="input" id="gs-scope" name="scope" defaultValue={SCOPES[0]}>
                  {SCOPES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="field" style={{ marginBottom: '20px' }}>
                <label htmlFor="gs-msg">Brief</label>
                <textarea
                  className="input"
                  id="gs-msg"
                  name="brief"
                  placeholder="Location, indicative programme, and the disciplines involved."
                  required
                  aria-invalid={!!errors.brief}
                  aria-describedby={errors.brief ? 'gs-msg-err' : undefined}
                ></textarea>
                <FieldError id="gs-msg-err" message={errors.brief} />
              </div>

              {status.kind === 'error' && (
                <div
                  role="alert"
                  style={{
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: '#b3261e',
                    border: '1px solid currentColor',
                    padding: '10px 12px',
                    marginBottom: '16px',
                  }}
                >
                  {status.message}
                </div>
              )}

              <button
                className="btn btn-primary btn-block blueprint"
                type="submit"
                disabled={sending}
                aria-busy={sending}
                style={{ padding: '12px 20px', fontSize: '15px' }}
              >
                {sending ? 'Sending…' : 'Submit enquiry'}
                <i className="corner tl"></i>
                <i className="corner tr"></i>
                <i className="corner bl"></i>
                <i className="corner br"></i>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
