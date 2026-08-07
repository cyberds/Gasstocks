"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function PortfolioGallery({ images, title }: { images: string[], title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOpen, images.length]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setIsPlaying(false);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % images.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <div className="portfolio-gallery">
        {images.map((src, i) => (
          <img 
            key={i} 
            src={src} 
            alt={`${title} Image ${i + 1}`} 
            loading="lazy" 
            onClick={() => openLightbox(i)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>

      {mounted && isOpen && createPortal(
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={images[currentIndex]} alt={`${title} ${currentIndex + 1}`} />
            
            <button className="lightbox-btn close" onClick={closeLightbox}>&times;</button>
            <button className="lightbox-btn prev" onClick={prevSlide}>&#10094;</button>
            <button className="lightbox-btn next" onClick={nextSlide}>&#10095;</button>
            
            <div className="lightbox-controls">
              <span className="lightbox-counter">{currentIndex + 1} / {images.length}</span>
              <button className="lightbox-play-btn" onClick={togglePlay}>
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
            </div>
          </div>

          <style>{`
            .lightbox-overlay {
              position: fixed;
              top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(0,0,0,0.9);
              z-index: 10000;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .lightbox-content {
              position: relative;
              max-width: 90vw;
              max-height: 90vh;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .lightbox-content img {
              max-width: 100%;
              max-height: 80vh;
              object-fit: contain;
              border-radius: 4px;
            }
            .lightbox-btn {
              position: absolute;
              background: rgba(0,0,0,0.5);
              color: white; border: none; cursor: pointer;
              display: flex; align-items: center; justify-content: center;
              transition: background 0.2s;
            }
            .lightbox-btn:hover { background: rgba(0,0,0,0.8); }
            .lightbox-btn.close {
              top: -40px; right: 0;
              font-size: 2rem; padding: 0.2rem 1rem; border-radius: 4px;
            }
            .lightbox-btn.prev, .lightbox-btn.next {
              top: 50%; transform: translateY(-50%);
              font-size: 2rem; padding: 1rem; border-radius: 50%;
              width: 50px; height: 50px;
            }
            .lightbox-btn.prev { left: -60px; }
            .lightbox-btn.next { right: -60px; }
            @media (max-width: 768px) {
              .lightbox-btn.prev { left: 10px; }
              .lightbox-btn.next { right: 10px; }
              .lightbox-btn.close { top: 10px; right: 10px; z-index: 10; }
            }
            .lightbox-controls {
              margin-top: 15px;
              display: flex;
              align-items: center;
              gap: 20px;
            }
            .lightbox-counter { color: #ccc; font-size: 1.1rem; }
            .lightbox-play-btn {
              background: white; color: black;
              border: none; padding: 5px 15px; border-radius: 20px;
              cursor: pointer; font-weight: bold;
            }
          `}</style>
        </div>,
        document.body
      )}
    </>
  );
}
