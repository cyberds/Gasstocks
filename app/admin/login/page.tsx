import { redirect } from 'next/navigation';

import { getAdmin } from '../../../lib/server/admin-auth';
import LoginForm from '../../../components/admin/LoginForm';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  // A database fault here should not hide the form; the API reports it on submit.
  const admin = await getAdmin().catch((err) => {
    console.error('[admin] session check failed on login page', err);
    return null;
  });
  if (admin) redirect('/admin');
  return (
    <div className="adm-login">
      <div className="adm-panel">
        <h1>Admin sign in</h1>
        <p className="adm-sub">Gasstocks track record dashboard</p>
        <LoginForm />
      </div>
    </div>
  );
}
