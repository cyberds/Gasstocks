import React from 'react';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import Capability from '../../components/Capability';
import ContactForm from '../../components/ContactForm';

export const metadata = {
  title: 'Services & Support Capability | Gasstocks Limited',
  description: 'Explore Gasstocks Limited energy, marine, engineering, instrumentation, and equipment supply capabilities across 20 specialised service areas.',
  keywords: ['Gasstocks Services', 'Marine Logistics Nigeria', 'EPCM Engineering', 'Vessel Charter', 'Fiscal Metering', 'Oilfield Equipment Supply'],
  alternates: {
    canonical: '/services',
  }
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Marine & Vessels",
      "url": "https://gasstocks.com/services/marine-vessels"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Engineering & Construction",
      "url": "https://gasstocks.com/services/engineering-construction"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Instrumentation & Asset Integrity",
      "url": "https://gasstocks.com/services/instrumentation-asset-integrity"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Supply & Equipment",
      "url": "https://gasstocks.com/services/supply-equipment"
    }
  ]
};

const CATEGORIES = [
  {
    slug: 'marine-vessels',
    title: 'Marine & Vessels',
    image: '/assets/portfolio/2/IMG-20260618-WA0011.jpg',
    description: 'Vessel chartering, offshore supply logistics, ship management, marine security escort, and offshore accommodation support.',
    count: '5 Services',
  },
  {
    slug: 'engineering-construction',
    title: 'Engineering & Construction',
    image: '/assets/portfolio/1/IMG-20260618-WA0025.jpg',
    description: 'Pipeline construction, jetty marine civil engineering, dredging, land reclamation, steel fabrication, and EPCM project delivery.',
    count: '7 Services',
  },
  {
    slug: 'instrumentation-asset-integrity',
    title: 'Instrumentation & Asset Integrity',
    image: '/assets/portfolio/2/IMG-20260618-WA0014.jpg',
    description: 'Control systems procurement, fiscal metering, NUPRC-compliant calibration, certification, and plant maintenance.',
    count: '4 Services',
  },
  {
    slug: 'supply-equipment',
    title: 'Supply & Equipment',
    image: '/assets/portfolio/1/IMG-20260618-WA0028.jpg',
    description: 'Bare/operated heavy plant hire, oilfield valves & line pipe supply, industrial gases, LPG, and technical manpower outsourcing.',
    count: '4 Services',
  },
];

export default function ServicesPage() {
  return (
    <div
      style={{
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text)',
        background: 'var(--color-bg)',
        minHeight: '100vh',
      }}
    >
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <main style={{ paddingTop: '80px' }}>
        {/* Services Hero */}
        <section style={{ padding: '80px 32px 60px', background: 'var(--color-neutral-900)', color: '#fff' }}>
          <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-300)', marginBottom: '12px' }}>
              Service Catalogue
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 54px)', lineHeight: 1.08, margin: '0 0 20px', color: '#fff' }}>
              Compliant & Innovative Energy Services
            </h1>
            <p style={{ fontSize: '18px', maxWidth: '64ch', color: 'color-mix(in srgb, #fff 80%, transparent)', lineHeight: 1.6, margin: 0 }}>
              Gasstocks Limited provides end-to-end support across marine operations, civil engineering, instrumentation, and oilfield equipment supply — delivering accountable execution across Nigeria and international sectors.
            </p>
          </div>
        </section>

        {/* Category Cards Overview */}
        <section style={{ padding: '80px 32px', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-divider)' }}>
          <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '12px' }}>
              Core Service Disciplines
            </div>
            <h2 style={{ fontSize: '36px', marginBottom: '48px' }}>Select a Discipline to Learn More</h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '32px',
              }}
            >
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.slug}
                  href={`/services/${cat.slug}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-divider)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s, border-color 0.2s',
                  }}
                  className="blueprint"
                >
                  <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
                  <div style={{ height: '180px', overflow: 'hidden' }}>
                    <img
                      src={cat.image}
                      alt={cat.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '8px' }}>
                      {cat.count}
                    </div>
                    <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>{cat.title}</h3>
                    <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--color-neutral-700)', flex: 1, margin: '0 0 20px' }}>
                      {cat.description}
                    </p>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-accent)' }}>
                      Explore Category &rarr;
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Full Capability Register */}
        <Capability />

        {/* Contact Form CTA */}
        <div style={{ borderTop: '1px solid var(--color-divider)' }}>
          <ContactForm />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
