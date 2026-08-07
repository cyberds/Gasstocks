import SiteHeader from '../../components/SiteHeader';
import ContactForm from '../../components/ContactForm';
import SiteFooter from '../../components/SiteFooter';
import InlineChatbot from '../../components/InlineChatbot';
import { COMPANY, DISPLAY, links } from '../../lib/company';

const cardStyle = {
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
  padding: '16px 24px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  textDecoration: 'none',
  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
  minWidth: '240px',
  border: '1px solid var(--color-divider)',
  transition: 'transform 0.2s',
};

const iconStyle = {
  width: '28px',
  height: '28px',
  flexShrink: 0,
  color: 'var(--color-accent-700)',
};

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={iconStyle} aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.87.33 1.72.63 2.54a2 2 0 0 1-.45 2.11L7.8 8.8a16 16 0 0 0 6.42 6.42l.43-.43a2 2 0 0 1 2.11-.45c.82.3 1.67.51 2.54.63A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 308 308" fill="currentColor" style={iconStyle} aria-hidden="true">
      <g id="XMLID_468_">
        <path id="XMLID_469_" d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156
		c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687
		c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887
		c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153
		c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348
		c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802
		c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922
		c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0
		c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458
		C233.168,179.508,230.845,178.393,227.904,176.981z"/>
        <path id="XMLID_470_" d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716
		c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396
		c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z
		 M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188
		l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677
		c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867
		C276.546,215.678,222.799,268.994,156.734,268.994z"/>
      </g>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={iconStyle} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 7 9-7" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div
      style={{
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text)',
        background: 'var(--color-bg)',
      }}
    >
      <style>{`
        .quick-card:hover { transform: translateY(-4px); }
        .hero-cards-container {
          position: absolute;
          bottom: -45px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 24px;
          z-index: 10;
          width: max-content;
          max-width: 90vw;
          flex-wrap: wrap;
          justify-content: center;
        }
        @media (max-width: 860px) {
          .hero-cards-container {
            bottom: auto;
            top: 100%;
            margin-top: -20px;
            flex-direction: column;
            gap: 12px;
          }
          .hero-section-wrapper {
            margin-bottom: 240px !important;
          }
        }
      `}</style>
      <SiteHeader />
      
      {/* Hero Section */}
      <section 
        className="hero-section-wrapper"
        style={{ 
          padding: '160px 32px 100px', 
          textAlign: 'center', 
          position: 'relative',
          background: 'linear-gradient(rgba(24, 13, 67, 0.55), rgba(40, 22, 111, 0.35)), url("/assets/contact-hero.jpg") center/cover no-repeat',
          color: 'white',
          marginBottom: '80px'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '16px',
            }}
          >
            Get in Touch
          </div>
          <h1 style={{ fontSize: 'clamp(44px, 6vw, 68px)', lineHeight: '1.05', margin: '0 0 24px', fontFamily: 'var(--font-heading)' }}>
            We're here to help.
          </h1>
          <p
            style={{
              fontSize: '19px',
              lineHeight: '1.6',
              margin: '0',
              color: 'rgba(255, 255, 255, 0.85)',
              textWrap: 'pretty',
            }}
          >
            Reach out for enquiries, tenders, or to discuss how we can support your upstream operation
            with reliable marine, engineering and logistics services.
          </p>
        </div>

        {/* Overlapping quick cards */}
        <div className="hero-cards-container">
          <a href={links.tel('nigeria')} className="quick-card" style={cardStyle}>
            <PhoneIcon />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11.5px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Call Us</div>
              <div style={{ fontWeight: 600, fontSize: '16px' }}>{DISPLAY.phoneNigeria}</div>
            </div>
          </a>
          <a href={links.whatsapp()} target="_blank" rel="noopener noreferrer" className="quick-card" style={cardStyle}>
            <WhatsAppIcon />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11.5px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>WhatsApp</div>
              <div style={{ fontWeight: 600, fontSize: '16px' }}>Chat instantly</div>
            </div>
          </a>
          <a href={links.mailto('Website enquiry')} className="quick-card" style={cardStyle}>
            <MailIcon />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11.5px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email Us</div>
              <div style={{ fontWeight: 600, fontSize: '16px' }}>{COMPANY.email}</div>
            </div>
          </a>
        </div>
      </section>

      {/* AI Chat Section */}
      <InlineChatbot />

      {/* Contact Form Section */}
      <ContactForm />

      <SiteFooter />
    </div>
  );
}
