import 'server-only';

import { unstable_cache } from 'next/cache';
import { ObjectId } from 'mongodb';

import { getDb } from './server/mongodb';

import type { Portfolio, PortfolioImage } from './portfolio-types';

export type { Portfolio, PortfolioImage, PortfolioNavItem } from './portfolio-types';

/** Shape stored in the `portfolios` collection. */
export interface PortfolioDoc {
  _id: ObjectId;
  slug: string;
  title: string;
  description: string;
  client: string;
  location: string;
  date: string;
  serviceCategory: string;
  images: PortfolioImage[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/** Every public read is cached under this tag; admin writes revalidate it. */
export const PORTFOLIO_TAG = 'portfolios';

/** Insert Cloudinary's automatic format/quality so visitors get AVIF/WebP at
    a sensible size instead of the raw upload. */
export function deliveryUrl(url: string, width = 1600) {
  return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

export async function portfoliosCollection() {
  return (await getDb()).collection<PortfolioDoc>('portfolios');
}

function toPublic(doc: PortfolioDoc): Portfolio {
  return {
    id: doc._id.toHexString(),
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    client: doc.client,
    location: doc.location,
    date: doc.date,
    serviceCategory: doc.serviceCategory,
    images: doc.images.map((img) => deliveryUrl(img.url)),
  };
}

/* Errors are NOT caught here. A database outage must surface (and ISR keeps
   serving the last good page meanwhile) rather than quietly rendering an empty
   track record that search engines would then index. */
export const getPortfolios = unstable_cache(
  async (): Promise<Portfolio[]> => {
    const docs = await (await portfoliosCollection()).find().sort({ order: 1, createdAt: -1 }).toArray();
    return docs.map(toPublic);
  },
  ['portfolios:all'],
  { tags: [PORTFOLIO_TAG], revalidate: 3600 },
);

export const getPortfolioBySlug = unstable_cache(
  async (slug: string): Promise<Portfolio | null> => {
    const doc = await (await portfoliosCollection()).findOne({ slug });
    return doc ? toPublic(doc) : null;
  },
  ['portfolios:by-slug'],
  { tags: [PORTFOLIO_TAG], revalidate: 3600 },
);

export async function getPortfolioNav(): Promise<import('./portfolio-types').PortfolioNavItem[]> {
  const all = await getPortfolios();
  return all.map((p) => ({ slug: p.slug, title: p.title, image: p.images[0] ? p.images[0].replace(/w_\d+/, 'w_400') : null }));
}
