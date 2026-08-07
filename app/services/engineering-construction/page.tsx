import React from 'react';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import ContactForm from '../../../components/ContactForm';
import { SERVICES } from '../../../lib/services';

export const metadata = {
  title: 'Engineering & Construction Services | Gasstocks Limited',
  description: 'Pipeline construction, piled jetties, dredging, land reclamation, steel fabrication, boatbuilding, roads, and EPCM engineering in Nigeria.',
  keywords: ['Pipeline Construction Nigeria', 'Dredging Services', 'Piled Jetties', 'Steel Fabrication', 'Land Reclamation', 'Civil Engineering EPCM'],
};

export default function EngineeringConstructionPage() {
  const categoryServices = SERVICES.filter((s) => s.group === 'Engineering & construction');

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', background: 'var(--color-bg)', minHeight: '100vh' }}>
      <SiteHeader />

      <main style={{ paddingTop: '80px' }}>
        {/* Category Hero */}
        <section style={{ padding: '80px 32px 60px', background: 'var(--color-neutral-900)', color: '#fff' }}>
          <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-300)', marginBottom: '12px' }}>
              Service Category
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 54px)', lineHeight: 1.08, margin: '0 0 20px', color: '#fff' }}>
              Engineering & Construction
            </h1>
            <p style={{ fontSize: '18px', maxWidth: '64ch', color: 'color-mix(in srgb, #fff 80%, transparent)', lineHeight: 1.6, margin: 0 }}>
              From deep foundations and shoreline dredging to major pipeline construction and structural steel fabrication, Gasstocks delivers accountable infrastructure engineering.
            </p>
          </div>
        </section>

        {/* Services List Section */}
        <section style={{ padding: '96px 32px', background: 'var(--color-bg)' }}>
          <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
              <div>
                <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>Services in this Discipline</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {categoryServices.map((s, idx) => (
                    <div key={s.id} className="blueprint" style={{ padding: '24px', background: 'var(--color-surface)' }}>
                      <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
                      <div style={{ fontSize: '12px', fontFamily: 'ui-monospace, Menlo, monospace', color: 'var(--color-accent)', marginBottom: '6px' }}>
                        0{idx + 1} / ENGINEERING
                      </div>
                      <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{s.name}</h3>
                      <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-neutral-700)', margin: 0 }}>{s.covers}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar / Highlights */}
              <div style={{ position: 'sticky', top: '100px' }}>
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: '32px' }}>
                  <img src="/assets/portfolio/1/IMG-20260618-WA0025.jpg" alt="Steel Fabrication and Dry-docking" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <div className="blueprint" style={{ padding: '32px', background: 'var(--color-neutral-900)', color: '#fff' }}>
                  <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
                  <h4 style={{ color: '#fff', fontSize: '20px', marginBottom: '12px' }}>ISO 9001:2015 Certified Quality</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'color-mix(in srgb, #fff 75%, transparent)', margin: '0 0 20px' }}>
                    All civil works, structural steel fabrications, and dredging campaigns adhere strictly to ISO 9001:2015 quality management standards.
                  </p>
                  <a href="/contact" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    Request Engineering Proposal
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Lead Form */}
        <div style={{ borderTop: '1px solid var(--color-divider)' }}>
          <ContactForm />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
