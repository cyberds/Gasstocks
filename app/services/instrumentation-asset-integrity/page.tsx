import React from 'react';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import ContactForm from '../../../components/ContactForm';
import { SERVICES } from '../../../lib/services';

export const metadata = {
  title: 'Instrumentation & Asset Integrity | Gasstocks Limited',
  description: 'Fiscal metering, flow measurement, control systems, NUPRC calibration, certification, and plant maintenance for crude oil production facilities.',
  keywords: ['Fiscal Metering Nigeria', 'NUPRC Calibration', 'Instrumentation Control', 'Asset Integrity Maintenance', 'Plant Maintenance'],
};

export default function InstrumentationAssetIntegrityPage() {
  const categoryServices = SERVICES.filter((s) => s.group === 'Instrumentation & asset integrity');

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', background: 'var(--color-bg)', minHeight: '100vh' }}>
      <SiteHeader />

      <main style={{ paddingTop: '80px' }}>
        {/* Category Hero */}
        <section style={{ padding: '80px 32px 60px', background: 'var(--color-accent-900)', color: '#fff' }}>
          <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-300)', marginBottom: '12px' }}>
              Service Category
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 54px)', lineHeight: 1.08, margin: '0 0 20px', color: '#fff' }}>
              Instrumentation & Asset Integrity
            </h1>
            <p style={{ fontSize: '18px', maxWidth: '64ch', color: 'color-mix(in srgb, #fff 80%, transparent)', lineHeight: 1.6, margin: 0 }}>
              Precision calibration, fiscal metering, control automation, and plant asset integrity upgrades compliant with NUPRC regulations.
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
                        0{idx + 1} / INTEGRITY
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
                  <img src="/assets/portfolio/2/IMG-20260618-WA0014.jpg" alt="Instrumentation & Control" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <div className="blueprint" style={{ padding: '32px', background: 'var(--color-neutral-900)', color: '#fff' }}>
                  <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
                  <h4 style={{ color: '#fff', fontSize: '20px', marginBottom: '12px' }}>NUPRC Licensed & Approved</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'color-mix(in srgb, #fff 75%, transparent)', margin: '0 0 20px' }}>
                    Gasstocks carries out official calibration, fiscal flow measurement, and safety shutdowns under full NUPRC operator licensing.
                  </p>
                  <a href="/contact" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    Consult Integrity Specialist
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
