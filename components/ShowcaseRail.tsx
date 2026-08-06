'use client';

import { useRef } from 'react';
import { useRail } from '../hooks/useRail';

// Markup carried over verbatim from web/index.html; behaviour lives in
// hooks/useRail.ts, which is the port of web/js/showcase.js.

export default function ShowcaseRail() {
  const rail = useRef<HTMLDivElement>(null);
  useRail(rail);

  return (
    <>
      <section className="gs-showcase" aria-label="What we do">
          <div className="gs-showcase-head">
            <div>
              <div className="gs-showcase-kicker">What we do</div>
              <h2>Equipped for the work you need moved, dredged or built.</h2>
            </div>
          </div>

          <div ref={rail} className="gs-rail" data-gs-rail="" role="group" aria-roledescription="carousel" aria-label="Services" tabIndex={0}>
            <div className="gs-viewport">
              <div className="gs-track" data-gs-track="">

                <article className="gs-card" role="group" aria-roledescription="slide" aria-label="1 of 4">
                  <img src="https://images.unsplash.com/photo-1670121180530-cfcba4438038?auto=format&fit=crop&w=1600&q=70" alt="A loaded cargo ship alongside a dock" loading="lazy" decoding="async" />
                  <div className="gs-card-body">
                    <div className="gs-card-index"><span>01</span><i></i><span>Shipping & logistics</span></div>
                    <h3>Large shipment?</h3>
                    <p>We are equipped, fast and reliable</p>
                    <a className="btn btn-primary blueprint" href="#contact">Get Started<i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i></a>
                  </div>
                </article>

                <article className="gs-card" role="group" aria-roledescription="slide" aria-label="2 of 4">
                  <img src="https://images.unsplash.com/photo-1670912461796-81819c1e525b?auto=format&fit=crop&w=1600&q=70" alt="A construction crane standing over open water" loading="lazy" decoding="async" />
                  <div className="gs-card-body">
                    <div className="gs-card-index"><span>02</span><i></i><span>Marine & civil construction</span></div>
                    <h3>We offer bespoke engineering in construction of jetties, roads and bridges</h3>
                    <a className="btn btn-primary blueprint" href="#contact">Get Started<i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i></a>
                  </div>
                </article>

                <article className="gs-card" role="group" aria-roledescription="slide" aria-label="3 of 4">
                  <img src="https://images.unsplash.com/photo-1530890448995-4d82724f702c?auto=format&fit=crop&w=1600&q=70" alt="A tanker under way at sea" loading="lazy" decoding="async" />
                  <div className="gs-card-body">
                    <div className="gs-card-index"><span>03</span><i></i><span>Expeditions</span></div>
                    <h3>We've equipped 300+ expeditions with crew, security, supply, construction and support vessel services.</h3>
                    <a className="btn btn-primary blueprint" href="#contact">Get Started<i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i></a>
                  </div>
                </article>

                <article className="gs-card" role="group" aria-roledescription="slide" aria-label="4 of 4">
                  <img src="https://images.unsplash.com/photo-1595734939818-f4e0d44957df?auto=format&fit=crop&w=1600&q=70" alt="Heavy plant working on a road under construction" loading="lazy" decoding="async" />
                  <div className="gs-card-body">
                    <div className="gs-card-index"><span>04</span><i></i><span>Civil engineering</span></div>
                    <h3>We offer the highest quality civil engineering services within timeline and budget.</h3>
                    <a className="btn btn-primary blueprint" href="#contact">Get Started<i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i></a>
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
              </div>
            </div>

            <div data-gs-live="" aria-live="polite" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}></div>
          </div>
        </section>
    </>
  );
}
