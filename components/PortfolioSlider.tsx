"use client";

import React, { useRef, useState } from 'react';
import type { Portfolio } from '../lib/portfolio-types';
import PortfolioCard from './PortfolioCard';

export default function PortfolioSlider({ portfolios }: { portfolios: Portfolio[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    if (sliderRef.current) {
      setStartX(e.pageX - sliderRef.current.offsetLeft);
      setScrollLeft(sliderRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="portfolio-section" id="record" style={{ padding: '96px 32px', background: 'var(--color-accent-900)', color: 'var(--color-bg)' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        <div style={{ fontSize: '10.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-bg) 62%,transparent)', marginBottom: '10px' }}>Track record</div>
        <h2 style={{ fontSize: '46px', lineHeight: '1.02', margin: '0 0 40px', maxWidth: '20ch', color: 'var(--color-bg)' }}>Delivered, commissioned and handed over.</h2>
      </div>
      <div 
        className="portfolio-slider-container" 
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {portfolios.map(p => (
          <PortfolioCard key={p.slug} portfolio={p} />
        ))}
      </div>
    </section>
  );
}
