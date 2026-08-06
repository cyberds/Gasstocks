/* Regenerates the facts block of content/company.md from the code that the
 * website itself renders — lib/company.ts and lib/services.ts.
 *
 * WHY THIS EXISTS: content/company.md is the chatbot's knowledge document, and
 * it needs the same service catalogue and compliance list the page shows. Two
 * hand-maintained copies drift, and a drifted copy is exactly how the bot ends
 * up contradicting the page a visitor is looking at. So the page and the
 * document read from one source, and this script carries it across.
 *
 * Everything OUTSIDE the BEGIN/END markers is hand-written and never touched —
 * history, values, narrative, FAQ. Edit those freely.
 *
 *   npm run sync:company            rewrite the block
 *   npm run sync:company -- --check exit 1 if it is out of date (for CI)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOC = path.join(ROOT, 'content', 'company.md');

const BEGIN = '<!-- BEGIN GENERATED — edit lib/company.ts and lib/services.ts, then run npm run sync:company -->';
const END = '<!-- END GENERATED -->';

/* Node 22.6+ strips TypeScript types on import, so the source files can be
 * read directly rather than transpiled or, worse, re-parsed with regexes. Both
 * files use only erasable syntax (annotations and `as const`), which is what
 * that support covers. Requires Node >= 22.6; this repo runs 24. */
const { COMPANY, DISPLAY } = await import(
  `file://${path.join(ROOT, 'lib', 'company.ts').replace(/\\/g, '/')}`
);
const { GROUPS, SERVICES } = await import(
  `file://${path.join(ROOT, 'lib', 'services.ts').replace(/\\/g, '/')}`
);

const lines = [];
const w = (s = '') => lines.push(s);

w('## Company facts');
w();
w(`- **Legal name:** ${COMPANY.legalName}`);
w(`- **Registration number:** ${COMPANY.registrationNumber}`);
w(`- **Commenced business:** ${COMPANY.commenced}`);
w(`- **Website:** ${COMPANY.website}`);
w(`- **Email:** ${COMPANY.email}`);
w(`- **Phone (Nigeria):** ${DISPLAY.phoneNigeria}`);
w(`- **Phone (United States):** ${DISPLAY.phoneUsa}`);
w();
w('### Offices');
w();
for (const o of COMPANY.offices) w(`- **${o.label}, ${o.country}** — ${o.lines.join(', ')}`);
w();

w('## Compliance and certification');
w();
w('This list is exhaustive. Gasstocks holds no certifications beyond those below;');
w('if asked about one that is not here, say plainly that we do not currently hold it.');
w();
for (const a of COMPANY.accreditations) w(`- **${a.headline}** — ${a.detail}`);
w();

w('## Services');
w();
w(`Gasstocks offers ${SERVICES.length} services across ${GROUPS.length} areas. The area names are`);
w('for grouping; customers know these by the service names.');
w();
for (const group of GROUPS) {
  const inGroup = SERVICES.filter((s) => s.group === group);
  w(`### ${group}`);
  w();
  for (const s of inGroup) w(`- **${s.name}** — ${s.covers}`);
  w();
}

const block = `${BEGIN}\n\n${lines.join('\n').trimEnd()}\n\n${END}`;

if (!fs.existsSync(DOC)) {
  console.error(`Missing ${path.relative(ROOT, DOC)} — create it with the markers first.`);
  process.exit(1);
}

const doc = fs.readFileSync(DOC, 'utf8');
const start = doc.indexOf(BEGIN);
const finish = doc.indexOf(END);
if (start === -1 || finish === -1) {
  console.error(`Could not find the generated-block markers in ${path.relative(ROOT, DOC)}.`);
  process.exit(1);
}

const next = doc.slice(0, start) + block + doc.slice(finish + END.length);

if (process.argv.includes('--check')) {
  if (next !== doc) {
    console.error('content/company.md is out of date. Run: npm run sync:company');
    process.exit(1);
  }
  console.log('content/company.md is up to date.');
  process.exit(0);
}

if (next === doc) {
  console.log('content/company.md already up to date — no change.');
} else {
  fs.writeFileSync(DOC, next);
  console.log(`Updated content/company.md — ${SERVICES.length} services, ${COMPANY.accreditations.length} compliance entries.`);
}
