'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current || !textRef.current) return;

    // Parallax image
    gsap.to(imageRef.current, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Fade and slide text
    gsap.fromTo(
      textRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: '60vh',
        minHeight: '400px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        paddingTop: '64px', // Helps clear header while maintaining centered text visually
      }}
    >
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <img
          ref={imageRef}
          src="/assets/about-hero.png"
          alt=""
          style={{
            width: '100%',
            height: '120%', // extra height for parallax
            objectFit: 'cover',
            position: 'absolute',
            top: '-10%',
            left: 0,
            opacity: 0.5,
          }}
        />
      </div>

      <div
        ref={textRef}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          color: '#fff',
          padding: '0 32px',
          maxWidth: '680px',
        }}
      >
        <h1 style={{ color: '#fff', marginBottom: 'var(--space-4)' }}>
          Rethink service <br />
          <span style={{ color: 'var(--color-accent-400)' }}>delivery.</span>
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
          Gasstocks Limited is an indigenous Nigerian oil and gas services company, established in 2008 to give operators in the Niger Delta the quality of service that International Oil Companies expect.
        </p>
      </div>
    </div>
  );
}
