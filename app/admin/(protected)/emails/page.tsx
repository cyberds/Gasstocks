import { authorizedEmails, masterEmail, requireAdmin } from '../../../../lib/server/admin-auth';
import EmailManager from '../../../../components/admin/EmailManager';

export default async function AuthorizedEmailsPage() {
  const admin = await requireAdmin();
  const docs = await (await authorizedEmails()).find().sort({ createdAt: -1 }).toArray();

  return (
    <>
      <h1>Authorized emails</h1>
      <p className="adm-sub">
        People on this list can sign in with a one-time code sent to their email. Removing someone ends their access immediately.
      </p>
      <EmailManager
        currentEmail={admin.email}
        master={masterEmail()}
        emails={docs.map((d) => ({ email: d.email, addedBy: d.addedBy, createdAt: d.createdAt.toISOString() }))}
      />
    </>
  );
}
