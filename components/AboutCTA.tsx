'use client';

interface AboutCTAProps {
  onContactClick: () => void;
}

export default function AboutCTA({ onContactClick }: AboutCTAProps) {
  return (
    <section
      style={{
        padding: '80px 32px',
        background: 'var(--color-neutral-900)',
        color: '#fff',
        textAlign: 'center',
        borderTop: '1px solid var(--color-divider)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <h3 style={{ color: '#fff', fontSize: '28px', marginBottom: '16px' }}>
          Ready to partner with Gasstocks?
        </h3>
        <p style={{ color: 'color-mix(in srgb, #fff 70%, transparent)', fontSize: '15px', marginBottom: '32px', lineHeight: 1.6 }}>
          Reach out to discuss your marine logistics, civil engineering, or vessel chartering requirements with our expert team.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="#capability"
            className="btn btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: '14px',
              textDecoration: 'none',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-bg)',
            }}
          >
            View Services
          </a>
          <button
            onClick={onContactClick}
            className="btn btn-primary blueprint"
            style={{
              padding: '12px 28px',
              fontSize: '14px',
              color: '#fff',
              background: 'transparent',
              borderColor: 'color-mix(in srgb, #fff 40%, transparent)',
            }}
          >
            <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
            Get in touch
          </button>
        </div>
      </div>
    </section>
  );
}
