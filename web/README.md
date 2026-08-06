# Gasstocks homepage

Static HTML + CSS + three.js port of the `Gasstocks Homepage.dc.html` design
(Claude Design project `de423170`). No build step, no framework, no runtime
third-party dependency other than the Google Fonts import in `styles/tokens.css`.

## Run it

```bash
python -m http.server 5173 --directory web
```

Then open <http://localhost:5173>. It must be served over HTTP — `gs-scene.js`
loads three.js with a dynamic `import()`, which `file://` blocks.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | The whole page. Markup is carried over verbatim from the design, including its inline styles — they are the design's source of truth, so keep edits here rather than re-deriving them into classes. |
| `styles/tokens.css` | The Industry design system: tokens (`--color-*`, `--font-*`, `--space-*`) and component classes (`.btn`, `.card`, `.tag`, `.table`, `.blueprint`, `.input`). Upstream file, copied unmodified — re-sync it from the design project rather than editing it. |
| `styles/site.css` | Page-level layer: the Gasstocks indigo (`#28166F`) accent ramp that overrides the system's steel default, plus every rule that flat mode depends on. |
| `js/gs-scene.js` | The `<gs-scene>` custom element — the scrolled 3D world (sea → carrier → dredger → jetty → tank farm → plant yard → exploded capability diagram). Builds all geometry and textures procedurally; no model or image fetches. |
| `js/flat-mode.js` | Decides whether the 3D journey runs at all. Runs in `<head>`, before the scene. |
| `js/showcase.js` | The service slider under the 3D journey. |
| `js/accordion.js` | The "Who we are" expand/collapse list. |
| `js/image-slot.js` | `<image-slot>` — the fillable photo placeholder used in the Track record cards. |
| `vendor/three.module.js` | three.js r160, vendored. |
| `assets/logo-3d.png` | Brand mark. |

## The two layouts

The page has exactly one alternate layout, and one switch that selects it:
`data-gs-flat` on `<html>`. Set it and `styles/site.css` unpins the sticky
scroller, hides the 3D stage, and drops all seven overlay panels into normal
document flow as stacked sections. Everything that gives up on WebGL uses that
one signal — `js/flat-mode.js` sets it for viewports ≤ 860px and when the scene
fails to become ready in time, and `GsScene.fail()` sets it on any GL error or
failed three.js load. There is no third state to reason about.

## The rail slider

One script, `js/showcase.js`, drives every `[data-gs-rail]` on the page as an
independent instance — card size and content are just CSS, so a rail is just
markup in that shape. There are two on the page today:

- **Showcase** — four large image cards between the 3D journey and the
  capability register. Markup in `index.html`, styles in the `.gs-showcase` /
  `.gs-card` / `.gs-rail` block in `styles/site.css`.
- **Equipment fleet** — six compact cards inside Equipment leasing (four land
  plant, two marine: barges & pontoons, tugs & workboats). Same `.gs-rail` /
  `.gs-track` / `.gs-controls` shell, with its own smaller card styled by
  `.gs-eq-*`.

**Autoplay dwell is 2000ms** — `AUTOPLAY_MS` at the top of `js/showcase.js`,
shared by both rails. (It shipped at 500ms per an earlier brief, then was
raised: at 500ms neither slide nor its CTA is readable, and fast repeated
motion is a known vestibular-discomfort trigger.) The transition duration
auto-relaxes between a shortened 380ms and the default 620ms based on that one
constant — `FAST_MS` is the threshold, currently unused at 2000ms — so raising
or lowering the dwell is the only edit needed to retune either rail.

Autoplay pauses on hover, on focus, when the tab is hidden, and under
`prefers-reduced-motion`. Arrows, dots, arrow keys and drag all drive it
manually, any manual move restarts the dwell, and only cards actually in view
keep their CTA in the tab order. Each rail instance runs its own timer and
index — interacting with one never touches the other.

**End stop.** A rail does not translate by `index x pitch` without a bound:
several equipment cards share the viewport, so past a point that would scroll
into empty space. Every shift is clamped so the last card's trailing edge lands
on the same 1320px content column the rest of the page uses, and `lastIndex` —
the count of positions that are actually distinct — is derived from the same
measurement. Dots beyond it are removed rather than dimmed, so the rail never
advertises a slide it cannot reach. On desktop the six equipment cards
therefore show three dots; on mobile, where one card fills the view, all six.
This is all measured live, and re-measured on resize and on late image loads,
since both change where the end stop falls.

**Dragging.** `touch-action: pan-y` on `.gs-viewport` is the contract with the
browser: vertical gestures stay page scrolling, horizontal ones are the rail's.
One pointer path covers touch, pen and mouse. The gesture picks an axis within
the first few pixels (`AXIS_LOCK`) and hands vertical drags straight back to the
page; horizontal drags track the finger exactly, with resistance past either
end rather than a hard wall. Release snaps to the nearest card, or the next one
on a flick (`FLICK_V`, floored by `FLICK_MIN` so a fast twitch is not mistaken
for one). A drag that ends on a CTA suppresses that click; a plain tap on it
still navigates.

Card images are hotlinked from Unsplash's CDN. If you would rather the page
have no third-party image dependency, download the files into `assets/` and
repoint the `src` attributes.

The equipment cards' `card-meta` line for the two marine items ("Placeholder ·
fleet count", "Bare or crewed charter") and the stat strip below the rail (96
units / 94% / 48h) are placeholders — the strip predates the marine assets and
should be reviewed once real fleet numbers exist for barges and tugs.

## The About accordion

Under `#about`, between the showcase slider and the capability register.
Markup and the four items are in `index.html`; styling is the `.gs-about` /
`.gs-acc-*` block in `styles/site.css`; behaviour is `js/accordion.js`.

Only the first item ("Who we are?") has real copy — its body text is the exact
paragraph supplied for this section. The other three ("What we want to
become", "Our purpose", "Our values") are filler placeholders awaiting real
copy; swap their `<p>` content in `index.html` when it's ready, no other
change needed.

Items toggle independently (opening one does not close another), matching the
reference. Height animates via a `grid-template-rows: 0fr → 1fr` transition —
no JS measuring, so it stays correct across reflow and viewport width without
extra wiring.

## three.js resolution

`js/gs-scene.js` resolves three in this order:

1. `window.GS_THREE_URL`, if the page sets it before the script runs.
2. `vendor/three.module.js`, resolved against the script's own URL — so the page
   works from any route depth.
3. `https://unpkg.com/three@0.160.0/build/three.module.js`, if the vendored copy
   is missing from a deploy.

To upgrade three, replace `vendor/three.module.js` and bump the fallback URL in
`js/gs-scene.js` to match.

## Before this goes live

- The contact `<form>` has no action; it is guarded with `onsubmit="return false"`.
  Point it at your endpoint and remove the guard.
- Contact details in the Contact section are placeholders (`+00 000 000 0000`,
  `Address line one, city, country`).
- Track record photos are empty `<image-slot>`s. Give each one a `src` once real
  photography exists — that makes the slot read-only. Until then a slot can be
  filled by dropping or picking a file, kept in `localStorage` for preview only.
- The "Selected clients & principals" row is six `CLIENT MARK` placeholders.

## Re-syncing from the design project

`gs-scene.js` and `styles/tokens.css` are copies of design-project files. When
the design changes, re-copy them and re-apply the one local patch to
`gs-scene.js` (the three.js resolution above). `index.html` is a hand-port: the
design file wraps its body in the authoring runtime's `<x-dc>` / `<helmet>` /
`<x-import>` elements, which are stripped here in favour of ordinary `<link>`,
`<script>`, and `<gs-scene>` tags.
