import React from 'react';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import Capability from '../../components/Capability';
import ContactForm from '../../components/ContactForm';
import { GROUPS, GROUP_INFO, servicesInGroup } from '../../lib/services';

export const metadata = {
  title: 'Services',
  description: 'Gasstocks Limited services for Nigeria’s oil and gas industry: swamp and deep offshore marine logistics, mechanical and civil engineering, instrumentation and control automation, procurement, equipment leasing and specialised manpower.',
  keywords: ['Marine logistics Nigeria', 'Houseboat charter Port Harcourt', 'Swamp logistics', 'Pipeline construction Nigeria', 'Instrumentation and control automation', 'Oilfield procurement Nigeria'],
  alternates: {
    canonical: '/services',
  }
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": GROUPS.map((g, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": g,
    "url": `https://gasstocksltd.com/services/${GROUP_INFO[g].slug}`,
  })),
};

const CATEGORIES = GROUPS.map((g) => ({
  slug: GROUP_INFO[g].slug,
  title: g,
  image: GROUP_INFO[g].image,
  description: GROUP_INFO[g].description,
  count: `${servicesInGroup(g).length} services`,
}));

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
              Service catalogue
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 54px)', lineHeight: 1.08, margin: '0 0 20px', color: '#fff' }}>
              Marine, engineering and supply services for Nigeria&apos;s oil and gas industry
            </h1>
            <p style={{ fontSize: '18px', maxWidth: '64ch', color: 'color-mix(in srgb, #fff 80%, transparent)', lineHeight: 1.6, margin: 0 }}>
              Gasstocks holds permits from the industry regulator to deliver five classes of service: marine, mechanical engineering, instrumentation and control automation, civil engineering, and procurement, leasing and hospitality. We deliver them onshore, in the swamp and deep offshore, from bases in Port Harcourt, Lagos, Warri and Houston.
            </p>
          </div>
        </section>

        {/* Category Cards Overview */}
        <section style={{ padding: '80px 32px', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-divider)' }}>
          <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '12px' }}>
              Service categories
            </div>
            <h2 style={{ fontSize: '36px', marginBottom: '48px' }}>Choose a category</h2>

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
                      View services &rarr;
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
