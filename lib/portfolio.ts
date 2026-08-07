export interface Portfolio {
  slug: string;
  title: string;
  description: string;
  client: string;
  location: string;
  date: string;
  serviceCategory: string;
  images: string[];
}

export const PORTFOLIOS: Portfolio[] = [
  {
    slug: 'lady-j-fabrication',
    title: 'Barge Lady J: Steel Fabrication & Dry-docking',
    description: 'Extensive steel fabrication, hull maintenance, and dry-docking inspection for the flat top barge Lady J. This project ensures the structural integrity and operational readiness of the vessel for heavy-lift cargo handling and marine logistics.',
    client: 'Confidential Client',
    location: 'Nigeria',
    date: 'June 2026',
    serviceCategory: 'Steel fabrication & boatbuilding',
    images: [
      '/assets/portfolio/1/IMG-20260618-WA0012.jpg',
      '/assets/portfolio/1/IMG-20260618-WA0012 (1).jpg',
      '/assets/portfolio/1/IMG-20260618-WA0025.jpg',
      '/assets/portfolio/1/IMG-20260618-WA0026.jpg',
      '/assets/portfolio/1/IMG-20260618-WA0027.jpg',
      '/assets/portfolio/1/IMG-20260618-WA0028.jpg',
      '/assets/portfolio/1/IMG-20260618-WA0029.jpg',
      '/assets/portfolio/1/IMG-20260618-WA0030.jpg',
    ],
  },
  {
    slug: 'offshore-logistics-tugboat',
    title: 'Offshore Logistics: Tugboat & Accommodation Barge Deployment',
    description: 'Deployment of a high-capacity tugboat and an accommodation barge to support offshore logistics and supply runs. The operation involved maneuvering through inland waterways to position the accommodation asset for a major offshore catering and personnel transfer campaign.',
    client: 'Regional Energy Operator',
    location: 'Niger Delta, Nigeria',
    date: 'June 2026',
    serviceCategory: 'Offshore & marine logistics',
    images: [
      '/assets/portfolio/2/IMG-20260618-WA0011.jpg',
      '/assets/portfolio/2/IMG-20260618-WA0014.jpg',
      '/assets/portfolio/2/IMG-20260618-WA0015.jpg',
      '/assets/portfolio/2/IMG-20260618-WA0015 (1).jpg',
      '/assets/portfolio/2/IMG-20260618-WA0016.jpg',
      '/assets/portfolio/2/IMG-20260618-WA0017.jpg',
      '/assets/portfolio/2/IMG-20260618-WA0018.jpg',
      '/assets/portfolio/2/IMG-20260618-WA0019.jpg',
      '/assets/portfolio/2/IMG-20260618-WA0019 (1).jpg',
      '/assets/portfolio/2/IMG-20260618-WA0021.jpg',
      '/assets/portfolio/2/IMG-20260618-WA0021 (1).jpg',
    ],
  },
  {
    slug: 'st-felicia-accommodation',
    title: 'St. Felicia: Offshore Accommodation Vessel Inspection',
    description: 'Comprehensive inspection and maintenance of the St. Felicia houseboat. The scope included verifying onboard safety systems, checking the structural integrity of the accommodation modules, and preparing the vessel for a long-term offshore catering and hospitality management contract.',
    client: 'Upstream Oil & Gas Partner',
    location: 'Egbediama, Bayelsa, Nigeria',
    date: 'June 2026',
    serviceCategory: 'Offshore catering & accommodation',
    images: [
      '/assets/portfolio/3/IMG-20260618-WA0013.jpg',
      '/assets/portfolio/3/IMG-20260618-WA0020.jpg',
      '/assets/portfolio/3/IMG-20260618-WA0022.jpg',
      '/assets/portfolio/3/IMG-20260618-WA0023.jpg',
      '/assets/portfolio/3/IMG-20260618-WA0024.jpg',
      '/assets/portfolio/3/IMG-20260618-WA0024 (1).jpg',
    ],
  },
  {
    slug: 'st-felicia-asset-integrity',
    title: 'Asset Integrity: Houseboat Maintenance & Upgrade',
    description: 'Routine maintenance, safety upgrade, and asset integrity verification for the St. Felicia houseboat. The operation ensures compliance with NUPRC regulations and International Marine Contractors Association (IMCA) standards.',
    client: 'Upstream Oil & Gas Partner',
    location: 'Bayelsa, Nigeria',
    date: 'June 2026',
    serviceCategory: 'Plant maintenance & facility upgrades',
    images: [
      '/assets/portfolio/4/St Felicia pic..jpg',
    ],
  },
];
