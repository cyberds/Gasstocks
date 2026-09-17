"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import type { Portfolio } from '../lib/portfolio-types';

export default function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  // For mouse move inside the card, update portal position
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // We only want to render the portal on the client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const topImages = portfolio.images.slice(0, 4);
  const excess = portfolio.images.length - 4;

  const renderPopup = () => {
    if (!mounted) return null;
    
    // Position the popup near the mouse but keep it inside viewport
    const popupStyle: React.CSSProperties = {
      left: `${mousePos.x + 15}px`,
      top: `${mousePos.y + 15}px`,
    };

    return createPortal(
      <div 
        className={`portfolio-hover-popup ${isHovered ? 'active' : ''}`} 
        style={popupStyle}
      >
        <div className="popup-grid">
          {topImages.map((src, i) => (
            <div key={i} className="popup-img-wrap">
              <img src={src} alt={`${portfolio.title} ${i+1}`} />
              {i === 3 && excess > 0 && (
                <div className="popup-more">+{excess}</div>
              )}
            </div>
          ))}
        </div>
        <div className="popup-details">
          <h4>{portfolio.title}</h4>
          <p>{portfolio.description}</p>
          <div className="popup-meta">
            <span><strong>Client:</strong> {portfolio.client}</span>
            <span><strong>Location:</strong> {portfolio.location}</span>
            <span><strong>Category:</strong> {portfolio.serviceCategory}</span>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div 
        className="portfolio-card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        // for mobile long press, we can also map touch events to hover
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        <div className="portfolio-card-images">
          {portfolio.images.slice(0, 3).map((src, i) => (
            <img key={i} src={src} alt={portfolio.title} />
          ))}
        </div>
        <div className="portfolio-card-content">
          <h3>{portfolio.title}</h3>
          <p>{portfolio.description}</p>
          <div className="portfolio-card-actions">
            <Link href={`/portfolio/${portfolio.slug}`} className="view-btn">
              View Project
            </Link>
          </div>
        </div>
      </div>
      {renderPopup()}
    </>
  );
}
