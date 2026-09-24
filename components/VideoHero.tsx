// Corporate hero variant: full-bleed looping video with a restrained copy
// block. Alternates with the 3D <Journey /> — see lib/hero-variant.ts.
const white = 'var(--color-bg)';
const softWhite = 'color-mix(in srgb,var(--color-bg) 82%,transparent)';

const stats = [
  ['2008', 'Operating since'],
  ['8', 'IOC & operator clients'],
  ['ISO 9001', 'Certified quality system'],
];

export default function VideoHero() {
  return (
    <section
      id="top"
      style={{ position: 'relative', minHeight: '100svh', overflow: 'hidden', background: 'var(--color-accent-900)', color: white, display: 'flex', flexDirection: 'column' }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/assets/supply-boat.avif"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <source src="/assets/hero-video.mp4" type="video/mp4" />
      </video>

      {/* legibility scrim: heavier on the left where the copy sits */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, color-mix(in srgb,var(--color-accent-900) 88%,transparent) 0%, color-mix(in srgb,var(--color-accent-900) 55%,transparent) 55%, color-mix(in srgb,var(--color-accent-900) 25%,transparent) 100%), linear-gradient(0deg, color-mix(in srgb,#000 45%,transparent), transparent 40%)' }}
      />

      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', padding: '120px 32px 48px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', width: '100%' }}>
          <div style={{ maxWidth: '760px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
              <span style={{ width: '26px', height: '1px', background: 'var(--color-accent-300)' }}></span>
              <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-200)' }}>Indigenous oil & gas services · RC 359117 · est. 2008</span>
            </div>
            <h1 style={{ fontSize: 'clamp(40px,6vw,88px)', lineHeight: '0.96', letterSpacing: '-0.02em', margin: '0 0 24px', maxWidth: '16ch', color: white }}>
              Marine and engineering support for Nigeria&apos;s oil and gas industry.
            </h1>
            <p style={{ fontSize: 'clamp(15px,1.25vw,18px)', lineHeight: '1.55', maxWidth: '56ch', margin: '0 0 32px', color: softWhite, textWrap: 'pretty' }}>
              Swamp and deep offshore logistics, pipelines and fabrication, instrumentation and procurement, trusted by SPDC, Chevron, TotalEnergies and NLNG. We run it from Port Harcourt, Lagos and Houston.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a className="btn btn-primary" href="#contact" style={{ textDecoration: 'none', padding: '12px 22px', fontSize: '15px' }}>Request capability statement</a>
              <a className="btn btn-secondary" href="#capability" style={{ textDecoration: 'none', padding: '12px 22px', fontSize: '15px', color: white, borderColor: 'color-mix(in srgb,var(--color-bg) 45%,transparent)', background: 'transparent' }}>View capability register</a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', borderTop: '1px solid color-mix(in srgb,var(--color-bg) 22%,transparent)', padding: '20px 32px 28px' }}>
        <dl style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '16px 56px' }}>
          {stats.map(([value, label]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column-reverse' }}>
              <dt style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: softWhite }}>{label}</dt>
              <dd style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-heading-weight)' as never, fontSize: '28px', lineHeight: 1.1 }}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
