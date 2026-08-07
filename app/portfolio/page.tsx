import React from 'react';
import PortfolioSlider from '../../components/PortfolioSlider';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Record & Portfolio | Gasstocks Limited',
  description: 'Explore Gasstocks Limited marine operations, dredging projects, and civil engineering portfolio across Nigeria.',
  keywords: ['Gasstocks Portfolio', 'Marine Projects Nigeria', 'Dredging Track Record', 'Civil Engineering Projects'],
  alternates: {
    canonical: '/portfolio',
  }
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Gasstocks Limited Track Record & Portfolio",
  "description": "Explore a showcase of our recent projects and marine operations in Nigeria.",
  "url": "https://gasstocks.com/portfolio"
};

export default function PortfolioPage() {
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
          <p style={{ color: 'color-mix(in srgb,var(--color-text) 60%,transparent)', fontSize: '1.2rem' }}>Explore a showcase of our recent projects and marine operations.</p>
        </div>
        <PortfolioSlider />
      </main>
      <SiteFooter />
    </div>
  );
}
