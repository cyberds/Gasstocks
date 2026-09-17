'use client';

import { useRef } from 'react';
import { useRail } from '../hooks/useRail';
import { servicesInGroup } from '../lib/services';

// Marine services — the flagship line. Same rail markup and behaviour as
// LeasingRail; names and copy come from lib/services.ts so the page and the
// chatbot stay in step. Photos are Unsplash stock.

const PHOTOS: Record<string, { src: string; alt: string }> = Object.fromEntries(
  [
  { id: 'marine-logistics', src: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=70', alt: 'Cargo ships alongside a container terminal' },
  { id: 'vessel-charter', src: 'https://images.unsplash.com/photo-1609337231803-2adad48ea1d1?auto=format&fit=crop&w=900&q=70', alt: 'Red offshore construction vessel at sea' },
  { id: 'offshore-support', src: 'https://images.unsplash.com/photo-1749073668528-38ab64575f5d?auto=format&fit=crop&w=900&q=70', alt: 'Supply vessel servicing an offshore rig' },
  { id: 'marine-transportation', src: 'https://images.unsplash.com/photo-1617952739858-28043cecdae3?auto=format&fit=crop&w=900&q=70', alt: 'Cargo ship under way on open sea' },
  { id: 'barge-workboat', src: 'https://images.unsplash.com/photo-1664029992353-e9089ff951d4?auto=format&fit=crop&w=900&q=70', alt: 'Crane barge and tug handling a heavy load' },
  { id: 'marine-procurement', src: 'https://images.unsplash.com/photo-1587149185211-28a2ef4c9a10?auto=format&fit=crop&w=900&q=70', alt: 'Stacked cargo containers at port' },
  { id: 'vessel-mobilisation', src: 'https://images.unsplash.com/photo-1647629037458-c5c6e8463f74?auto=format&fit=crop&w=900&q=70', alt: 'Workboat hull on the hard for inspection' },
  { id: 'offshore-project-logistics', src: 'https://images.unsplash.com/photo-1629540946404-ebe133e99f49?auto=format&fit=crop&w=900&q=70', alt: 'Semi-submersible drilling rig in harbour' },
  { id: 'fleet-management', src: 'https://images.unsplash.com/photo-1669235124385-099d158ae025?auto=format&fit=crop&w=900&q=70', alt: 'Tugboats moored together in a harbour' },
  ].map(({ id, ...p }) => [id, p]),
);

export default function MarineRail() {
  const rail = useRef<HTMLDivElement>(null);
  useRail(rail);
  const cards = servicesInGroup('Marine & vessels');

  return (
    <section id="marine" className="gs-showcase" aria-label="Marine services" style={{ paddingTop: '104px' }}>
      <div className="gs-showcase-head">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ width: '26px', height: '1px', background: 'var(--color-accent)' }}></span>
            <span style={{ fontSize: '10.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-700)' }}>Flagship service · marine</span>
          </div>
          <h2 style={{ maxWidth: '19ch' }}>Marine services, from charter to fleet management.</h2>
        </div>
        <p style={{ fontSize: '14px', lineHeight: '1.6', maxWidth: '38ch', margin: '0', color: 'color-mix(in srgb,var(--color-text) 65%,transparent)', textWrap: 'pretty' }}>Vessels, crews and logistics for swamp, shallow-water and offshore operations across Nigeria — planned, mobilised and managed under one contract.</p>
      </div>

      <div ref={rail} className="gs-rail" data-gs-rail="" role="group" aria-roledescription="carousel" aria-label="Marine services" tabIndex={0}>
        <div className="gs-viewport">
          <div className="gs-track" data-gs-track="">
            {cards.map((s, i) => (
              <article key={s.id} className="gs-eq-card" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${cards.length}`}>
                <div className="gs-eq-media">
                  {PHOTOS[s.id] && <img src={PHOTOS[s.id].src} alt={PHOTOS[s.id].alt} loading="lazy" decoding="async" />}
                </div>
                <div className="gs-eq-body">
                  <div className="card-kicker">{String(i + 1).padStart(2, '0')} / Marine</div>
                  <div className="card-title">{s.name}</div>
                  <p className="card-body">{s.covers}</p>
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
                {cards.map((c, i) => (
                  <button key={c.id} className="gs-dot" type="button" data-gs-dot="" aria-label={`Go to slide ${i + 1}`}></button>
                ))}
              </div>
            </div>

        <div data-gs-live="" aria-live="polite" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}></div>
      </div>

      <div style={{ maxWidth: '1320px', margin: '40px auto 0', padding: '0 32px' }}>
        <a className="btn btn-primary" href="/services/marine-vessels" style={{ textDecoration: 'none' }}>Explore marine services</a>
      </div>
    </section>
  );
}
