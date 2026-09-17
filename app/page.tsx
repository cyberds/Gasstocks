import SiteHeader from '../components/SiteHeader';
import Journey from '../components/Journey';
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
  title: 'Gasstocks Limited | Marine & Civil Infrastructure Contractor',
  description: 'Gasstocks is a premier marine and civil infrastructure contractor operating in Nigeria since 2008. We provide dredging, shipping, marine construction, civil engineering, and plant hire services.',
  alternates: {
    canonical: '/',
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Gasstocks Limited",
  "url": "https://gasstocks.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://gasstocks.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

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
      <Journey />
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
