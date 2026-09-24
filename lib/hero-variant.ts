export type HeroVariant = 'journey' | 'video';

// Mon, Tue and Thu get the corporate video hero by default;
// every other day gets the 3D journey. HERO_VARIANT_SWAP=true flips the two.
const VIDEO_DAYS = new Set(['Mon', 'Tue', 'Thu']);

export function getHeroVariant(now = new Date()): HeroVariant {
  // Evaluate the weekday in Lagos time, not the server's (Vercel runs UTC).
  const day = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Africa/Lagos' }).format(now);
  const video = VIDEO_DAYS.has(day) !== (process.env.HERO_VARIANT_SWAP === 'true');
  return video ? 'video' : 'journey';
}
