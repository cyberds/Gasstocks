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
    default: 'Gasstocks Limited | Marine & Civil Infrastructure Contractor',
  },
  description:
    'Gasstocks is a premier marine and civil infrastructure contractor operating in Nigeria since 2008. We provide dredging, shipping, marine construction, civil engineering, and plant hire services.',
  keywords: [
    'marine contractor',
    'civil engineering',
    'dredging services',
    'shipping',
    'marine construction',
    'plant hire',
    'Nigeria',
    'Gasstocks Limited',
    'oil and gas infrastructure',
  ],
  authors: [{ name: 'Gasstocks Limited' }],
  creator: 'Gasstocks Limited',
  publisher: 'Gasstocks Limited',
  metadataBase: new URL('https://gasstocks.com'), // Replace with actual domain when available
  openGraph: {
    title: 'Gasstocks Limited | Marine & Civil Infrastructure Contractor',
    description: 'Premier marine and civil infrastructure contractor operating since 2008. Nine disciplines under one contract.',
    url: 'https://gasstocks.com',
    siteName: 'Gasstocks Limited',
    images: [
      {
        url: '/assets/og-image.jpg', // Ensure this exists or fallback to a standard image
        width: 1200,
        height: 630,
        alt: 'Gasstocks Limited - Marine & Civil Infrastructure',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gasstocks Limited',
    description: 'Premier marine and civil infrastructure contractor operating since 2008.',
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
  "url": "https://gasstocks.com",
  "logo": "https://gasstocks.com/assets/favicon.png",
  "foundingDate": "2008",
  "description": "Gasstocks is a premier marine and civil infrastructure contractor operating in Nigeria since 2008, offering services such as dredging, marine construction, and civil engineering.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+2348000000000",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
