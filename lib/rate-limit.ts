/* Fixed-window in-memory rate limiter.
 *
 * DELIBERATELY MODEST, and you should know its limits before relying on it:
 * the counter lives in the process, so on Vercel each serverless instance has
 * its own, and a burst spread across instances gets a higher effective limit.
 * It is here to stop casual form-spam and accidental double submits, not a
 * determined attacker. If abuse becomes real, move this to Upstash/Vercel KV —
 * the call site does not need to change.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Stops the map growing without bound on a long-lived instance. */
function sweep(now: number) {
  if (windows.size < 5000) return;
  for (const [key, w] of windows) if (w.resetAt <= now) windows.delete(key);
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets — sent as Retry-After on a 429. */
  retryAfter: number;
};

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = windows.get(key);
  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  existing.count++;
  const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  return {
    ok: existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    retryAfter,
  };
}

/* Client IP. On Vercel, x-forwarded-for is set by the platform and its FIRST
   entry is the real client; later entries are proxies. x-real-ip is checked
   first because it is a single value and harder to spoof than a
   client-supplied x-forwarded-for on a non-Vercel deploy. */
export function clientIp(headers: Headers): string {
  const real = headers.get('x-real-ip');
  if (real) return real.trim();
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return 'unknown';
}

/** Exposed for tests. */
export function __resetRateLimits() {
  windows.clear();
}
