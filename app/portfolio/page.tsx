import React from 'react';
import PortfolioSlider from '../../components/PortfolioSlider';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import { Metadata } from 'next';
import { getPortfolios } from '../../lib/portfolio';

export const metadata: Metadata = {
  title: 'Track Record & Portfolio | Gasstocks Limited',
  description: 'Gasstocks Limited project portfolio: marine logistics, pipeline, wellhead and dredging support for operators across the Niger Delta.',
  keywords: ['Gasstocks portfolio', 'Marine logistics projects Nigeria', 'SPDC marine logistics', 'Niger Delta houseboat support'],
  alternates: {
    canonical: '/portfolio',
  }
};

export default async function PortfolioPage() {
  const portfolios = await getPortfolios();
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Gasstocks Limited Track Record & Portfolio",
    "description": "Gasstocks Limited marine logistics and engineering projects in Nigeria.",
    "url": "https://gasstocksltd.com/portfolio",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": portfolios.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://gasstocksltd.com/portfolio/${p.slug}`,
        "name": p.title,
      })),
    },
  };

  return (
    <div style={{
      fontFamily: 'var(--font-body)',
      color: 'var(--color-text)',
      background: 'var(--color-bg)',
      minHeight: '100vh',
    }}>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <main style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <div style={{ padding: '0 2rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 700 }}>Our Portfolio</h1>
          <p style={{ color: 'color-mix(in srgb,var(--color-text) 60%,transparent)', fontSize: '1.2rem' }}>Marine logistics, engineering and security support we have delivered for operators in the Niger Delta.</p>
        </div>
        <PortfolioSlider portfolios={portfolios} />
      </main>
      <SiteFooter />
    </div>
  );
}
