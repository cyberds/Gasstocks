import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Gasstocks Limited: an indigenous Nigerian oil and gas services company since 2008. Our purpose, leadership, logistics bases, jetties and contract history with Shell (SPDC) and Eroton.',
  alternates: {
    canonical: '/about',
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Gasstocks Limited",
            "url": "https://gasstocksltd.com/about",
            "description": "Gasstocks Limited: purpose, leadership, operating bases and contract history.",
            "publisher": {
              "@type": "Organization",
              "name": "Gasstocks Limited"
            }
          }),
        }}
      />
      {children}
    </>
  );
}
