'use client';

import { createContext, useContext } from 'react';

import type { PortfolioNavItem } from '../lib/portfolio-types';

const PortfolioNavContext = createContext<PortfolioNavItem[]>([]);

/** Carries the track-record menu entries, fetched once in the root layout,
    down to SiteHeader — which is a client component and also rendered from
    client pages, so it cannot query the database itself. */
export default function PortfolioNavProvider({ items, children }: { items: PortfolioNavItem[]; children: React.ReactNode }) {
  return <PortfolioNavContext.Provider value={items}>{children}</PortfolioNavContext.Provider>;
}

export function usePortfolioNav() {
  return useContext(PortfolioNavContext);
}
