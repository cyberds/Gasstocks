'use client';

import { useScript } from '../hooks/useScript';

// Generated from web/index.html — markup carried over verbatim.
// Inline styles are the design's source of truth (see web/README.md); edit them
// here rather than re-deriving them into classes.
//
// The three <image-slot> elements are rendered as LEAVES with no children:
// public/js/image-slot.js overwrites its own innerHTML, so anything React put
// inside would be destroyed on connect and then fought over on every render.

export default function TrackRecord() {
  useScript('/js/image-slot.js');

  return (
    <>
      <section id="record" style={{ padding: '96px 32px', background: 'var(--color-accent-900)', color: 'var(--color-bg)' }}>
          <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
            <div style={{ fontSize: '10.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-bg) 62%,transparent)', marginBottom: '10px' }}>Track record</div>
            <h2 style={{ fontSize: '46px', lineHeight: '1.02', margin: '0 0 40px', maxWidth: '20ch', color: 'var(--color-bg)' }}>Delivered, commissioned and handed over.</h2>
            <div data-gs-cols="" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '26px' }}>
              <figure className="blueprint" style={{ borderColor: 'color-mix(in srgb,var(--color-bg) 30%,transparent)', padding: '0' }}>
                <i className="corner tl" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner tr" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner bl" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner br" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i>
                <div className="duotone" style={{ height: '220px' }}><image-slot id="gs-proj-1" shape="rect" placeholder="LPG import jetty — site photo"></image-slot></div>
                <figcaption style={{ padding: '16px 18px 18px', color: 'var(--color-bg)' }}>
                  <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '10px', letterSpacing: '0.14em', color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)', marginBottom: '6px' }}>PROJECT 147 · 2022–2024</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '20px', lineHeight: '1.15', marginBottom: '6px' }}>LPG import jetty & approach channel</div>
                  <div style={{ fontSize: '13px', lineHeight: '1.5', color: 'color-mix(in srgb,var(--color-bg) 74%,transparent)' }}>240 m piled jetty, two berthing dolphins, 1.9 Mm³ capital dredging to −11.5 m CD.</div>
                </figcaption>
              </figure>
              <figure className="blueprint" style={{ borderColor: 'color-mix(in srgb,var(--color-bg) 30%,transparent)', padding: '0' }}>
                <i className="corner tl" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner tr" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner bl" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner br" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i>
                <div className="duotone" style={{ height: '220px' }}><image-slot id="gs-proj-2" shape="rect" placeholder="Terminal access road — site photo"></image-slot></div>
                <figcaption style={{ padding: '16px 18px 18px', color: 'var(--color-bg)' }}>
                  <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '10px', letterSpacing: '0.14em', color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)', marginBottom: '6px' }}>PROJECT 162 · 2023–2025</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '20px', lineHeight: '1.15', marginBottom: '6px' }}>Terminal access corridor, 38 km</div>
                  <div style={{ fontSize: '13px', lineHeight: '1.5', color: 'color-mix(in srgb,var(--color-bg) 74%,transparent)' }}>Dual-carriageway access road, 11 culverts and two bridge approaches, delivered nine weeks early.</div>
                </figcaption>
              </figure>
              <figure className="blueprint" style={{ borderColor: 'color-mix(in srgb,var(--color-bg) 30%,transparent)', padding: '0' }}>
                <i className="corner tl" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner tr" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner bl" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i><i className="corner br" style={{ color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)' }}></i>
                <div className="duotone" style={{ height: '220px' }}><image-slot id="gs-proj-3" shape="rect" placeholder="Tank farm construction — site photo"></image-slot></div>
                <figcaption style={{ padding: '16px 18px 18px', color: 'var(--color-bg)' }}>
                  <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '10px', letterSpacing: '0.14em', color: 'color-mix(in srgb,var(--color-bg) 60%,transparent)', marginBottom: '6px' }}>PROJECT 171 · 2024–</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '20px', lineHeight: '1.15', marginBottom: '6px' }}>Coastal tank farm, 62,000 m³</div>
                  <div style={{ fontSize: '13px', lineHeight: '1.5', color: 'color-mix(in srgb,var(--color-bg) 74%,transparent)' }}>Four storage tanks, bunding, pump house and pipe rack, with marine loading tie-in.</div>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
    </>
  );
}
