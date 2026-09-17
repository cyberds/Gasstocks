/** Shape the public site renders. `images` are delivery URLs. Safe to import
    from client components — lib/portfolio.ts is server-only. */
export interface Portfolio {
  id: string;
  slug: string;
  title: string;
  description: string;
  client: string;
  location: string;
  date: string;
  serviceCategory: string;
  images: string[];
}

export type PortfolioImage = { url: string; publicId: string };

export type PortfolioNavItem = Pick<Portfolio, 'slug' | 'title'> & { image: string | null };
