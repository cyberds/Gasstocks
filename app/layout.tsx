import type { Metadata, Viewport } from 'next';
import { Barlow, Barlow_Condensed } from 'next/font/google';

import '../styles/tokens.css';
import '../styles/site.css';
import '../styles/app.css';

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
  title: 'Gasstocks Limited — marine & civil infrastructure contractor',
  description:
    'Nine disciplines under one contract: shipping, dredging, marine construction, civil engineering and plant hire — one accountable party from the anchorage to the last kilometre of road.',
  icons: { icon: '/assets/logo-3d.png' },
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
      </head>
      <body>{children}</body>
    </html>
  );
}
