'use client';

import { useState } from 'react';
import { usePortfolioNav } from './PortfolioNavProvider';

export default function SiteHeader() {
  const portfolios = usePortfolioNav();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const triggerAIChat = () => {
    const chatLauncher = document.querySelector('[data-gs-chat-launcher]') as HTMLButtonElement | null;
    if (chatLauncher) {
      chatLauncher.click();
    }
  };

  const toggleAccordion = (name: string) => {
    setActiveAccordion(activeAccordion === name ? null : name);
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          zIndex: '1000',
          height: '64px',
          background: 'color-mix(in srgb, var(--color-bg) 84%, transparent)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--color-divider)',
        }}
      >
        <div
          style={{
            maxWidth: '1320px',
            width: '100%',
            height: '100%',
            margin: '0 auto',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left: Logo */}
          <div style={{ flex: '1', display: 'flex' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '9px', textDecoration: 'none', color: 'inherit' }}>
              <img src="/assets/logo-3d.png" alt="Gasstocks Limited" style={{ height: '34px', width: 'auto', display: 'block' }} />
              <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 48%,transparent)' }}>RC359117</span>
            </a>
          </div>

          {/* Center: Desktop Nav */}
          <nav
            className="desktop-nav"
            style={{
              display: 'flex',
              gap: '28px',
              fontSize: '13px',
              letterSpacing: '0.02em',
              alignItems: 'center',
              height: '100%',
            }}
          >
            {/* About Dropdown */}
            <div className="nav-item-dropdown" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
              <a href="/about" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', height: '100%' }}>
                About
              </a>
              <div className="dropdown-menu">
                <a href="/about">About Gasstocks</a>
                <a href="/about#capability">Capabilities & Standards</a>
                <a href="/#assurance">Assurance & Quality</a>
              </div>
            </div>

            {/* Services Mega Menu */}
            <div className="nav-item-mega" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
              <a href="/services" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', height: '100%' }}>
                Services
              </a>
              <div className="mega-menu">
                <div className="mega-menu-grid">
                  <a href="/services/marine-vessels" className="mega-card">
                    <img src="/assets/portfolio/2/IMG-20260618-WA0011.jpg" alt="Marine & Vessels" />
                    <span>Marine & vessels</span>
                  </a>
                  <a href="/services/engineering-construction" className="mega-card">
                    <img src="/assets/portfolio/1/IMG-20260618-WA0025.jpg" alt="Engineering & Construction" />
                    <span>Engineering & construction</span>
                  </a>
                  <a href="/services/instrumentation-asset-integrity" className="mega-card">
                    <img src="/assets/portfolio/2/IMG-20260618-WA0014.jpg" alt="Instrumentation & Asset Integrity" />
                    <span>Instrumentation & asset integrity</span>
                  </a>
                  <a href="/services/supply-equipment" className="mega-card">
                    <img src="/assets/portfolio/1/IMG-20260618-WA0028.jpg" alt="Supply & Equipment" />
                    <span>Supply & equipment</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Track Record Mega Menu */}
            <div className="nav-item-mega" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
              <a href="/portfolio" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', height: '100%' }}>
                Track Record
              </a>
              <div className="mega-menu">
                <div className="mega-menu-grid track-record-grid">
                  {portfolios.slice(0, 4).map((p) => (
                    <a key={p.slug} href={`/portfolio/${p.slug}`} className="mega-card">
                      {p.image && <img src={p.image} alt={p.title} />}
                      <span>{p.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <a href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
            </div>
          </nav>

          {/* Right: AI Chat & Mobile Toggle */}
          <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
            <button
              className="btn btn-primary blueprint ai-btn"
              onClick={triggerAIChat}
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '13px',
              }}
            >
              <img src="/assets/gasstocks-ai-mascot.png" alt="AI" style={{ width: '18px', height: '18px' }} />
              <span>Chat with Gasstocks AI</span>
              <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
            </button>

            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay & Accordion Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-nav-links">
              {/* About Group */}
              <div className="mobile-group">
                <button className="mobile-group-title" onClick={() => toggleAccordion('about')}>
                  <span>About</span>
                  <span>{activeAccordion === 'about' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'about' && (
                  <div className="mobile-sublinks">
                    <a href="/about" onClick={() => setMobileMenuOpen(false)}>Company Overview</a>
                    <a href="/about#capability" onClick={() => setMobileMenuOpen(false)}>Capability Register</a>
                  </div>
                )}
              </div>

              {/* Services Group */}
              <div className="mobile-group">
                <button className="mobile-group-title" onClick={() => toggleAccordion('services')}>
                  <span>Services</span>
                  <span>{activeAccordion === 'services' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'services' && (
                  <div className="mobile-sublinks">
                    <a href="/services" onClick={() => setMobileMenuOpen(false)}>All Services Overview</a>
                    <a href="/services/marine-vessels" onClick={() => setMobileMenuOpen(false)}>Marine & Vessels</a>
                    <a href="/services/engineering-construction" onClick={() => setMobileMenuOpen(false)}>Engineering & Construction</a>
                    <a href="/services/instrumentation-asset-integrity" onClick={() => setMobileMenuOpen(false)}>Instrumentation & Asset Integrity</a>
                    <a href="/services/supply-equipment" onClick={() => setMobileMenuOpen(false)}>Supply & Equipment</a>
                  </div>
                )}
              </div>

              {/* Track Record Group */}
              <div className="mobile-group">
                <button className="mobile-group-title" onClick={() => toggleAccordion('portfolio')}>
                  <span>Track Record</span>
                  <span>{activeAccordion === 'portfolio' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'portfolio' && (
                  <div className="mobile-sublinks">
                    <a href="/portfolio" onClick={() => setMobileMenuOpen(false)}>All Portfolio Projects</a>
                    {portfolios.map((p) => (
                      <a key={p.slug} href={`/portfolio/${p.slug}`} onClick={() => setMobileMenuOpen(false)}>
                        {p.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a href="/contact" className="mobile-single-link" onClick={() => setMobileMenuOpen(false)}>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS */}
      <style>{`
        /* Dropdown styles */
        .nav-item-dropdown:hover .dropdown-menu {
          display: flex;
        }
        .dropdown-menu {
          display: none;
          position: absolute;
          top: 64px;
          left: -16px;
          background: var(--color-bg);
          border: 1px solid var(--color-divider);
          border-top: none;
          box-shadow: var(--shadow-md);
          flex-direction: column;
          min-width: 180px;
          padding: 8px 0;
          z-index: 1001;
        }
        .dropdown-menu a {
          padding: 10px 24px;
          text-decoration: none;
          color: var(--color-text);
          font-size: 13px;
        }
        .dropdown-menu a:hover {
          background: color-mix(in srgb, var(--color-text) 5%, transparent);
          color: var(--color-accent);
        }

        /* Mega menu styles */
        .nav-item-mega:hover .mega-menu {
          display: block;
        }
        .mega-menu {
          display: none;
          position: fixed;
          top: 64px;
          left: 0;
          width: 100vw;
          background: var(--color-bg);
          border-bottom: 1px solid var(--color-divider);
          box-shadow: var(--shadow-lg);
          padding: 32px;
          z-index: 999;
          animation: slideDown 0.15s ease-out;
        }
        .mega-menu-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .mega-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: var(--color-text);
          border: 1px solid var(--color-divider);
          overflow: hidden;
          transition: transform 0.2s, border-color 0.2s;
        }
        .mega-card:hover {
          transform: translateY(-2px);
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
        .mega-card img {
          width: 100%;
          height: 130px;
          object-fit: cover;
          display: block;
        }
        .mega-card span {
          padding: 12px;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          text-align: center;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Mobile specific styles */
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--color-text);
          cursor: pointer;
          padding: 4px;
        }

        .mobile-nav-overlay {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 998;
          display: flex;
        }

        .mobile-nav-drawer {
          background: var(--color-bg);
          width: 100%;
          max-height: calc(100dvh - 64px);
          overflow-y: auto;
          border-bottom: 1px solid var(--color-divider);
          padding: 24px 20px;
          box-shadow: var(--shadow-md);
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-group-title {
          width: 100%;
          background: none;
          border: none;
          padding: 8px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 16px;
          text-transform: uppercase;
          color: var(--color-text);
          cursor: pointer;
          border-bottom: 1px solid var(--color-divider);
        }

        .mobile-sublinks {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px 0 10px 12px;
        }

        .mobile-sublinks a {
          text-decoration: none;
          color: var(--color-neutral-700);
          font-size: 14px;
        }

        .mobile-single-link {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 16px;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--color-text);
          padding: 8px 0;
          border-bottom: 1px solid var(--color-divider);
        }

        @media (max-width: 960px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block; }
          
          .ai-btn span { display: none; }
          .ai-btn { padding: 8px !important; border-radius: 50% !important; border-color: transparent !important; }
          .ai-btn i { display: none; }
        }
      `}</style>
    </>
  );
}
