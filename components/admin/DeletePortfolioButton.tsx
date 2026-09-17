'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { deletePortfolio } from '../../app/admin/actions';

export default function DeletePortfolioButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!window.confirm(`Delete "${title}"?\n\nThis removes the project from the website and permanently deletes its images.`)) return;
    startTransition(async () => {
      try {
        const res = await deletePortfolio(id);
        if (!res.ok) window.alert(res.error);
        router.refresh();
      } catch (err) {
        window.alert(`Delete failed because of a technical fault: ${(err as Error).message}`);
      }
    });
  }

  return (
    <button type="button" className="adm-btn danger ghost sm" onClick={onClick} disabled={pending}>
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
