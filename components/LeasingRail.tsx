'use client';

import { useRef } from 'react';
import { useRail } from '../hooks/useRail';

// Markup carried over verbatim from web/index.html; behaviour lives in
// hooks/useRail.ts, which is the port of web/js/showcase.js.

export default function LeasingRail() {
  const rail = useRef<HTMLDivElement>(null);
  useRail(rail);

  return (
    <>
      <section id="leasing" className="gs-showcase" aria-label="Equipment fleet" style={{ paddingTop: '104px' }}>
          <div className="gs-showcase-head">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ width: '26px', height: '1px', background: 'var(--color-accent)' }}></span>
                <span style={{ fontSize: '10.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-700)' }}>Equipment · plant & marine hire</span>
              </div>
              <h2 style={{ maxWidth: '19ch' }}>Owned plant and vessels, on hire — bare or operated.</h2>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', maxWidth: '38ch', margin: '0', color: 'color-mix(in srgb,var(--color-text) 65%,transparent)', textWrap: 'pretty' }}>One yard, one maintenance regime, one contract. The same fleet that builds our own jetties and roads — and the barges and tugs that move cargo between them — goes out on hire, with servicing, fuel and certified operators included on request.</p>
          </div>

          <div ref={rail} className="gs-rail" data-gs-rail="" role="group" aria-roledescription="carousel" aria-label="Equipment fleet" tabIndex={0}>
            <div className="gs-viewport">
              <div className="gs-track" data-gs-track="">

                <article className="gs-eq-card" role="group" aria-roledescription="slide" aria-label="1 of 6">
                  <div className="gs-eq-media"><img src="https://images.unsplash.com/photo-1587919968590-fbc98cea6c9a?auto=format&fit=crop&w=900&q=70" alt="Tracked excavator on rocky ground" loading="lazy" decoding="async" /></div>
                  <div className="gs-eq-body">
                    <div className="card-kicker">Earthmoving</div>
                    <div className="card-title">Excavators & dozers</div>
                    <p className="card-body">13–45 t tracked excavators, D6–D8 class bulldozers, wheeled loaders.</p>
                    <div className="card-meta">Bare or operated</div>
                  </div>
                </article>

                <article className="gs-eq-card" role="group" aria-roledescription="slide" aria-label="2 of 6">
                  <div className="gs-eq-media"><img src="https://images.unsplash.com/photo-1671022412547-75c4cb01f47e?auto=format&fit=crop&w=900&q=70" alt="Tipper truck dumping a load on site" loading="lazy" decoding="async" /></div>
                  <div className="gs-eq-body">
                    <div className="card-kicker">Haulage</div>
                    <div className="card-title">Tipper trucks</div>
                    <p className="card-body">10–30 m³ rigid and articulated tippers, water bowsers and low-loaders.</p>
                    <div className="card-meta">Daily or monthly hire</div>
                  </div>
                </article>

                <article className="gs-eq-card" role="group" aria-roledescription="slide" aria-label="3 of 6">
                  <div className="gs-eq-media"><img src="https://images.unsplash.com/photo-1782748005472-b3e281bd3ad7?auto=format&fit=crop&w=900&q=70" alt="Road roller parked on a compacted path" loading="lazy" decoding="async" /></div>
                  <div className="gs-eq-body">
                    <div className="card-kicker">Compaction</div>
                    <div className="card-title">Rollers & compactors</div>
                    <p className="card-body">Single and double-drum vibratory rollers, pneumatic tyred and plate compactors.</p>
                    <div className="card-meta">Pavement-certified</div>
                  </div>
                </article>

                <article className="gs-eq-card" role="group" aria-roledescription="slide" aria-label="4 of 6">
                  <div className="gs-eq-media"><img src="https://images.unsplash.com/photo-1658490261406-5a82631e56f4?auto=format&fit=crop&w=900&q=70" alt="Yellow mobile crane lifting a container" loading="lazy" decoding="async" /></div>
                  <div className="gs-eq-body">
                    <div className="card-kicker">Lifting</div>
                    <div className="card-title">Cranes & forklifts</div>
                    <p className="card-body">Crawler cranes to 250 t, mobile cranes, 3–16 t forklifts and telehandlers.</p>
                    <div className="card-meta">LOLER-inspected · operator supplied</div>
                  </div>
                </article>

                <article className="gs-eq-card" role="group" aria-roledescription="slide" aria-label="5 of 6">
                  <div className="gs-eq-media"><img src="https://images.unsplash.com/photo-1770929685619-464ab5be1119?auto=format&fit=crop&w=900&q=70" alt="A barge under tow on open water" loading="lazy" decoding="async" /></div>
                  <div className="gs-eq-body">
                    <div className="card-kicker">Marine assets</div>
                    <div className="card-title">Barges & pontoons</div>
                    <p className="card-body">Flat-top and spud-leg cargo barges, jack-up and heavy-lift support, pontoons for temporary works platforms.</p>
                    <div className="card-meta">Flat-top, spud-leg &amp; jack-up</div>
                  </div>
                </article>

                <article className="gs-eq-card" role="group" aria-roledescription="slide" aria-label="6 of 6">
                  <div className="gs-eq-media"><img src="https://images.unsplash.com/photo-1712632459629-1fad60012803?auto=format&fit=crop&w=900&q=70" alt="A tugboat under way at sea" loading="lazy" decoding="async" /></div>
                  <div className="gs-eq-body">
                    <div className="card-kicker">Marine assets</div>
                    <div className="card-title">Tugs & workboats</div>
                    <p className="card-body">Harbour and escort tugs, crew and utility workboats for towage, mooring assistance and offshore support.</p>
                    <div className="card-meta">Bare or crewed charter</div>
                  </div>
                </article>

              </div>
            </div>

            <div className="gs-controls">
              <button className="gs-arrow" type="button" data-gs-prev="" aria-label="Previous slide">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M9.5 1.5 3.5 7.5l6 6" stroke="currentColor" strokeWidth="1.4" /></svg>
              </button>
              <button className="gs-arrow" type="button" data-gs-next="" aria-label="Next slide">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M5.5 1.5l6 6-6 6" stroke="currentColor" strokeWidth="1.4" /></svg>
              </button>
              <div className="gs-dots">
                <button className="gs-dot" type="button" data-gs-dot="" aria-label="Go to slide 1"></button>
                <button className="gs-dot" type="button" data-gs-dot="" aria-label="Go to slide 2"></button>
                <button className="gs-dot" type="button" data-gs-dot="" aria-label="Go to slide 3"></button>
                <button className="gs-dot" type="button" data-gs-dot="" aria-label="Go to slide 4"></button>
                <button className="gs-dot" type="button" data-gs-dot="" aria-label="Go to slide 5"></button>
                <button className="gs-dot" type="button" data-gs-dot="" aria-label="Go to slide 6"></button>
              </div>
            </div>

            <div data-gs-live="" aria-live="polite" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}></div>
          </div>

          <div style={{ maxWidth: '1320px', margin: '40px auto 0', padding: '0 32px' }}>
            <div className="blueprint" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px 32px', padding: '24px 28px', background: 'var(--color-accent-900)', borderColor: 'color-mix(in srgb,var(--color-bg) 34%,transparent)', color: 'var(--color-bg)' }}>
              <i className="corner tl" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner tr" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner bl" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner br" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i>
              <div style={{ fontSize: '14px', lineHeight: '1.55', maxWidth: '52ch', color: 'color-mix(in srgb,var(--color-bg) 82%,transparent)' }}>
                One yard, one maintenance regime, one contract — plant and vessels on hire bare or
                operated, with servicing, fuel and certified operators available on request.
              </div>
              <a className="btn btn-primary" href="#contact" style={{ textDecoration: 'none' }}>Request a hire rate</a>
            </div>
          </div>
        </section>
    </>
  );
}
