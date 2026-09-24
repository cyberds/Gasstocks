'use client';

import { useRef } from 'react';
import { useRail } from '../hooks/useRail';

// Markup carried over from web/index.html; behaviour lives in hooks/useRail.ts.
// Cards follow the equipment page of the Gasstocks business profile. Photos are
// Unsplash stock, not Gasstocks' own units.

const CARDS = [
  { kicker: 'Towage', title: 'River & ocean tugboats', body: 'River tugs at 500, 800 and 1,000 hp, plus ocean-going tugs for barge moves and offshore towage.', meta: 'With crew', img: 'https://images.unsplash.com/photo-1712632459629-1fad60012803?auto=format&fit=crop&w=900&q=70', alt: 'A tugboat under way at sea' },
  { kicker: 'Cargo', title: 'Ramp & dump barges', body: 'Ramp barges of 500, 800 and 1,000 t and dump barges up to 1,500 t, plus lay, fuel and jack-up barges.', meta: 'Swamp & shallow water', img: 'https://images.unsplash.com/photo-1770929685619-464ab5be1119?auto=format&fit=crop&w=900&q=70', alt: 'A barge under tow on open water' },
  { kicker: 'Personnel', title: 'Crew boats & fast supply vessel', body: 'Passenger crew boats of 40 to 60 seats at 20–25 knots, and a 64-passenger fast supply vessel with 18 berths.', meta: 'Crew change & supply', img: 'https://images.unsplash.com/photo-1609337231803-2adad48ea1d1?auto=format&fit=crop&w=900&q=70', alt: 'Offshore vessel at sea' },
  { kicker: 'Accommodation', title: 'Houseboats', body: '40-, 60- and 80-man houseboats and accommodation barges, with catering, water and waste handled.', meta: 'Catering with Courdeau', img: 'https://images.unsplash.com/photo-1629540946404-ebe133e99f49?auto=format&fit=crop&w=900&q=70', alt: 'Offshore accommodation unit in harbour' },
  { kicker: 'Security', title: 'Security, patrol & hovercraft', body: 'Security vessels manned by the Navy, Army and Police, 25-knot patrol boats, and 12-person hovercraft for shallow creeks.', meta: 'NSCDC-licensed', img: 'https://images.unsplash.com/photo-1669235124385-099d158ae025?auto=format&fit=crop&w=900&q=70', alt: 'Workboats moored together in a harbour' },
  { kicker: 'Lifting & subsea', title: 'Cranes & ROVs', body: 'Cranes at 30, 50, 60 and 80 t, remotely operated vehicles, and a DP3 multipurpose offshore construction vessel.', meta: 'Operators supplied', img: 'https://images.unsplash.com/photo-1658490261406-5a82631e56f4?auto=format&fit=crop&w=900&q=70', alt: 'A mobile crane lifting a load' },
  { kicker: 'Swamp', title: 'Swamp buggies', body: 'Amphibious equipment for swamp and land operations, leased with specialised manpower to run it.', meta: 'Land, swamp & offshore', img: 'https://images.unsplash.com/photo-1587919968590-fbc98cea6c9a?auto=format&fit=crop&w=900&q=70', alt: 'Tracked excavator on soft ground' },
];

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
                <span style={{ fontSize: '10.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-700)' }}>Fleet & equipment · lease or charter</span>
              </div>
              <h2 style={{ maxWidth: '19ch' }}>Vessels and heavy equipment, crewed and maintained.</h2>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', maxWidth: '38ch', margin: '0', color: 'color-mix(in srgb,var(--color-text) 65%,transparent)', textWrap: 'pretty' }}>Our own vessels and equipment, plus access to key owners&apos; fleets at short notice. Every vessel carries communications suited to its area, including GPS tracking, and is insured for hull, public liability and group life.</p>
          </div>

          <div ref={rail} className="gs-rail" data-gs-rail="" role="group" aria-roledescription="carousel" aria-label="Equipment fleet" tabIndex={0}>
            <div className="gs-viewport">
              <div className="gs-track" data-gs-track="">
                {CARDS.map((c, i) => (
                  <article key={c.title} className="gs-eq-card" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${CARDS.length}`}>
                    <div className="gs-eq-media"><img src={c.img} alt={c.alt} loading="lazy" decoding="async" /></div>
                    <div className="gs-eq-body">
                      <div className="card-kicker">{c.kicker}</div>
                      <div className="card-title">{c.title}</div>
                      <p className="card-body">{c.body}</p>
                      <div className="card-meta">{c.meta}</div>
                    </div>
                  </article>
                ))}
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
                {CARDS.map((c, i) => (
                  <button key={c.title} className="gs-dot" type="button" data-gs-dot="" aria-label={`Go to slide ${i + 1}`}></button>
                ))}
              </div>
            </div>

            <div data-gs-live="" aria-live="polite" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}></div>
          </div>

          <div style={{ maxWidth: '1320px', margin: '40px auto 0', padding: '0 32px' }}>
            <div className="blueprint" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px 32px', padding: '24px 28px', background: 'var(--color-accent-900)', borderColor: 'color-mix(in srgb,var(--color-bg) 34%,transparent)', color: 'var(--color-bg)' }}>
              <i className="corner tl" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner tr" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner bl" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner br" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i>
              <div style={{ fontSize: '14px', lineHeight: '1.55', maxWidth: '52ch', color: 'color-mix(in srgb,var(--color-bg) 82%,transparent)' }}>
                A strict maintenance culture keeps every unit in shape. We lease for land, swamp and deep
                offshore work, with the specialised manpower to run the equipment.
              </div>
              <a className="btn btn-primary" href="#contact" style={{ textDecoration: 'none' }}>Request availability</a>
            </div>
          </div>
        </section>
    </>
  );
}
