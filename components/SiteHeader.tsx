// Generated from web/index.html — markup carried over verbatim.
// Inline styles are the design's source of truth (see web/README.md); edit them
// here rather than re-deriving them into classes.

export default function SiteHeader() {
  return (
    <>
      <header style={{ position: 'fixed', top: '0', left: '0', right: '0', zIndex: '60', display: 'flex', alignItems: 'center', gap: '28px', padding: '14px 32px', background: 'color-mix(in srgb, var(--color-bg) 84%, transparent)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--color-divider)' }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'baseline', gap: '9px', marginRight: 'auto', textDecoration: 'none', color: 'inherit' }}>
            <img src="/assets/logo-3d.png" alt="Gasstocks Limited" style={{ height: '34px', width: 'auto', display: 'block' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 48%,transparent)' }}>RC359117</span>
          </a>
          <nav data-gs-topnav="" style={{ display: 'flex', gap: '22px', fontSize: '13px', letterSpacing: '0.02em' }}>
            <a href="#about" style={{ color: 'inherit' }}>About</a>
            <a href="#leasing" style={{ textDecoration: 'none', color: 'inherit', fontSize: '13px', letterSpacing: '0.06em' }}>Equipment leasing</a>
            <a href="#capability" style={{ color: 'inherit' }}>Capability</a>
            <a href="#record" style={{ color: 'inherit' }}>Track record</a>
            <a href="#assurance" style={{ color: 'inherit' }}>Assurance</a>
            <a href="#contact" style={{ color: 'inherit' }}>Contact</a>
          </nav>
          <a className="btn btn-primary blueprint" data-gs-navcta="" href="#contact" style={{ textDecoration: 'none' }}>
            Request capability statement
            <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
          </a>
        </header>
    </>
  );
}
