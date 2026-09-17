'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { addAuthorizedEmail, removeAuthorizedEmail } from '../../app/admin/actions';

type Row = { email: string; addedBy: string; createdAt: string };

export default function EmailManager({ emails, currentEmail, master }: { emails: Row[]; currentEmail: string; master: string | null }) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<{ ok: boolean; error?: string }>, success: string) {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      try {
        const res = await action();
        if (!res.ok) {
          setError(res.error ?? 'Something went wrong.');
          return;
        }
        setNotice(success);
        router.refresh();
      } catch (err) {
        setError(`The request failed because of a technical fault: ${(err as Error).message}`);
      }
    });
  }

  return (
    <>
      {error && <div className="adm-alert error" role="alert">{error}</div>}
      {notice && <div className="adm-alert ok">{notice}</div>}

      <form
        className="adm-panel"
        style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}
        onSubmit={(e) => {
          e.preventDefault();
          const email = value.trim();
          run(async () => {
            const res = await addAuthorizedEmail(email);
            if (res.ok) setValue('');
            return res;
          }, `${email} can now sign in.`);
        }}
      >
        <div className="adm-field" style={{ flex: 1, minWidth: 220, marginBottom: 0 }}>
          <label htmlFor="new-email">Add a staff email</label>
          <input id="new-email" type="email" required value={value} onChange={(e) => setValue(e.target.value)} placeholder="name@example.com" />
        </div>
        <button className="adm-btn" disabled={pending}>{pending ? 'Saving…' : 'Authorize'}</button>
      </form>

      <div className="adm-panel adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Email</th>
              <th className="hide-sm">Added by</th>
              <th className="hide-sm">Added</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {master && (
              <tr>
                <td><strong>{master}</strong></td>
                <td className="hide-sm" colSpan={2} style={{ color: 'var(--adm-muted)' }}>Master admin — set in environment variables, signs in with password</td>
                <td></td>
              </tr>
            )}
            {emails.map((row) => (
              <tr key={row.email}>
                <td>{row.email}{row.email === currentEmail ? ' (you)' : ''}</td>
                <td className="hide-sm">{row.addedBy}</td>
                <td className="hide-sm">{new Date(row.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="adm-actions">
                    {row.email !== currentEmail && (
                      <button
                        type="button"
                        className="adm-btn danger ghost sm"
                        disabled={pending}
                        onClick={() => {
                          if (window.confirm(`Remove access for ${row.email}?`)) {
                            run(() => removeAuthorizedEmail(row.email), `${row.email} can no longer sign in.`);
                          }
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {emails.length === 0 && (
              <tr>
                <td colSpan={4} style={{ color: 'var(--adm-muted)' }}>No staff emails yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
