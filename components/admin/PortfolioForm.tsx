'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { createPortfolio, discardUploads, getUploadSignature, updatePortfolio } from '../../app/admin/actions';
import type { PortfolioImage } from '../../lib/portfolio-types';

type Values = {
  title: string;
  slug: string;
  description: string;
  client: string;
  location: string;
  date: string;
  serviceCategory: string;
  order: number;
  images: PortfolioImage[];
};

const EMPTY: Values = { title: '', slug: '', description: '', client: '', location: '', date: '', serviceCategory: '', order: 0, images: [] };
const MAX_FILE_BYTES = 15 * 1024 * 1024;

function slugify(s: string) {
  return s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').slice(0, 120);
}

function thumb(url: string) {
  return url.replace('/image/upload/', '/image/upload/f_auto,q_auto,c_fill,w_320,h_240/');
}

export default function PortfolioForm({ id, initial }: { id?: string; initial?: Values }) {
  const router = useRouter();
  const [v, setV] = useState<Values>(initial ?? EMPTY);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  /* Images uploaded during this visit — cleaned up if the form is abandoned
     or an image is removed before saving, so Cloudinary doesn't fill with orphans. */
  const fresh = useRef(new Set<string>());

  const set = <K extends keyof Values>(key: K, value: Values[K]) => setV((prev) => ({ ...prev, [key]: value }));

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (list.length === 0) return;
    setUploadErrors([]);
    let sig: Awaited<ReturnType<typeof getUploadSignature>>;
    try {
      sig = await getUploadSignature();
    } catch (err) {
      setUploadErrors([`Could not start the upload because of a technical fault: ${(err as Error).message}`]);
      return;
    }
    setUploading((n) => n + list.length);
    await Promise.all(
      list.map(async (file) => {
        try {
          if (file.size > MAX_FILE_BYTES) throw new Error('file is larger than 15 MB');
          const body = new FormData();
          body.append('file', file);
          body.append('api_key', sig.apiKey);
          body.append('timestamp', String(sig.timestamp));
          body.append('signature', sig.signature);
          body.append('folder', sig.folder);
          const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: 'POST', body });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.error?.message ?? `Cloudinary returned HTTP ${res.status}`);
          fresh.current.add(data.public_id);
          setV((prev) => ({ ...prev, images: [...prev.images, { url: data.secure_url, publicId: data.public_id }] }));
        } catch (err) {
          setUploadErrors((prev) => [...prev, `${file.name}: upload failed — ${(err as Error).message}`]);
        } finally {
          setUploading((n) => n - 1);
        }
      }),
    );
  }

  function moveImage(index: number, delta: number) {
    setV((prev) => {
      const images = [...prev.images];
      const [img] = images.splice(index, 1);
      images.splice(index + delta, 0, img);
      return { ...prev, images };
    });
  }

  function removeImage(index: number) {
    const img = v.images[index];
    setV((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    // Unsaved uploads can go now; saved ones are deleted by the server on save.
    if (fresh.current.has(img.publicId)) {
      fresh.current.delete(img.publicId);
      discardUploads([img.publicId]).catch((err) => console.error('Could not discard upload', err));
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setFields({});
    try {
      const res = id ? await updatePortfolio(id, v) : await createPortfolio(v);
      if (!res.ok) {
        setError(res.error);
        setFields(res.fields ?? {});
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      fresh.current.clear();
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(`Saving failed because of a technical fault: ${(err as Error).message}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  }

  function onCancel() {
    if (fresh.current.size > 0) {
      discardUploads([...fresh.current]).catch((err) => console.error('Could not discard uploads', err));
    }
    router.push('/admin');
  }

  const text = (key: 'title' | 'client' | 'location' | 'date' | 'serviceCategory', label: string, hint?: string) => (
    <div className="adm-field">
      <label htmlFor={key}>{label}</label>
      <input
        id={key}
        value={v[key]}
        onChange={(e) => {
          set(key, e.target.value);
          if (key === 'title' && !slugTouched) set('slug', slugify(e.target.value));
        }}
      />
      {hint && <span className="hint">{hint}</span>}
      {fields[key] && <span className="err">{fields[key]}</span>}
    </div>
  );

  return (
    <form onSubmit={onSubmit}>
      {error && <div className="adm-alert error" role="alert">{error}</div>}

      <div className="adm-panel" style={{ marginBottom: 20 }}>
        <h2>Details</h2>
        {text('title', 'Title')}
        <div className="adm-field">
          <label htmlFor="slug">URL slug</label>
          <input
            id="slug"
            value={v.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set('slug', e.target.value);
            }}
          />
          <span className="hint">gasstocks.com/portfolio/{v.slug || '…'}{id ? ' — changing this breaks existing links to the page' : ''}</span>
          {fields.slug && <span className="err">{fields.slug}</span>}
        </div>
        <div className="adm-field">
          <label htmlFor="description">Description</label>
          <textarea id="description" value={v.description} onChange={(e) => set('description', e.target.value)} />
          {fields.description && <span className="err">{fields.description}</span>}
        </div>
        <div className="adm-grid2">
          {text('client', 'Client')}
          {text('location', 'Location')}
          {text('date', 'Date', 'As it should read on the site, e.g. "June 2026"')}
          {text('serviceCategory', 'Service category')}
          <div className="adm-field">
            <label htmlFor="order">Display order</label>
            <input id="order" type="number" min={0} value={v.order} onChange={(e) => set('order', Number(e.target.value))} />
            <span className="hint">Lower numbers appear first</span>
            {fields.order && <span className="err">{fields.order}</span>}
          </div>
        </div>
      </div>

      <div className="adm-panel" style={{ marginBottom: 20 }}>
        <h2>Images</h2>
        <p className="adm-sub" style={{ marginBottom: 12 }}>The first image is the cover.</p>
        {fields.images && <div className="adm-alert error">{fields.images}</div>}
        {uploadErrors.map((m, i) => (
          <div key={i} className="adm-alert error">{m}</div>
        ))}

        {v.images.length > 0 && (
          <div className="adm-images">
            {v.images.map((img, i) => (
              <div className="adm-img" key={img.publicId}>
                {i === 0 && <span className="cover">Cover</span>}
                <img src={thumb(img.url)} alt="" />
                <div className="bar">
                  <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} aria-label="Move earlier">←</button>
                  <button type="button" onClick={() => moveImage(i, 1)} disabled={i === v.images.length - 1} aria-label="Move later">→</button>
                  <button type="button" onClick={() => removeImage(i)} aria-label="Remove image">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          className={`adm-drop${dragOver ? ' over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); }}
        >
          <p style={{ margin: '0 0 10px' }}>{uploading > 0 ? `Uploading ${uploading} image${uploading === 1 ? '' : 's'}…` : 'Drag images here, or'}</p>
          <button type="button" className="adm-btn ghost sm" onClick={() => fileInput.current?.click()}>Choose images</button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) uploadFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button type="button" className="adm-btn ghost" onClick={onCancel} disabled={saving}>Cancel</button>
        <button className="adm-btn" disabled={saving || uploading > 0}>
          {saving ? 'Saving…' : uploading > 0 ? 'Waiting for uploads…' : id ? 'Save changes' : 'Create project'}
        </button>
      </div>
    </form>
  );
}
