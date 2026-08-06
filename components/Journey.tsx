'use client';

import { useScript } from '../hooks/useScript';

// The scrolled 3D world. Markup is carried over verbatim from web/index.html.
//
// public/js/gs-scene.js is loaded here rather than bundled, for two reasons:
// its class body extends HTMLElement (which throws on import in Node, so it can
// never be SSR'd or bundled), and it resolves three.js through a runtime
// import() that no bundler can analyse. Left as a classic script in public/,
// document.currentScript still resolves, so its own three.js resolution works
// untouched and the design-project re-sync stays a straight file copy.
//
// ORDERING IS LOAD-BEARING: gs-scene's boot() queries [data-gs-scroller], the
// seven [data-gs-panel]s and the nine [data-gs-node]s exactly once, with no
// MutationObserver. Loading the script from useEffect guarantees this markup is
// already in the DOM by the time it runs. Move the script earlier and scroll
// progress and all nine capability labels die silently.
export default function Journey() {
  useScript('/js/gs-scene.js');

  return (
    <>
      <div id="top" data-gs-scroller="" style={{ position: 'relative', height: '810vh' }}>
          <div data-gs-sticky="" style={{ position: 'sticky', top: '0', height: '100vh', overflow: 'hidden' }}>

            <div data-gs-stage="" style={{ position: 'absolute', inset: '0' }}>
              <gs-scene></gs-scene>
            </div>

            {/* horizon rule + running coordinates, drawn like a survey sheet */}
            <div data-gs-chrome="" style={{ position: 'absolute', left: '0', right: '0', bottom: '56px', height: '1px', background: 'var(--color-divider)', pointerEvents: 'none' }}></div>
            <div data-gs-chrome="" style={{ position: 'absolute', left: '32px', bottom: '22px', display: 'flex', gap: '24px', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '9.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-bg) 82%,transparent)', textShadow: '0 1px 3px rgba(8,16,22,0.55)', pointerEvents: 'none' }}>
              <span>Sheet 01</span><span>Sea → Shore section</span><span>Scale n.t.s.</span>
            </div>
            <div data-gs-chrome="" style={{ position: 'absolute', right: '32px', bottom: '22px', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '9.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-bg) 82%,transparent)', textShadow: '0 1px 3px rgba(8,16,22,0.55)', pointerEvents: 'none' }}>Scroll to traverse</div>

            {/* ── panel 0 · hero ── */}
            <div data-gs-panel="0" style={{ position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: '4', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'clamp(20px,3.4vh,44px)', padding: '96px 32px 92px', opacity: '1' }}>
              <div data-gs-hit="" style={{ maxWidth: '1320px', margin: '0 auto', width: '100%', pointerEvents: 'none' }}>
                <div data-gs-plate="" className="blueprint" style={{ pointerEvents: 'none', maxWidth: 'min(62%,880px)', minWidth: 'min(100%,420px)', padding: 'clamp(24px,3.4vh,40px) clamp(26px,3vw,44px) clamp(26px,3.6vh,42px)', background: 'color-mix(in srgb,var(--color-accent-900) 88%,transparent)', borderColor: 'color-mix(in srgb,var(--color-bg) 34%,transparent)', color: 'var(--color-bg)' }}>
                <i className="corner tl" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner tr" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner bl" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner br" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
                  <span style={{ width: '26px', height: '1px', background: 'var(--color-accent-300)' }}></span>
                  <span style={{ fontSize: '10.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-200)' }}>Marine & civil infrastructure contractor · est. 2008</span>
                </div>
                <h1 style={{ fontSize: 'clamp(38px,min(6.2vw,8.6vh),96px)', lineHeight: '0.94', letterSpacing: '-0.025em', margin: '0 0 clamp(14px,2.4vh,24px)', maxWidth: '16ch' }}>We build the route from vessel to shore.</h1>
                <p style={{ fontSize: 'clamp(15px,1.7vh,18px)', lineHeight: '1.5', maxWidth: '56ch', margin: '0 0 clamp(18px,3vh,30px)', color: 'color-mix(in srgb,var(--color-bg) 82%,transparent)', textWrap: 'pretty' }}>Nine disciplines under one contract: shipping, dredging, marine construction and the civil works that carry cargo inland. One accountable party from the anchorage to the last kilometre of road.</p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <a className="btn btn-primary blueprint" href="#contact" style={{ textDecoration: 'none', padding: '11px 20px', fontSize: '15px' }}>Request capability statement<i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i></a>
                  <a className="btn btn-secondary" href="#capability" style={{ textDecoration: 'none', padding: '11px 20px', fontSize: '15px', color: 'var(--color-bg)', borderColor: 'color-mix(in srgb,var(--color-bg) 45%,transparent)', background: 'transparent' }}>View capability register</a>
                </div>
                </div>
              </div>
              <div data-gs-hit="" style={{ width: '100%', maxWidth: '1320px', margin: '0 auto', pointerEvents: 'none' }}>
                <div data-gs-cols="" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--color-divider)', border: '1px solid var(--color-divider)' }}>
                  <div style={{ background: 'var(--color-bg)', padding: '14px 16px' }}><div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', lineHeight: '1' }}>2008</div><div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 52%,transparent)' }}>Year founded</div></div>
                  <div style={{ background: 'var(--color-bg)', padding: '14px 16px' }}><div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', lineHeight: '1' }}>184</div><div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 52%,transparent)' }}>Projects delivered</div></div>
                  <div style={{ background: 'var(--color-bg)', padding: '14px 16px' }}><div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', lineHeight: '1' }}>14</div><div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 52%,transparent)' }}>Countries of operation</div></div>
                  <div style={{ background: 'var(--color-bg)', padding: '14px 16px' }}><div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', lineHeight: '1' }}>09</div><div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 52%,transparent)' }}>Current accreditations</div></div>
                </div>
              </div>
            </div>

            {/* ── panel 1 · offshore ── */}
            <div data-gs-panel="1" style={{ position: 'absolute', inset: '0', pointerEvents: 'none', display: 'flex', alignItems: 'center', padding: '0 32px 60px', opacity: '0' }}>
              <div style={{ maxWidth: '1320px', margin: '0 auto', width: '100%' }}>
                <div className="blueprint" data-gs-hit="" style={{ pointerEvents: 'none', maxWidth: '480px', background: 'color-mix(in srgb,var(--color-bg) 90%,transparent)', padding: '26px 28px 28px' }}>
                  <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '14px' }}>
                    <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', color: 'var(--color-accent-700)' }}>01</span>
                    <span style={{ fontSize: '10.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>Offshore · anchorage</span>
                  </div>
                  <h2 style={{ fontSize: '44px', lineHeight: '1.02', margin: '0 0 14px' }}>Shipping &<br />marine logistics</h2>
                  <p style={{ fontSize: '15px', lineHeight: '1.6', margin: '0 0 20px', color: 'color-mix(in srgb,var(--color-text) 76%,transparent)', textWrap: 'pretty' }}>Owned and chartered tonnage moving LPG, LNG and clean petroleum products, backed by a support fleet that keeps offshore installations crewed, supplied and on schedule.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--color-divider)', border: '1px solid var(--color-divider)', marginBottom: '18px' }}>
                    <div style={{ background: 'var(--color-bg)', padding: '11px 13px' }}><div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 50%,transparent)', marginBottom: '3px' }}>Tonnage</div><div style={{ fontSize: '14px' }}>6 owned · 20+ chartered</div></div>
                    <div style={{ background: 'var(--color-bg)', padding: '11px 13px' }}><div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 50%,transparent)', marginBottom: '3px' }}>Compliance</div><div style={{ fontSize: '14px' }}>ISM · ISPS · MARPOL</div></div>
                  </div>
                  <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}><span className="tag tag-outline">Chartering</span><span className="tag tag-outline">Ship management</span><span className="tag tag-outline">Offshore supply</span><span className="tag tag-outline">Port agency</span></div>
                </div>
              </div>
            </div>

            {/* ── panel 2 · dredging ── */}
            <div data-gs-panel="2" style={{ position: 'absolute', inset: '0', pointerEvents: 'none', display: 'flex', alignItems: 'center', padding: '0 32px 60px', opacity: '0' }}>
              <div style={{ maxWidth: '1320px', margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <div className="blueprint" data-gs-hit="" style={{ pointerEvents: 'none', maxWidth: '480px', background: 'color-mix(in srgb,var(--color-bg) 90%,transparent)', padding: '26px 28px 28px' }}>
                  <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '14px' }}>
                    <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', color: 'var(--color-accent-700)' }}>02</span>
                    <span style={{ fontSize: '10.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>Approach channel · seabed</span>
                  </div>
                  <h2 style={{ fontSize: '44px', lineHeight: '1.02', margin: '0 0 14px' }}>Dredging &<br />reclamation</h2>
                  <p style={{ fontSize: '15px', lineHeight: '1.6', margin: '0 0 20px', color: 'color-mix(in srgb,var(--color-text) 76%,transparent)', textWrap: 'pretty' }}>Capital and maintenance dredging to declared depth, with surveyed tolerances and beneficial reuse of spoil for reclamation and shoreline protection.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--color-divider)', border: '1px solid var(--color-divider)', marginBottom: '18px' }}>
                    <div style={{ background: 'var(--color-bg)', padding: '11px 13px' }}><div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 50%,transparent)', marginBottom: '3px' }}>Plant</div><div style={{ fontSize: '14px' }}>CSD · TSHD · pipeline</div></div>
                    <div style={{ background: 'var(--color-bg)', padding: '11px 13px' }}><div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 50%,transparent)', marginBottom: '3px' }}>Tolerance</div><div style={{ fontSize: '14px' }}>±0.25 m to CD</div></div>
                  </div>
                  <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}><span className="tag tag-outline">Capital dredging</span><span className="tag tag-outline">Maintenance</span><span className="tag tag-outline">Reclamation</span><span className="tag tag-outline">Bathymetric survey</span></div>
                </div>
              </div>
            </div>

            {/* ── panel 3 · the berth ── */}
            <div data-gs-panel="3" style={{ position: 'absolute', inset: '0', pointerEvents: 'none', display: 'flex', alignItems: 'center', padding: '0 32px 60px', opacity: '0' }}>
              <div style={{ maxWidth: '1320px', margin: '0 auto', width: '100%' }}>
                <div className="blueprint" data-gs-hit="" style={{ pointerEvents: 'none', maxWidth: '500px', background: 'color-mix(in srgb,var(--color-bg) 90%,transparent)', padding: '26px 28px 28px' }}>
                  <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '14px' }}>
                    <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', color: 'var(--color-accent-700)' }}>03</span>
                    <span style={{ fontSize: '10.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>The berth · terminal</span>
                  </div>
                  <h2 style={{ fontSize: '44px', lineHeight: '1.02', margin: '0 0 14px' }}>Jetty construction,<br />security & catering</h2>
                  <p style={{ fontSize: '15px', lineHeight: '1.6', margin: '0 0 20px', color: 'color-mix(in srgb,var(--color-text) 76%,transparent)', textWrap: 'pretty' }}>Piled jetties, berthing and mooring dolphins and loading platforms — then the standing operation around them: exclusion-zone patrol, accommodation and galley services for the crews who run the terminal.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--color-divider)', border: '1px solid var(--color-divider)', marginBottom: '18px' }}>
                    <div style={{ background: 'var(--color-bg)', padding: '11px 13px' }}><div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 50%,transparent)', marginBottom: '3px' }}>Design code</div><div style={{ fontSize: '14px' }}>BS 6349 · Eurocode</div></div>
                    <div style={{ background: 'var(--color-bg)', padding: '11px 13px' }}><div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 50%,transparent)', marginBottom: '3px' }}>Piling</div><div style={{ fontSize: '14px' }}>Tubular to 1,220 mm</div></div>
                  </div>
                  <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}><span className="tag tag-outline">Piled jetties</span><span className="tag tag-outline">Mooring dolphins</span><span className="tag tag-outline">Marine security</span><span className="tag tag-outline">Offshore catering</span></div>
                </div>
              </div>
            </div>

            {/* ── panel 4 · onshore ── */}
            <div data-gs-panel="4" style={{ position: 'absolute', inset: '0', pointerEvents: 'none', display: 'flex', alignItems: 'center', padding: '0 32px 60px', opacity: '0' }}>
              <div style={{ maxWidth: '1320px', margin: '0 auto', width: '100%' }}>
                <div className="blueprint" data-gs-hit="" style={{ pointerEvents: 'none', maxWidth: '480px', background: 'color-mix(in srgb,var(--color-bg) 90%,transparent)', padding: '26px 28px 28px' }}>
                  <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '14px' }}>
                    <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', color: 'var(--color-accent-700)' }}>04</span>
                    <span style={{ fontSize: '10.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>Onshore · terminal & corridor</span>
                  </div>
                  <h2 style={{ fontSize: '44px', lineHeight: '1.02', margin: '0 0 14px' }}>Civil engineering,<br />roads & earthworks</h2>
                  <p style={{ fontSize: '15px', lineHeight: '1.6', margin: '0 0 20px', color: 'color-mix(in srgb,var(--color-text) 76%,transparent)', textWrap: 'pretty' }}>Tank farms, bunds, process buildings and foundations — and the access roads, drainage and bridge approaches that connect a terminal to the network it serves.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--color-divider)', border: '1px solid var(--color-divider)', marginBottom: '18px' }}>
                    <div style={{ background: 'var(--color-bg)', padding: '11px 13px' }}><div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 50%,transparent)', marginBottom: '3px' }}>Delivery</div><div style={{ fontSize: '14px' }}>Owned plant, employed supervision</div></div>
                    <div style={{ background: 'var(--color-bg)', padding: '11px 13px' }}><div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 50%,transparent)', marginBottom: '3px' }}>Standard</div><div style={{ fontSize: '14px' }}>AASHTO · ISO 9001</div></div>
                  </div>
                  <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}><span className="tag tag-outline">Tank farms</span><span className="tag tag-outline">Structural steel</span><span className="tag tag-outline">Highways</span><span className="tag tag-outline">Drainage & culverts</span></div>
                </div>
              </div>
            </div>

            {/* ── panel 5 · plant hire yard ── */}
            <div data-gs-panel="5" style={{ position: 'absolute', inset: '0', pointerEvents: 'none', display: 'flex', alignItems: 'center', padding: '0 32px 60px', opacity: '0' }}>
              <div style={{ maxWidth: '1320px', margin: '0 auto', width: '100%' }}>
                <div className="blueprint" data-gs-hit="" style={{ pointerEvents: 'none', maxWidth: '480px', background: 'color-mix(in srgb,var(--color-bg) 90%,transparent)', padding: '26px 28px 28px' }}>
                  <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '14px' }}>
                    <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', color: 'var(--color-accent-700)' }}>05</span>
                    <span style={{ fontSize: '10.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 55%,transparent)' }}>The yard · plant hire</span>
                  </div>
                  <h2 style={{ fontSize: '44px', lineHeight: '1.02', margin: '0 0 14px' }}>Equipment leasing,<br />operated or bare</h2>
                  <p style={{ fontSize: '15px', lineHeight: '1.6', margin: '0 0 20px', color: 'color-mix(in srgb,var(--color-text) 76%,transparent)', textWrap: 'pretty' }}>Excavators, tippers, dozers, compaction plant, forklifts and crawler cranes off our own hardstanding — inspected, fuelled and mobilised with operators and maintenance cover, or hired bare to your site.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--color-divider)', border: '1px solid var(--color-divider)', marginBottom: '18px' }}>
                    <div style={{ background: 'var(--color-bg)', padding: '11px 13px' }}><div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 50%,transparent)', marginBottom: '3px' }}>Fleet</div><div style={{ fontSize: '14px' }}>240 units on hire</div></div>
                    <div style={{ background: 'var(--color-bg)', padding: '11px 13px' }}><div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 50%,transparent)', marginBottom: '3px' }}>Availability</div><div style={{ fontSize: '14px' }}>96% · 24 h mobilisation</div></div>
                  </div>
                  <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}><span className="tag tag-outline">Earthmoving</span><span className="tag tag-outline">Haulage</span><span className="tag tag-outline">Lifting</span><span className="tag tag-outline">Compaction</span></div>
                </div>
              </div>
            </div>

            {/* ── panel 6 · exploded capability diagram ── */}
            <div data-gs-panel="6" style={{ position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: '3', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '96px 32px 56px', opacity: '0' }}>
              <div style={{ maxWidth: '1320px', margin: '0 auto', width: '100%' }}>
                <div data-gs-wrap="" className="blueprint" style={{ display: 'inline-block', maxWidth: 'min(100%,600px)', padding: '22px 30px 24px', background: 'color-mix(in srgb,var(--color-accent-900) 88%,transparent)', borderColor: 'color-mix(in srgb,var(--color-bg) 34%,transparent)', color: 'var(--color-bg)' }}>
                  <i className="corner tl" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner tr" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner bl" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner br" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '11px', color: 'var(--color-accent-200)' }}>06</span>
                    <span style={{ fontSize: '10.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-bg) 72%,transparent)' }}>Capability diagram · exploded</span>
                  </div>
                  <h2 style={{ fontSize: 'clamp(30px,4vw,44px)', lineHeight: '1.04', margin: '0' }}>Nine disciplines.<br />One contract.</h2>
                </div>
              </div>
            </div>

            {/* ── exploded-view callouts (positioned by the scene) ── */}
            <svg data-gs-leaders="" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '2', opacity: '0' }} aria-hidden="true"></svg>
            <div data-gs-labels="" style={{ position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: '4' }}>
              <div data-gs-node="vessel" tabIndex={0} style={{ position: 'absolute', top: '0', left: '0', opacity: '0', willChange: 'transform', padding: '6px 11px', border: '1px solid var(--color-accent-700)', background: 'var(--color-bg)', whiteSpace: 'nowrap', cursor: 'default' }}><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '9.5px', color: 'var(--color-accent-700)', marginRight: '8px' }}>01</span><span style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '14px', letterSpacing: '0.04em' }}>Vessel charter & hire</span></div>
              <div data-gs-node="logistics" tabIndex={0} style={{ position: 'absolute', top: '0', left: '0', opacity: '0', willChange: 'transform', padding: '6px 11px', border: '1px solid var(--color-accent-700)', background: 'var(--color-bg)', whiteSpace: 'nowrap', cursor: 'default' }}><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '9.5px', color: 'var(--color-accent-700)', marginRight: '8px' }}>02</span><span style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '14px', letterSpacing: '0.04em' }}>Offshore & marine logistics</span></div>
              <div data-gs-node="dredging" tabIndex={0} style={{ position: 'absolute', top: '0', left: '0', opacity: '0', willChange: 'transform', padding: '6px 11px', border: '1px solid var(--color-accent-700)', background: 'var(--color-bg)', whiteSpace: 'nowrap', cursor: 'default' }}><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '9.5px', color: 'var(--color-accent-700)', marginRight: '8px' }}>03</span><span style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '14px', letterSpacing: '0.04em' }}>Dredging & land reclamation</span></div>
              <div data-gs-node="jetty" tabIndex={0} style={{ position: 'absolute', top: '0', left: '0', opacity: '0', willChange: 'transform', padding: '6px 11px', border: '1px solid var(--color-accent-700)', background: 'var(--color-bg)', whiteSpace: 'nowrap', cursor: 'default' }}><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '9.5px', color: 'var(--color-accent-700)', marginRight: '8px' }}>04</span><span style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '14px', letterSpacing: '0.04em' }}>Jetty & marine construction</span></div>
              <div data-gs-node="security" tabIndex={0} style={{ position: 'absolute', top: '0', left: '0', opacity: '0', willChange: 'transform', padding: '6px 11px', border: '1px solid var(--color-accent-700)', background: 'var(--color-bg)', whiteSpace: 'nowrap', cursor: 'default' }}><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '9.5px', color: 'var(--color-accent-700)', marginRight: '8px' }}>05</span><span style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '14px', letterSpacing: '0.04em' }}>Marine security & escort</span></div>
              <div data-gs-node="catering" tabIndex={0} style={{ position: 'absolute', top: '0', left: '0', opacity: '0', willChange: 'transform', padding: '6px 11px', border: '1px solid var(--color-accent-700)', background: 'var(--color-bg)', whiteSpace: 'nowrap', cursor: 'default' }}><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '9.5px', color: 'var(--color-accent-700)', marginRight: '8px' }}>06</span><span style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '14px', letterSpacing: '0.04em' }}>Offshore catering</span></div>
              <div data-gs-node="civil" tabIndex={0} style={{ position: 'absolute', top: '0', left: '0', opacity: '0', willChange: 'transform', padding: '6px 11px', border: '1px solid var(--color-accent-700)', background: 'var(--color-bg)', whiteSpace: 'nowrap', cursor: 'default' }}><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '9.5px', color: 'var(--color-accent-700)', marginRight: '8px' }}>07</span><span style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '14px', letterSpacing: '0.04em' }}>Civil & structural engineering</span></div>
              <div data-gs-node="roads" tabIndex={0} style={{ position: 'absolute', top: '0', left: '0', opacity: '0', willChange: 'transform', padding: '6px 11px', border: '1px solid var(--color-accent-700)', background: 'var(--color-bg)', whiteSpace: 'nowrap', cursor: 'default' }}><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '9.5px', color: 'var(--color-accent-700)', marginRight: '8px' }}>08</span><span style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '14px', letterSpacing: '0.04em' }}>Roads & earthworks</span></div>
              <div data-gs-node="leasing" tabIndex={0} style={{ position: 'absolute', top: '0', left: '0', opacity: '0', willChange: 'transform', padding: '6px 11px', border: '1px solid var(--color-accent-700)', background: 'var(--color-bg)', whiteSpace: 'nowrap', cursor: 'default' }}><span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '9.5px', color: 'var(--color-accent-700)', marginRight: '8px' }}>09</span><span style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '14px', letterSpacing: '0.04em' }}>Equipment & plant hire</span></div>
            </div>

          </div>
        </div>
    </>
  );
}
