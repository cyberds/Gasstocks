import { COMPANY } from '../lib/company';

/* Assurance — compliance standing, and nothing more than can be evidenced.
 *
 * This section previously advertised ISO 14001, ISO 45001, ISM Code DOC,
 * ISO 22000 and a NIMASA cabotage licence, none of which the company holds;
 * they were design placeholder copy carried over from the original build. The
 * tiles now come from COMPANY.accreditations, which is documented as
 * evidence-only — so the way to change what appears here is to change that
 * list, and the way to justify changing that list is to have the certificate.
 *
 * The supporting copy was softened for the same reason: it used to promise
 * insurance schedules, audited accounts and third-party audit reports under
 * NDA. It now commits only to certificates and compliance documentation, which
 * is what the company can reliably produce on request.
 */

const tileStyle = { background: 'var(--color-bg)', padding: '18px 16px' };
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

export default function Assurance() {
  return (
    <section id="assurance" style={{ padding: '96px 32px' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        <div
          data-gs-cols=""
          style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '64px', alignItems: 'start' }}
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
          <div>
            <div
              data-gs-cols2=""
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3,1fr)',
                gap: '1px',
                background: 'var(--color-divider)',
                border: '1px solid var(--color-divider)',
              }}
            >
              {COMPANY.accreditations.map((a) => (
                <div key={a.headline} style={tileStyle}>
                  <div style={headlineStyle}>{a.headline}</div>
                  <div style={detailStyle}>{a.detail}</div>
                </div>
              ))}
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
          {/* Six placeholder marks, awaiting real client logos. */}
          <div
            data-gs-cols2=""
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6,1fr)',
              gap: '1px',
              background: 'var(--color-divider)',
              border: '1px solid var(--color-divider)',
            }}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--color-bg)',
                  height: '76px',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'ui-monospace,Menlo,monospace',
                  fontSize: '9.5px',
                  letterSpacing: '0.14em',
                  color: 'color-mix(in srgb,var(--color-text) 40%,transparent)',
                }}
              >
                CLIENT MARK
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
