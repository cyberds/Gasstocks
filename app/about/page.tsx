'use client';

import { useState } from 'react';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import AboutHero from '../../components/AboutHero';
import AboutCompany from '../../components/AboutCompany';
import CeoSection from '../../components/CeoSection';
import ShowcaseRail from '../../components/ShowcaseRail';
import AboutCTA from '../../components/AboutCTA';
import ContactForm from '../../components/ContactForm';
import ContactModal from '../../components/ContactModal';
import Assurance from '@/components/Assurance';

export default function AboutPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div
      style={{
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text)',
        background: 'var(--color-bg)',
      }}
    >
      <SiteHeader />
      
      <main style={{ paddingTop: '80px' /* offset for fixed header */ }}>
        <AboutHero />
        <AboutCompany />
        <CeoSection />
        
        {/* Track Record & Capability added to About Page */}
        <ShowcaseRail />
        <Assurance />
        
        {/* CTA section with 2 buttons */}
        <AboutCTA onContactClick={() => setIsContactOpen(true)} />
        
        <div style={{ borderTop: '1px solid var(--color-divider)' }}>
          <ContactForm />
        </div>
      </main>

      <SiteFooter />
      
      {/* Contact modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      
    </div>
  );
}
