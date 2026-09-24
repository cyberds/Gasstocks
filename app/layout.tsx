import type { Metadata, Viewport } from 'next';
import { Barlow, Barlow_Condensed } from 'next/font/google';

import '../styles/tokens.css';
import '../styles/site.css';
import '../styles/app.css';
import '../styles/portfolio.css';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-barlow',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-barlow-condensed',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Gasstocks Limited',
    default: "Gasstocks Limited | Marine Logistics & Engineering for Nigeria's Oil and Gas",
  },
  description:
    'Gasstocks Limited is an indigenous Nigerian oil and gas services company, established in 2008. We deliver swamp and deep offshore marine logistics, mechanical and civil engineering, instrumentation and control automation, and procurement from Port Harcourt, Lagos and Houston.',
  keywords: [
    'marine logistics Nigeria',
    'swamp logistics',
    'houseboat charter Port Harcourt',
    'crew boat charter',
    'pipeline construction',
    'instrumentation and control automation',
    'oilfield procurement',
    'Nigeria',
    'Gasstocks Limited',
    'oil and gas infrastructure',
  ],
  authors: [{ name: 'Gasstocks Limited' }],
  creator: 'Gasstocks Limited',
  publisher: 'Gasstocks Limited',
  metadataBase: new URL('https://gasstocksltd.com'),
  openGraph: {
    title: "Gasstocks Limited | Marine Logistics & Engineering for Nigeria's Oil and Gas",
    description: 'Indigenous oil and gas services since 2008: marine logistics, engineering, instrumentation and procurement for operators across the Niger Delta.',
    url: 'https://gasstocksltd.com',
    siteName: 'Gasstocks Limited',
    images: [
      {
        url: '/assets/og-image.jpg', // Ensure this exists or fallback to a standard image
        width: 1200,
        height: 630,
        alt: 'Gasstocks Limited: marine logistics and engineering',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gasstocks Limited',
    description: 'Marine logistics, engineering, instrumentation and procurement for Nigeria’s oil and gas industry since 2008.',
    creator: '@gasstocks',
    images: ['/assets/og-image.jpg'],
  },
  icons: { icon: '/assets/favicon.png' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Gasstocks Limited",
  "url": "https://gasstocksltd.com",
  "logo": "https://gasstocksltd.com/assets/favicon.png",
  "foundingDate": "2008",
  "description": "Gasstocks Limited is an indigenous Nigerian oil and gas services company, established in 2008. We deliver swamp and deep offshore marine logistics, mechanical and civil engineering, instrumentation and control automation, and procurement from Port Harcourt, Lagos and Houston.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+2348025240251",
    "contactType": "customer service",
    "areaServed": "NG",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.linkedin.com/company/gasstocks",
    "https://twitter.com/gasstocks"
  ]
};

export const viewport: Viewport = {
  themeColor: '#28166f',
  width: 'device-width',
  initialScale: 1,
};

/* Flat-mode arbiter, carried over verbatim from web/js/flat-mode.js.
   It must run before first paint — setting data-gs-flat on <html> is the only
   signal, and styles/site.css owns everything that follows from it — so it
   cannot be a useEffect. Injected into <head> ahead of the body. */
const FLAT_MODE = `(function () {
  var root = document.documentElement;
  var flat = function () { root.setAttribute('data-gs-flat', ''); };
  if (window.matchMedia('(max-width: 860px)').matches) flat();
  window.addEventListener('resize', function () {
    if (window.matchMedia('(max-width: 860px)').matches) flat();
  }, { passive: true });
  var giveUp = function () {
    if (document.querySelector('gs-scene[data-ready]')) return;
    if (document.hidden) {
      document.addEventListener('visibilitychange', function once() {
        document.removeEventListener('visibilitychange', once);
        setTimeout(giveUp, 9000);
      });
      return;
    }
    flat();
  };
  setTimeout(function () {
    var s = document.querySelector('gs-scene');
    if (s && s.hasAttribute('data-ready')) return;
    if (s && s.hasAttribute('data-booting')) { setTimeout(giveUp, 12000); return; }
    giveUp();
  }, 9000);
})();`;

import Chatbot from '../components/Chatbot';
import PortfolioNavProvider from '../components/PortfolioNavProvider';
import { getPortfolioNav } from '../lib/portfolio';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  /* The header menu is secondary navigation, so an outage degrades it to an
     empty list instead of taking down every page. It is logged loudly; the
     portfolio pages themselves do not swallow errors. */
  const portfolioNav = await getPortfolioNav().catch((err) => {
    console.error('[layout] could not load track record for the header menu', err);
    return [];
  });

  return (
    // suppressHydrationWarning: the flat-mode script below runs before
    // hydration and sets data-gs-flat on this element by design. Without this,
    // React reports the attribute it didn't render as a mismatch. Scoped to
    // <html> only — it does not suppress anything inside the page.
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: FLAT_MODE }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>
        <PortfolioNavProvider items={portfolioNav}>{children}</PortfolioNavProvider>
        <Chatbot />
      </body>
    </html>
  );
}
