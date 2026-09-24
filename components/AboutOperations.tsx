import { JETTIES, LOGISTICS_BASES, LOGISTICS_SPREAD, TRACK_RECORD } from '../lib/company';

/* Where Gasstocks works from and what it has delivered — the concrete half of
   the business profile (logistics bases, jetties, contract history). All data
   lives in lib/company.ts. */

const kicker = {
  fontSize: '11px',
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  color: 'var(--color-accent)',
  marginBottom: '14px',
  fontWeight: 600,
};

const muted = { fontSize: '14px', lineHeight: 1.6, color: 'var(--color-neutral-700)' };

export default function AboutOperations() {
  return (
    <section id="operations" style={{ padding: '120px 32px', borderTop: '1px solid var(--color-divider)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '800px', marginBottom: '56px' }}>
          <div style={kicker}>Where we operate</div>
          <h2 style={{ fontSize: '38px', lineHeight: 1.15, marginBottom: '20px' }}>
            Bases at home and abroad, and jetties across the Niger Delta.
          </h2>
          <p style={{ ...muted, margin: 0 }}>
            With our strategic partners we operate logistics bases in Nigeria and overseas. Gasstocks
            Inc., our Houston subsidiary, coordinates overseas cargo and partnerships, and our Port
            Harcourt and Lagos offices run in-country logistics.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '96px' }}>
          <div className="blueprint" style={{ padding: '32px', background: 'var(--color-surface)' }}>
            <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
            <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Logistics bases</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {LOGISTICS_BASES.map((b) => (
                <span key={b} className="tag tag-outline">{b}</span>
              ))}
            </div>
          </div>
          <div className="blueprint" style={{ padding: '32px', background: 'var(--color-surface)' }}>
            <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
            <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Accessible jetties &amp; yards</h3>
            <ul style={{ ...muted, margin: 0, paddingLeft: '18px', columns: '2 220px', columnGap: '24px' }}>
              {JETTIES.map((j) => (
                <li key={j} style={{ breakInside: 'avoid', marginBottom: '4px' }}>{j}</li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ maxWidth: '800px', marginBottom: '32px' }}>
          <div style={kicker}>A few of what we have done</div>
          <h2 style={{ fontSize: '38px', lineHeight: 1.15, marginBottom: '20px' }}>
            Contract history with Shell (SPDC) and Eroton.
          </h2>
          <p style={{ ...muted, margin: 0 }}>
            A &ldquo;full marine logistics spread&rdquo; covers {LOGISTICS_SPREAD.toLowerCase()}.
          </p>
        </div>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="table" style={{ fontSize: '14px', minWidth: '720px' }}>
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Period</th>
                <th style={{ width: '110px' }}>Client</th>
                <th>Contract</th>
                <th>Scope</th>
              </tr>
            </thead>
            <tbody>
              {TRACK_RECORD.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12px', whiteSpace: 'nowrap' }}>{r.period}</td>
                  <td>{r.client}</td>
                  <td style={{ fontWeight: 600 }}>{r.contract}</td>
                  <td>{r.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
