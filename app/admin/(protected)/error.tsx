'use client';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="adm-panel">
      <h1>Something went wrong</h1>
      <div className="adm-alert error" role="alert">
        This page could not load because of a technical fault (for example, the database is unreachable). It is not something you did.
        {error.digest && <> Reference: <code>{error.digest}</code></>}
      </div>
      <button type="button" className="adm-btn" onClick={reset}>Try again</button>
    </div>
  );
}
