import Link from 'next/link';

import { deliveryUrl, portfoliosCollection } from '../../../lib/portfolio';
import DeletePortfolioButton from '../../../components/admin/DeletePortfolioButton';

export default async function AdminDashboardPage() {
  // Read straight from the database (not the public cache) so edits show at once.
  const docs = await (await portfoliosCollection()).find().sort({ order: 1, createdAt: -1 }).toArray();

  return (
    <>
      <div className="adm-row">
        <div>
          <h1>Track record</h1>
          <p className="adm-sub" style={{ margin: 0 }}>{docs.length} project{docs.length === 1 ? '' : 's'} · lower order numbers appear first</p>
        </div>
        <Link href="/admin/portfolio/new" className="adm-btn">+ New project</Link>
      </div>

      <div className="adm-panel adm-table-wrap">
        {docs.length === 0 ? (
          <p className="adm-sub" style={{ margin: 0 }}>No projects yet.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th></th>
                <th>Project</th>
                <th className="hide-sm">Category</th>
                <th className="hide-sm">Images</th>
                <th className="hide-sm">Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => {
                const id = d._id.toHexString();
                return (
                  <tr key={id}>
                    <td>{d.images[0] && <img src={deliveryUrl(d.images[0].url, 200)} alt="" />}</td>
                    <td>
                      <strong>{d.title}</strong>
                      <div style={{ color: 'var(--adm-muted)', fontSize: 13 }}>/portfolio/{d.slug}</div>
                    </td>
                    <td className="hide-sm">{d.serviceCategory}</td>
                    <td className="hide-sm">{d.images.length}</td>
                    <td className="hide-sm">{d.order}</td>
                    <td>
                      <div className="adm-actions">
                        <a className="adm-btn ghost sm" href={`/portfolio/${d.slug}`} target="_blank" rel="noreferrer">View</a>
                        <Link className="adm-btn ghost sm" href={`/admin/portfolio/${id}`}>Edit</Link>
                        <DeletePortfolioButton id={id} title={d.title} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
