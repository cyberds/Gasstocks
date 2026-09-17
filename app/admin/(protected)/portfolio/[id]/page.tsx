import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ObjectId } from 'mongodb';

import { portfoliosCollection } from '../../../../../lib/portfolio';
import PortfolioForm from '../../../../../components/admin/PortfolioForm';

export default async function EditPortfolioPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  if (!ObjectId.isValid(id)) notFound();
  const doc = await (await portfoliosCollection()).findOne({ _id: new ObjectId(id) });
  if (!doc) notFound();

  return (
    <>
      <Link href="/admin">← Back to track record</Link>
      <h1 style={{ marginTop: 12 }}>Edit project</h1>
      <p className="adm-sub">
        Changes go live on the website as soon as you save. <a href={`/portfolio/${doc.slug}`} target="_blank" rel="noreferrer">View live page ↗</a>
      </p>
      <PortfolioForm
        id={id}
        initial={{
          title: doc.title,
          slug: doc.slug,
          description: doc.description,
          client: doc.client,
          location: doc.location,
          date: doc.date,
          serviceCategory: doc.serviceCategory,
          order: doc.order,
          images: doc.images.map((i) => ({ url: i.url, publicId: i.publicId })),
        }}
      />
    </>
  );
}
