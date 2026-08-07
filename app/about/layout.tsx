import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Gasstocks Limited, our mission, vision, and our track record as a leading marine and civil infrastructure contractor in Nigeria since 2008.',
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
            "url": "https://gasstocks.com/about",
            "description": "Information about Gasstocks Limited, its mission, and its capabilities.",
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
