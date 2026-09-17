/* mongodb+srv:// URIs need a DNS SRV lookup. Some machines point Node at a
 * local DNS proxy (e.g. 127.0.0.1 from a VPN or security tool) that refuses SRV
 * queries even though the OS resolver works, failing with
 * "querySrv ECONNREFUSED". When — and only when — that lookup fails, switch
 * Node's resolver to public DNS and say so in the log.
 *
 * Plain JS so both the app (allowJs) and the tools/ scripts can import it.
 */
import dns from 'node:dns';

const PUBLIC_DNS = ['1.1.1.1', '8.8.8.8'];
const RETRYABLE = new Set(['ECONNREFUSED', 'ETIMEOUT', 'ESERVFAIL', 'ECONNRESET', 'EREFUSED']);

/** @param {string} uri */
export async function ensureSrvResolvable(uri) {
  const match = /^mongodb\+srv:\/\/(?:[^@/]*@)?([^/?,]+)/.exec(uri);
  if (!match) return;
  const record = `_mongodb._tcp.${match[1]}`;
  try {
    await dns.promises.resolveSrv(record);
  } catch (err) {
    const code = /** @type {{ code?: string }} */ (err).code;
    if (!code || !RETRYABLE.has(code)) throw err;
    const before = dns.getServers();
    dns.setServers(PUBLIC_DNS);
    await dns.promises.resolveSrv(record); // still failing → let it throw
    console.warn(
      `[mongodb] SRV lookup via ${before.join(', ')} failed (${code}); using public DNS ${PUBLIC_DNS.join(', ')} instead.`,
    );
  }
}
