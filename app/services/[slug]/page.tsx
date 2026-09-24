import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import ContactForm from '../../../components/ContactForm';
import { COMPANY } from '../../../lib/company';
import { GROUPS, GROUP_INFO, groupBySlug, servicesInGroup } from '../../../lib/services';

/* One page per service group, all driven by lib/services.ts. These were four
   hand-copied files that had drifted apart; the slugs are unchanged. */

export const dynamicParams = false;

export function generateStaticParams() {
  return GROUPS.map((g) => ({ slug: GROUP_INFO[g].slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const group = groupBySlug((await params).slug);
  if (!group) return {};
  const info = GROUP_INFO[group];
  return {
    title: `${group} Services`,
    description: `${info.description} Gasstocks Limited, Port Harcourt, Nigeria.`,
    keywords: servicesInGroup(group).map((s) => `${s.name} Nigeria`),
    alternates: { canonical: `/services/${info.slug}` },
  };
}

export default async function ServiceGroupPage({ params }: Props) {
  const group = groupBySlug((await params).slug);
  if (!group) notFound();
  const info = GROUP_INFO[group];
  const services = servicesInGroup(group);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: group,
    provider: { '@type': 'Organization', name: COMPANY.legalName },
    areaServed: 'Nigeria',
    description: info.description,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${group} services`,
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, description: s.covers },
      })),
    },
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', background: 'var(--color-bg)', minHeight: '100vh' }}>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <main style={{ paddingTop: '80px' }}>
        <section style={{ padding: '80px 32px 60px', background: 'var(--color-accent-900)', color: '#fff' }}>
          <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-300)', marginBottom: '12px' }}>
              Service category
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 54px)', lineHeight: 1.08, margin: '0 0 20px', color: '#fff' }}>{group}</h1>
            <p style={{ fontSize: '18px', maxWidth: '64ch', color: 'color-mix(in srgb, #fff 80%, transparent)', lineHeight: 1.6, margin: 0 }}>
              {info.intro}
            </p>
          </div>
        </section>

        <section style={{ padding: '96px 32px', background: 'var(--color-bg)' }}>
          <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
              <div>
                <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>Services in this category</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {services.map((s, idx) => (
                    <div key={s.id} className="blueprint" style={{ padding: '24px', background: 'var(--color-surface)' }}>
                      <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
                      <div style={{ fontSize: '12px', fontFamily: 'ui-monospace, Menlo, monospace', color: 'var(--color-accent)', marginBottom: '6px' }}>
                        {String(idx + 1).padStart(2, '0')} / {info.short}
                      </div>
                      <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{s.name}</h3>
                      <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-neutral-700)', margin: 0 }}>{s.covers}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ position: 'sticky', top: '100px' }}>
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: '32px' }}>
                  <img src={info.image} alt={`Gasstocks ${group.toLowerCase()} work`} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <div className="blueprint" style={{ padding: '32px', background: 'var(--color-neutral-900)', color: '#fff' }}>
                  <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
                  <h4 style={{ color: '#fff', fontSize: '20px', marginBottom: '12px' }}>{info.highlight.title}</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'color-mix(in srgb, #fff 75%, transparent)', margin: '0 0 20px' }}>
                    {info.highlight.body}
                  </p>
                  <a href="/contact" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    {info.highlight.cta}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div style={{ borderTop: '1px solid var(--color-divider)' }}>
          <ContactForm />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
