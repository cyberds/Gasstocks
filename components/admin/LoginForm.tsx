'use client';

import { useState } from 'react';

type Step = 'email' | 'password' | 'otp';

async function post(url: string, body: unknown) {
  let res: Response;
  try {
    res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Unexpected server error (HTTP ${res.status}).`);
  return data;
}

export default function LoginForm() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function start(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const data = await post('/api/admin/auth/start', { email });
      setSecret('');
      setStep(data.method === 'password' ? 'password' : 'otp');
      if (data.method === 'otp') setNotice(`We sent a 6-digit code to ${email}.`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await post('/api/admin/auth/verify', step === 'password' ? { email, password: secret } : { email, code: secret });
      window.location.assign('/admin');
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  function reset() {
    setStep('email');
    setError(null);
    setNotice(null);
  }

  return (
    <>
      {error && <div className="adm-alert error" role="alert">{error}</div>}
      {notice && <div className="adm-alert ok">{notice}</div>}

      {step === 'email' ? (
        <form onSubmit={start}>
          <div className="adm-field">
            <label htmlFor="email">Work email</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
          </div>
          <button className="adm-btn" style={{ width: '100%' }} disabled={busy}>{busy ? 'Checking…' : 'Continue'}</button>
        </form>
      ) : (
        <form onSubmit={verify}>
          <div className="adm-field">
            <label htmlFor="secret">{step === 'password' ? 'Master password' : 'Sign-in code'}</label>
            {step === 'password' ? (
              <input id="secret" type="password" autoComplete="current-password" required value={secret} onChange={(e) => setSecret(e.target.value)} autoFocus />
            ) : (
              <input id="secret" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required value={secret} onChange={(e) => setSecret(e.target.value.replace(/\D/g, ''))} autoFocus />
            )}
            <span className="hint">Signing in as {email}</span>
          </div>
          <button className="adm-btn" style={{ width: '100%' }} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 14 }}>
            <button type="button" className="adm-btn ghost sm" onClick={reset}>Use another email</button>
            {step === 'otp' && (
              <button type="button" className="adm-btn ghost sm" disabled={busy} onClick={() => start()}>Resend code</button>
            )}
          </div>
        </form>
      )}
    </>
  );
}
