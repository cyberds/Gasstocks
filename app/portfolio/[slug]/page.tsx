import React from 'react';
import { notFound } from 'next/navigation';
import { PORTFOLIOS } from '../../../lib/portfolio';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import PortfolioGallery from '../../../components/PortfolioGallery';
import ContactButton from '../../../components/ContactButton';
import { Metadata } from 'next';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const portfolio = PORTFOLIOS.find(p => p.slug === params.slug);
  
  if (!portfolio) {
    return {
      title: 'Project Not Found | Gasstocks Limited',
    };
  }

  return {
    title: `${portfolio.title} | Portfolio | Gasstocks Limited`,
    description: portfolio.description,
    keywords: [portfolio.serviceCategory, portfolio.client, 'Gasstocks Projects', 'Nigeria'],
    alternates: {
      canonical: `/portfolio/${portfolio.slug}`,
    },
    openGraph: {
      title: portfolio.title,
      description: portfolio.description,
      images: portfolio.images.map(img => ({ url: img })),
    }
  };
}

export default async function PortfolioDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const portfolio = PORTFOLIOS.find(p => p.slug === params.slug);

  if (!portfolio) {
    notFound();
  }

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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": portfolio.title,
            "description": portfolio.description,
            "image": portfolio.images,
            "author": {
              "@type": "Organization",
              "name": "Gasstocks Limited"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Gasstocks Limited",
              "logo": {
                "@type": "ImageObject",
                "url": "https://gasstocks.com/assets/favicon.png"
              }
            },
            "datePublished": portfolio.date,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://gasstocks.com/portfolio/${portfolio.slug}`
            }
          })
        }}
      />
      <main className="portfolio-page">
        <div className="portfolio-page-header">
          <h1 style={{ color: 'black' }}>{portfolio.title}</h1>
        </div>
        
        <div className="portfolio-meta-bar">
          <div className="meta-item" style={{ color: 'white' }}>
            <span className="meta-label">Client</span>
            <span className="meta-value">{portfolio.client}</span>
          </div>
          <div className="meta-item" style={{ color: 'white' }}>
            <span className="meta-label">Location</span>
            <span className="meta-value">{portfolio.location}</span>
          </div>
          <div className="meta-item" style={{ color: 'white' }}>
            <span className="meta-label">Date</span>
            <span className="meta-value">{portfolio.date}</span>
          </div>
          <div className="meta-item" style={{ color: 'white' }}>
            <span className="meta-label">Category</span>
            <span className="meta-value">{portfolio.serviceCategory}</span>
          </div>
        </div>

        <div className="portfolio-content">
          <h3 style={{ color: 'black' }}>Project Overview</h3>
          <p style={{ color: 'black' }}>{portfolio.description}</p>
        </div>

        <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem', fontSize: '2rem', color: 'black' }}>Gallery</h3>
        <PortfolioGallery images={portfolio.images} title={portfolio.title} />
      </main>
      
      <ContactButton />
      
      <SiteFooter />
    </div>
  );
}
