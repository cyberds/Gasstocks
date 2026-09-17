import Link from 'next/link';

import PortfolioForm from '../../../../../components/admin/PortfolioForm';

export default function NewPortfolioPage() {
  return (
    <>
      <Link href="/admin">← Back to track record</Link>
      <h1 style={{ marginTop: 12 }}>New project</h1>
      <p className="adm-sub">It goes live on the website as soon as you save.</p>
      <PortfolioForm />
    </>
  );
}
