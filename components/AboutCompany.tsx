'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutCompany() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !cardGridRef.current) return;

    gsap.fromTo(
      Array.from(titleRef.current.children),
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
      }
    );

    gsap.fromTo(
      Array.from(cardGridRef.current.children),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardGridRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '140px 32px',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-divider)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Intro */}
        <div ref={titleRef} style={{ marginBottom: '64px', maxWidth: '800px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '14px', fontWeight: 600 }}>
            Who We Are
          </div>
          <h2 style={{ fontSize: '38px', lineHeight: 1.15, marginBottom: '24px' }}>
            An indigenous energy & marine infrastructure leader operating since 2008.
          </h2>
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-neutral-700)', margin: 0 }}>
            Gasstocks Limited is managed by a team of Nigerian and international professionals with decades of experience in the global financial, oilfield, and energy sectors. We work to the standards required by International Oil Companies and leading independent operators, delivering compliant, innovative, and sustainable solutions.
          </p>
        </div>

        {/* Creative Cards Grid */}
        <div
          ref={cardGridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            alignItems: 'stretch',
          }}
        >
          {/* Card 1: What we do */}
          <div
            className="blueprint"
            style={{
              padding: '40px 32px',
              background: 'var(--color-bg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
            <div>
              <div style={{ color: 'var(--color-accent)', fontSize: '18px', fontWeight: 'bold', fontFamily: 'var(--font-heading)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                What we are trying to do
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-neutral-800)', margin: 0 }}>
                To deliver high-quality, efficient support services to Nigeria's upstream oil and gas industry — through functional execution, a trained workforce, and a management team that holds the work to the quality, timeliness, and value we promised.
              </p>
            </div>
            <div style={{ marginTop: '24px', opacity: 0.1, fontFamily: 'var(--font-heading)', fontSize: '64px', fontWeight: 900, textAlign: 'right', lineHeight: 1 }}>
              MISSION
            </div>
          </div>

          {/* Card 2: The difference we make */}
          <div
            className="blueprint"
            style={{
              padding: '40px 32px',
              background: 'var(--color-bg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
            <div>
              <div style={{ color: 'var(--color-accent)', fontSize: '18px', fontWeight: 'bold', fontFamily: 'var(--font-heading)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                The difference we make
              </div>
              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'var(--color-neutral-800)' }}>
                <li style={{ marginBottom: '10px' }}>Strengthening Nigeria's energy and marine infrastructure capacity.</li>
                <li style={{ marginBottom: '10px' }}>Delivering cost-effective, compliant, and innovative support services.</li>
                <li>Supporting local workforce development and knowledge transfer.</li>
              </ul>
            </div>
            <div style={{ marginTop: '24px', opacity: 0.1, fontFamily: 'var(--font-heading)', fontSize: '64px', fontWeight: 900, textAlign: 'right', lineHeight: 1 }}>
              IMPACT
            </div>
          </div>

          {/* Card 3: Image highlight */}
          <div
            style={{
              position: 'relative',
              borderRadius: 0,
              overflow: 'hidden',
              minHeight: '280px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <img
              src="/assets/portfolio/2/IMG-20260618-WA0015.jpg"
              alt="Gasstocks Marine Operations"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
