import SiteHeader from '../components/SiteHeader';
import Journey from '../components/Journey';
import ShowcaseRail from '../components/ShowcaseRail';
import AboutAccordion from '../components/AboutAccordion';
import Capability from '../components/Capability';
import LeasingRail from '../components/LeasingRail';

import Assurance from '../components/Assurance';
import ContactForm from '../components/ContactForm';
import SiteFooter from '../components/SiteFooter';
import Chatbot from '../components/Chatbot';
import PortfolioSlider from '../components/PortfolioSlider';

export default function Home() {
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
      <Journey />
      <ShowcaseRail />
      <AboutAccordion />
      <Capability />
      <LeasingRail />
      <PortfolioSlider />
      <Assurance />
      <ContactForm />
      <SiteFooter />
      {/* Outside every scroller and rail, so it can never interfere with the
          3D scene's scroll capture or the rails' touch-action contract. */}
      <Chatbot />
    </div>
  );
}
