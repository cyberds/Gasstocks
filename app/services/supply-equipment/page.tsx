import React from 'react';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import ContactForm from '../../../components/ContactForm';
import { SERVICES } from '../../../lib/services';

export const metadata = {
  title: 'Supply & Equipment Hire | Gasstocks Limited',
  description: 'Heavy equipment plant hire (excavators, tippers, cranes), oilfield valves and materials, industrial gases, LPG, and technical manpower logistics.',
  keywords: ['Plant Hire Nigeria', 'Excavator Hire', 'Oilfield Equipment Supply', 'LPG Distribution', 'Technical Manpower Logistics'],
};

export default function SupplyEquipmentPage() {
  const categoryServices = SERVICES.filter((s) => s.group === 'Supply & equipment');

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
              Supply & Equipment
            </h1>
            <p style={{ fontSize: '18px', maxWidth: '64ch', color: 'color-mix(in srgb, #fff 80%, transparent)', lineHeight: 1.6, margin: 0 }}>
              Bare or operated plant hire, procurement of certified oilfield equipment, bulk LPG supply, and specialized technical manpower outsourcing.
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
                        0{idx + 1} / SUPPLY
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
                  <img src="/assets/portfolio/1/IMG-20260618-WA0028.jpg" alt="Heavy Equipment Supply" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <div className="blueprint" style={{ padding: '32px', background: 'var(--color-neutral-900)', color: '#fff' }}>
                  <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
                  <h4 style={{ color: '#fff', fontSize: '20px', marginBottom: '12px' }}>Bare or Operated Hire</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'color-mix(in srgb, #fff 75%, transparent)', margin: '0 0 20px' }}>
                    All heavy machinery, Ti Ti tippers, tippers, tippers, excavators, dozers, and cranes are available bare or crewed with maintenance and fuel support.
                  </p>
                  <a href="/contact" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    Request Equipment Availability
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
