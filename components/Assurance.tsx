import { COMPANY } from '../lib/company';

/* Assurance — compliance standing, and nothing more than can be evidenced.
 *
 * This section advertises certifications and memberships sourced from
 * COMPANY.accreditations. It also displays client logos in a continuous
 * marquee slider.
 */

const tileStyle = { 
  background: 'var(--color-bg)', 
  padding: '18px 16px',
  minWidth: '280px',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px',
  border: '1px solid var(--color-divider)',
  borderRadius: '8px',
};

const headlineStyle = {
  fontFamily: 'var(--font-heading)',
  fontWeight: '600',
  fontSize: '17px',
};

const detailStyle = {
  fontSize: '11.5px',
  lineHeight: '1.45',
  color: 'color-mix(in srgb,var(--color-text) 55%,transparent)',
};

const clientLogos = [
  '/assets/clients/Chevron_Logo.svg.webp',
  '/assets/clients/Exxon_Mobil_Logo.svg.webp',
  '/assets/clients/Nigerian_National_Petroleum_Company_logo.svg.webp',
  '/assets/clients/Shell-gas-station-logo-trans.png',
  '/assets/clients/ardova.e1c5751.png',
  '/assets/clients/mobil-logo.png',
  '/assets/clients/ronish-logo.png',
];

export default function Assurance() {
  return (
    <section id="assurance" style={{ padding: '96px 32px', overflow: 'hidden' }}>
      <style>{`
        .marquee-container {
          display: flex;
          overflow: hidden;
          width: 100%;
          position: relative;
          padding: 20px 0;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        .marquee-content {
          display: flex;
          gap: 16px;
          min-width: 100%;
          animation: marquee 30s linear infinite;
        }
        .marquee-content.reverse {
          animation: marquee-reverse 35s linear infinite;
        }
        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 8px)); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(calc(-50% - 8px)); }
          100% { transform: translateX(0); }
        }
        .client-logo-box {
          background: var(--color-bg);
          height: 80px;
          min-width: 160px;
          display: flex;
          place-items: center;
          justify-content: center;
          border: 1px solid var(--color-divider);
          border-radius: 8px;
          padding: 16px;
        }
        .client-logo-box img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          filter: grayscale(100%) opacity(0.7);
          transition: filter 0.3s ease;
        }
        .client-logo-box:hover img {
          filter: grayscale(0%) opacity(1);
        }
        @media (max-width: 860px) {
           .assurance-grid {
              grid-template-columns: 1fr !important;
           }
        }
      `}</style>
      
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        <div
          className="assurance-grid"
          style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '64px', alignItems: 'center' }}
        >
          <div>
            <div
              style={{
                fontSize: '10.5px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-accent-700)',
                marginBottom: '10px',
              }}
            >
              Assurance
            </div>
            <h2 style={{ fontSize: '46px', lineHeight: '1.02', margin: '0 0 16px' }}>
              Certified, licensed, accountable.
            </h2>
            <p
              style={{
                fontSize: '15px',
                lineHeight: '1.6',
                margin: '0 0 24px',
                color: 'color-mix(in srgb,var(--color-text) 72%,transparent)',
                textWrap: 'pretty',
              }}
            >
              Gasstocks operates under ISO 9001:2015 quality management, is licensed by the NUPRC
              and registered with the NCDMB as a Category 1 Marine Vessel Operator. Certificates and
              supporting compliance documentation are supplied on request.
            </p>
            <a
              className="btn btn-secondary"
              href="#contact"
              style={{ textDecoration: 'none', padding: '11px 20px', fontSize: '15px' }}
            >
              Request the compliance pack
            </a>
          </div>
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <div className="marquee-container">
              <div className="marquee-content">
                {[...COMPANY.accreditations, ...COMPANY.accreditations].map((a, i) => (
                  <div key={i} style={tileStyle}>
                    <div style={{ flex: 1 }}>
                      <div style={headlineStyle}>{a.headline}</div>
                      <div style={detailStyle}>{a.detail}</div>
                    </div>
                    {/* @ts-ignore */}
                    {a.logo && (
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', height: '40px' }}>
                        {/* @ts-ignore */}
                        <img src={a.logo} alt={a.headline} style={{ maxHeight: '100%', maxWidth: '80px', objectFit: 'contain' }} />
                        {/* @ts-ignore */}
                        {a.logo2 && <img src={a.logo2} alt={a.headline} style={{ maxHeight: '100%', maxWidth: '80px', objectFit: 'contain' }} />}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '72px' }}>
          <div
            style={{
              fontSize: '10.5px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'color-mix(in srgb,var(--color-text) 50%,transparent)',
              marginBottom: '18px',
            }}
          >
            Selected clients &amp; principals
          </div>
          <div className="marquee-container">
            <div className="marquee-content reverse">
              {[...clientLogos, ...clientLogos, ...clientLogos].map((src, i) => (
                <div key={i} className="client-logo-box">
                  <img src={src} alt="Client logo" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

