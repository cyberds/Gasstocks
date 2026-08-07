// Generated from web/index.html — markup carried over verbatim.
// Inline styles are the design's source of truth (see web/README.md); edit them
// here rather than re-deriving them into classes.

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer style={{ padding: '28px 32px', borderTop: '1px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', fontSize: '11.5px', color: 'color-mix(in srgb,var(--color-text) 52%,transparent)' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '14px', letterSpacing: '0.13em', color: 'var(--color-text)' }}>GASSTOCKS</span>
          <span>Marine & civil infrastructure · operating since 2008</span>
          <span>© {currentYear} Gasstocks. All rights reserved.</span>
        </footer>
    </>
  );
}
