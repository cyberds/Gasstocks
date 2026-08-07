'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CeoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !imageRef.current || !contentRef.current) return;

    // Image reveal animation
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      }
    );

    // Text stagger animation
    gsap.fromTo(
      Array.from(contentRef.current.children),
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '96px 32px',
        background: 'var(--color-bg)',
        borderTop: '1px solid var(--color-divider)',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '48px',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative' }}>
          <img
            ref={imageRef}
            src="/assets/highlights/CEO-pic.jpg"
            alt="Sir Emmanuel Okene KSGG KSJI"
            style={{
              width: '100%',
              maxWidth: '380px',
              height: 'auto',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </div>

        <div ref={contentRef} style={{ maxWidth: '540px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-700)', marginBottom: 'var(--space-2)' }}>
            Leadership
          </div>
          <h2 style={{ marginBottom: '4px' }}>Sir Emmanuel Okene</h2>
          <div style={{ fontSize: '14px', color: 'var(--color-neutral-600)', marginBottom: 'var(--space-4)', fontWeight: 500 }}>
            KSGG KSJI — CEO
          </div>
          
          <div style={{ color: 'var(--color-text)', opacity: 0.85 }}>
            <p>
              Emmanuel Okene is the CEO at Gasstocks based in Richmond, Texas. Under his visionary leadership, Gasstocks has grown into a premier marine and civil infrastructure contractor.
            </p>
            <p>
              Previously, Emmanuel served as the Oil Services Head (South) at UBA Group, bringing extensive financial and operational expertise to the oil and gas sector.
            </p>
            <p>
              Emmanuel holds a Master of Business Administration degree from the University of Benin and a Master of Science from Queen Mary, University of London.
            </p>
            
            <a
              href="https://www.linkedin.com/in/emmanuel-okene-0734b830/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ marginTop: 'var(--space-4)' }}
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
