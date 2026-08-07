# Gasstocks

Next.js (App Router, TypeScript) port of the static `web/` site, on the way to a
backend and a Gemini-powered chatbot. Deploy target is Vercel.

```bash
npm run dev     # http://localhost:3000
npm run build
```

> **Don't run `npm run build` while `npm run dev` is running** — they share
> `.next/` and the build leaves the dev server serving an empty page until it is
> restarted.

## Where things live

| Path | What it is |
| --- | --- |
| `app/layout.tsx` | `<head>`, metadata, `next/font` wiring, and the flat-mode boot script. |
| `app/page.tsx` | Composes the ten page sections in order. |
| `components/*.tsx` | One component per section of the original page. |
| `hooks/useRail.ts` | The rail slider — port of `web/js/showcase.js`. |
| `hooks/useScript.ts` | Loads the two unbundled custom-element scripts from `public/`. |
| `public/js/gs-scene.js` | The `<gs-scene>` 3D world, **copied verbatim** from the design project. |
| `public/js/image-slot.js` | `<image-slot>`, copied verbatim. |
| `public/vendor/three.module.js` | three.js r160, vendored. |
| `styles/tokens.css` | Design-system tokens. Upstream file — re-sync, don't edit. One local patch (below). |
| `styles/site.css` | Page-level layer, including everything flat mode depends on. Upstream file. |
| `styles/app.css` | The only app-owned stylesheet. Keep it small. |
| `tools/html-to-jsx.mjs` | The mechanical converter used for the migration (see below). |
| `web/` | **Legacy static site.** Kept as the reference during migration; delete once you're satisfied. |

## How the migration was done

`web/index.html` was converted **mechanically**, not by hand — `tools/html-to-jsx.mjs`
re-spells markup as JSX (`style="…"` → `style={{…}}`, `class` → `className`,
`for` → `htmlFor`, voids self-closed, entities decoded) without re-deriving any
of the design. Inline styles are carried over verbatim: they are the design's
source of truth.

The result was verified by diffing the server-rendered HTML against the original
document token by token — all 955 elements, inline style declarations and text
nodes. There is exactly **one** intentional difference: the header logo and
favicon pointed at `assets/logo-3d.png`, which never existed (the file on disk
was `logo-3d - Copy.png`), so both were broken on the old site and are now fixed.

## The four things that needed real work

**`flat-mode.js` → `app/layout.tsx`.** It must set `data-gs-flat` on `<html>`
*before first paint*, so it cannot be a `useEffect`. It is inlined into `<head>`
verbatim. `<html>` carries `suppressHydrationWarning` because that attribute is
deliberately present before React hydrates.

**`gs-scene.js` stays unbundled.** Its class body extends `HTMLElement`, which
throws on import in Node, so it can never be bundled or server-rendered; and it
resolves three.js through a runtime `import()` no bundler can analyse. Left as a
classic script in `public/`, `document.currentScript` still resolves and its own
resolution logic works untouched — so re-syncing from the design project stays a
straight file copy.

*Ordering is load-bearing.* `boot()` queries `[data-gs-scroller]`, the seven
`[data-gs-panel]`s and the nine `[data-gs-node]`s exactly once, with no
`MutationObserver`. `components/Journey.tsx` therefore loads the script from a
`useEffect`, which guarantees the markup is already in the DOM. Move the script
any earlier and scroll progress and all nine capability labels die silently.

**`showcase.js` → `hooks/useRail.ts`.** The original booted on `DOMContentLoaded`,
which in the App Router fires before React renders the rails — it found nothing
and neither rail worked. The algorithm (end-stop measurement, `lastIndex`
derivation, axis-locked dragging, flick detection, autoplay dwell) is carried
over unchanged; only mounting changed. Every listener now registers with
`{ signal }` and is torn down on unmount, which the original never did, and the
prev/next lookups are guarded.

**`accordion.js` → `components/AboutAccordion.tsx`.** Broke the same way;
rewritten with `useState`. Items still toggle independently.

## Local patch to an upstream file

`styles/tokens.css` — the Google Fonts `@import` is commented out, because
`app/layout.tsx` loads Barlow and Barlow Condensed through `next/font/google`
instead and `styles/app.css` repoints `--font-body` / `--font-heading` at the
generated families. Re-apply on re-sync; the original line is kept in the comment.

## The backend (Phase 2)

`lib/company.ts` is the single source of truth for company facts — the contact
block, the form's default recipient and (from Phase 3) the chatbot's action
buttons all read from it. **Do not add claims to it that the company profile
does not support**; it feeds a tender-facing site.

`app/api/contact/route.ts` takes the enquiry. `lib/enquiry.ts` holds the zod
schema, imported by both the route and the form so client and server validation
cannot drift — the server copy is the one that counts.

Three things there are less obvious than they look:

- **Two rate limits, not one.** A loose 30/10min guard runs before any work; the
  strict 5/10min send limit is checked *after* validation passes. Counting
  validation failures against a five-attempt budget locks out an ordinary
  person who makes a few typos, which is the wrong user to punish.
- **The honeypot field is deliberately unconstrained in the schema.** It has to
  validate so the route can answer `200` and silently drop the message.
  Rejecting it in the schema would hand a bot a `400` naming the field that
  caught it.
- **`lib/rate-limit.ts` is in-memory**, so on Vercel each serverless instance
  keeps its own counter and a distributed burst gets a higher effective limit.
  It stops casual spam and double-submits, not a determined attacker. Swap in
  Vercel KV / Upstash if abuse becomes real — the call site won't change.

Copy `.env.example` to `.env.local` and set `RESEND_API_KEY`. Without it the
form returns a 503 pointing visitors at the email address, and logs the enquiry
it could not deliver. Resend only sends from a **verified domain** — until
`gasstocksltd.com` is verified, the fallback `onboarding@resend.dev` delivers to
the Resend account owner only.

## The service catalogue

`lib/services.ts` is the single source of truth for what the company does —
**20 services in 4 groups**. It is the union of the company profile and the
previous Gasstocks website, which the client confirmed reflects genuine
offerings, so eleven services that had never appeared on the site are now
present.

The naming rule, set by the client: **a service's `name` is what visitors read**,
so it must be something a customer would recognise and search for. The `group` is
the quiet layer — it filters, sorts and labels, and never competes for attention.
Keep that split when adding anything.

Twenty services is a wall of text if presented flat, so the page discloses them
in three layers:

1. **The 3D journey** carries nine flagship services. The count is fixed —
   `gs-scene.js` hard-codes nine label keys (`KEYS`, `public/js/gs-scene.js:31`)
   and builds the geometry around them — but the label *text* lives in the React
   markup, so it can be reworded without touching the vendored file. **Never
   change the `data-gs-node` keys.**
2. **The capability register** (`components/Capability.tsx`) holds all twenty,
   grouped with filter chips. "All" renders four labelled blocks rather than one
   twenty-row wall.
3. **The rails** are the marketing layer and are unchanged.

The register's old `Standard` column (IADC, BS 6349, Eurocode, AASHTO,
ISO 55001) was replaced by the category, and `Key plant` was dropped — it had no
data for eleven of the twenty services.

### Keeping the chatbot's document in step

`content/company.md` is the chatbot's knowledge base and needs the same catalogue
and compliance list the page shows. Two hand-maintained copies drift, and a
drifted copy is exactly how the bot ends up contradicting the page a visitor is
reading. So:

```bash
npm run sync:company
```

regenerates the block between the `BEGIN GENERATED` / `END GENERATED` markers
from `lib/company.ts` and `lib/services.ts`. Everything outside the markers —
history, values, FAQ — is hand-written and never touched. `npm run sync:company -- --check`
fails if the doc is stale, if you want it in CI.

## Compliance

`COMPANY.accreditations` in `lib/company.ts` is **evidence-only** and exhaustive:
ISO 9001:2015 (DQS/IQNet, cert. 40400090 QM15), NUPRC, NCDMB NOGIC JQS Category 1,
IMCA, PETAN, and the RC number. `components/Assurance.tsx` renders it directly.

The section previously advertised ISO 14001, ISO 45001, ISM Code DOC, ISO 22000
and a NIMASA cabotage licence, none of which the company holds — placeholder copy
from the original design. **Do not restore anything there without a certificate
to point at.** This is the first section a prequalification audit checks, and an
unsupported ISO claim is worse than a missing one.

## Unverified claims still on the page

Deliberately absent from `lib/company.ts` so they cannot reach the chatbot, but
**still rendered** and awaiting a decision:

| Where | Claim |
| --- | --- |
| Footer | "operating since 2008" — the profile lists three offices in two countries |
| Hero stats | "184 projects delivered" — no project count in the profile |
| Equipment rail | "24 / 31 / 96 units", "94% availability", "48h mobilisation" |
| 3D journey panels 3 & 4 | "Design code — BS 6349 · Eurocode", "Piling — tubular to 1,220 mm", "Roads built — 610 km cumulative", "Standard — AASHTO · ISO 9001" |

The design codes were left in place because they describe what the company builds
*to*, which is a weaker claim than a credential it holds — but "610 km cumulative"
is an unevidenced metric of the same kind as "184 projects".

Resolved: the hero's "est. 2004" is corrected to **2008**, which both the profile
and the About accordion give.

## The assistant (Phase 3)

`components/Chatbot.tsx` (launcher + panel) talks to `app/api/chat/route.ts`,
which uses `lib/gemini.ts`. Answers stream as newline-delimited JSON.

**`lib/gemini.ts` imports `server-only`** — importing it from a client component
is a build error, which is the cheapest possible guarantee that `GEMINI_API_KEY`
never reaches a browser.

### Two passes, and why

Gemini will not combine `google_search` with cached content or a system
instruction in one request, so answering from the document and searching the web
cannot be the same call:

1. **Document pass** — no tools, stable cacheable prefix. The model either
   answers, or outputs the bare sentinel `NEED_WEB`.
2. **Web pass** — re-runs with `google_search` enabled, only on `NEED_WEB`.

The route peeks at the first few characters of pass 1 to decide, so a genuine
answer starts streaming immediately rather than waiting for the whole response.

### Prefix ordering is the caching mechanism

In `lib/gemini.ts`, everything stable — instructions, then the document — comes
first and is byte-identical every request; conversation and question come
strictly last. **Put anything variable ahead of the document (a timestamp, a
session id, a visitor's name) and every cache hit silently disappears while the
code still appears to work.**

The route logs `prompt=… cached=… output=…` on every call. `cached > 0` is the
proof that caching is live.

### Action buttons

The model emits literal `[[ACTION:email]]`, `[[ACTION:whatsapp]]`,
`[[ACTION:call]]` markers, which `Chatbot.tsx` strips and renders as buttons
wired to `lib/company.ts` with the visitor's question prefilled. Markers rather
than structured output or function calling, because `google_search` cannot be
combined with either — markers work identically on both passes.

### ⚠ The free tier blocks caching and web search

Both were verified against the live API, and both are tier limitations, not code
problems. **Neither works until the Gemini API project has billing enabled.**

| Feature | Free-tier result |
| --- | --- |
| Explicit caching | `create` refused: `TotalCachedContentStorageTokensPerModelFreeTier … limit=0` |
| Implicit caching | `cachedContentTokenCount` is `0` on every call, even with an identical 8,500-token prefix |
| Grounded search | The same request succeeds without tools and returns `429` with `google_search` |

Caching needs no code change — the prefix ordering above starts paying the
moment billing is on. Until then, the web pass fails gracefully: the visitor
gets an honest "I don't have that to hand" plus contact buttons, never an error.

Also note `gemini-2.5-flash` is **no longer available to new API users**; the
default is `gemini-3.5-flash-lite`, overridable via `GEMINI_MODEL`.

## Still to do

- Enable billing on the Gemini project to switch on caching and web search.
- Set `RESEND_API_KEY` and verify `gasstocksltd.com` in Resend so the contact
  form delivers.
- Card images are hotlinked from Unsplash; Track record photos are empty
  `<image-slot>`s persisting to `localStorage` — they need real photography
  before launch.
- No WhatsApp number was supplied; `lib/company.ts` defaults to the Nigeria
  line, overridable via `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- Fill in the FAQ section of `content/company.md`. It is the highest-value part
  of the file — the part no web search can substitute for.
