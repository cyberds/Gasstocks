import SiteHeader from '../components/SiteHeader';
import Journey from '../components/Journey';
import VideoHero from '../components/VideoHero';
import { getHeroVariant } from '../lib/hero-variant';
import ShowcaseRail from '../components/ShowcaseRail';
import AboutAccordion from '../components/AboutAccordion';
import Capability from '../components/Capability';
import LeasingRail from '../components/LeasingRail';
import MarineRail from '../components/MarineRail';

import Assurance from '../components/Assurance';
import ContactForm from '../components/ContactForm';
import SiteFooter from '../components/SiteFooter';
import PortfolioSlider from '../components/PortfolioSlider';
import { Metadata } from 'next';
import { getPortfolios } from '../lib/portfolio';

export const metadata: Metadata = {
  title: "Gasstocks Limited | Marine Logistics & Engineering for Nigeria's Oil and Gas",
  description: 'Gasstocks Limited is an indigenous Nigerian oil and gas services company, established in 2008. We deliver swamp and deep offshore marine logistics, mechanical and civil engineering, instrumentation and control automation, and procurement from Port Harcourt, Lagos and Houston.',
  alternates: {
    canonical: '/',
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Gasstocks Limited",
  "url": "https://gasstocksltd.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://gasstocksltd.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

// Re-render hourly so the weekday-based hero variant switches over at midnight.
export const revalidate = 3600;

export default async function Home() {
  const portfolios = await getPortfolios();

  return (
    // No overflow on this wrapper: overflow-x:hidden computes overflow-y to
    // auto, which would make it the scrollport for [data-gs-sticky] and kill
    // the pin.
    <div
      style={{
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text)',
        background: 'var(--color-bg)',
      }}
    >
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {getHeroVariant() === 'video' ? <VideoHero /> : <Journey />}
      <MarineRail />
      <ShowcaseRail />
      <AboutAccordion />
      <Capability />
      <LeasingRail />
      <PortfolioSlider portfolios={portfolios} />
      <Assurance />
      <ContactForm />
      <SiteFooter />
    </div>
  );
}
