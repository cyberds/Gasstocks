import Link from 'next/link';

import { requireAdmin } from '../../../lib/server/admin-auth';

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <>
      <header className="adm-top">
        <Link href="/admin" className="adm-brand">Gasstocks Admin</Link>
        <nav>
          <Link href="/admin">Track record</Link>
          <Link href="/admin/emails">Authorized emails</Link>
          <a href="/portfolio" target="_blank" rel="noreferrer">View site ↗</a>
        </nav>
        <div className="adm-user">
          <span>{admin.email}{admin.isMaster ? ' (master)' : ''}</span>
          <form action="/api/admin/auth/logout" method="post">
            <button type="submit">Sign out</button>
          </form>
        </div>
      </header>
      <main className="adm-main">{children}</main>
    </>
  );
}
