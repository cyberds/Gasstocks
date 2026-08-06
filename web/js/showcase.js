/* Rail slider — drives both the showcase cards under the 3D journey and the
   equipment fleet cards under Equipment leasing. Any element matching
   [data-gs-rail] gets one of these; card size and content are just CSS.

   Two things this has to get right that a naive carousel does not:

   1. The end stop. Translating by index x pitch assumes one card fills the
      viewport. It doesn't here — four equipment cards fit at once — so past a
      point the track would scroll into empty space. Every shift is clamped to
      the real scrollable distance, and the number of reachable positions
      (lastIndex) is derived from that, so dots never advertise a slide that
      cannot be reached.

   2. Dragging. A flick detector that only reads touchstart/touchend feels
      dead, because nothing tracks the finger. This follows the pointer live,
      picks an axis on the first few pixels of movement so vertical page
      scrolling still works, and snaps on release. */
(() => {
  // How long each card holds before the rail advances, shared by every rail.
  const AUTOPLAY_MS = 2000;
  // Below this dwell the transition shortens so a slide can finish inside its
  // own turn instead of being cut off by the next one.
  const FAST_MS = 900;
  // Movement, in px, before a drag commits to an axis. Small enough to feel
  // immediate, large enough that a tap with a shaky thumb is still a tap.
  const AXIS_LOCK = 6;
  // Fraction of a card you must drag before it counts as a move to the next.
  const SNAP_RATIO = 0.25;
  // px/ms — above this a short flick still advances, as a fast swipe should.
  const FLICK_V = 0.45;
  // ...but only once it has actually travelled. Without a floor, a fast twitch
  // of a few px divides by a near-zero elapsed time and reads as a flick.
  const FLICK_MIN = 18;

  const init = (rail) => {
    const viewport = rail.querySelector('.gs-viewport') || rail;
    const track = rail.querySelector('[data-gs-track]');
    const cards = Array.from(track.children);
    const dots = Array.from(rail.querySelectorAll('[data-gs-dot]'));
    const live = rail.querySelector('[data-gs-live]');
    if (!cards.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let timer = null;
    let held = false;      // pointer or focus is on the rail
    let lastIndex = cards.length - 1;
    let drag = null;
    let swallowClick = false;

    if (AUTOPLAY_MS < FAST_MS) rail.setAttribute('data-fast', '');

    /* Geometry, measured live: card width is a viewport clamp and the gap
       changes at the 860px breakpoint, so nothing here may be cached. */
    const offsetOf = (i) => cards[i].offsetLeft - cards[0].offsetLeft;
    const pitch = () => (cards.length > 1 ? offsetOf(1) : cards[0].offsetWidth);
    /* How far the track can travel before the last card's trailing edge
       reaches the content column. Derived from the cards rather than
       track.scrollWidth, which omits a flex container's trailing padding and
       so would park the last card flush against the viewport edge instead of
       lined up with the 1320px column the rest of the page uses. */
    const maxShift = () => {
      const cs = getComputedStyle(track);
      const last = cards[cards.length - 1];
      const extent = (parseFloat(cs.paddingLeft) || 0) + offsetOf(cards.length - 1) +
        last.offsetWidth + (parseFloat(cs.paddingRight) || 0);
      return Math.max(0, extent - viewport.clientWidth);
    };
    const shiftFor = (i) => Math.min(offsetOf(i), maxShift());

    /* The last index that lands on a distinct position. Any index beyond it
       clamps to the same shift, so offering it as a slide would be a lie. */
    const measure = () => {
      const max = maxShift();
      let last = cards.length - 1;
      while (last > 0 && offsetOf(last - 1) >= max) last--;
      lastIndex = last;
      if (index > lastIndex) index = lastIndex;
      dots.forEach((d, i) => { d.hidden = i > lastIndex; });
    };

    const paint = () => {
      const shift = shiftFor(index);
      track.style.transform = 'translate3d(' + -shift + 'px,0,0)';
      cards.forEach((c, i) => {
        c.toggleAttribute('data-current', i === index);
        // Visibility is geometric, not just "is this the active index" —
        // several cards share the viewport on the equipment rail, and hiding
        // a card the user can plainly see would be a lie to a screen reader.
        const left = cards[i].offsetLeft - shift;
        const shown = left + c.offsetWidth > 1 && left < viewport.clientWidth - 1;
        c.setAttribute('aria-hidden', shown ? 'false' : 'true');
        const btn = c.querySelector('a, button');
        if (btn) btn.tabIndex = shown ? 0 : -1;
      });
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === index)));
      if (live) live.textContent = 'Slide ' + (index + 1) + ' of ' + (lastIndex + 1);
    };

    const go = (i) => {
      const n = lastIndex + 1;
      index = ((i % n) + n) % n;
      paint();
    };

    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const start = () => {
      stop();
      if (held || reduced.matches || document.hidden) return;
      timer = setInterval(() => go(index + 1), AUTOPLAY_MS);
    };
    // Any deliberate move resets the dwell, so a click is never immediately
    // overridden by an advance that was already most of the way through.
    const nudge = (i) => { go(i); start(); };

    const hold = () => { held = true; stop(); };
    const release = () => { held = false; start(); };

    rail.querySelector('[data-gs-prev]').addEventListener('click', () => nudge(index - 1));
    rail.querySelector('[data-gs-next]').addEventListener('click', () => nudge(index + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => nudge(i)));

    rail.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hold(); });
    rail.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') release(); });
    rail.addEventListener('focusin', hold);
    rail.addEventListener('focusout', release);

    rail.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); nudge(index + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); nudge(index - 1); }
    });

    /* ---------- drag ----------
       One pointer path covers touch, pen and mouse. The track only takes over
       the gesture once movement is decided to be horizontal; a vertical drag
       is handed straight back to the page so scrolling still works, which is
       what `touch-action: pan-y` on the viewport declares up front. */
    const onDown = (e) => {
      // Clear first, unconditionally: a suppression armed by an earlier drag
      // must never survive to eat an unrelated later click.
      swallowClick = false;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target.closest('button, a')) return; // let controls and CTAs be
      drag = {
        id: e.pointerId,
        x0: e.clientX, y0: e.clientY,
        base: shiftFor(index),
        axis: null, dx: 0,
        t0: performance.now(),
      };
      hold();
    };

    const onMove = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x0;
      const dy = e.clientY - drag.y0;

      if (!drag.axis) {
        if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
        if (Math.abs(dy) > Math.abs(dx)) { drag = null; release(); return; }
        drag.axis = 'x';
        track.style.transition = 'none';
        rail.setAttribute('data-dragging', '');
        try { rail.setPointerCapture(drag.id); } catch (err) { /* not captureable */ }
      }

      drag.dx = dx;
      const max = maxShift();
      let s = drag.base - dx;
      // Resistance rather than a hard wall past either end, so overshooting
      // reads as "there is nothing more here" instead of a broken control.
      if (s < 0) s *= 0.35;
      else if (s > max) s = max + (s - max) * 0.35;
      track.style.transform = 'translate3d(' + -s + 'px,0,0)';
    };

    const onUp = (e) => {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      const d = drag;
      drag = null;
      track.style.transition = '';
      rail.removeAttribute('data-dragging');
      try { rail.releasePointerCapture(d.id); } catch (err) { /* already gone */ }

      if (d.axis === 'x') {
        // A drag that ends on a link must not also count as a click on it.
        if (Math.abs(d.dx) > AXIS_LOCK) swallowClick = true;
        const p = pitch() || 1;
        const v = d.dx / Math.max(1, performance.now() - d.t0);
        let steps = -Math.round(d.dx / p);
        const flicked = Math.abs(v) > FLICK_V && Math.abs(d.dx) > FLICK_MIN;
        if (!steps && (flicked || Math.abs(d.dx) > p * SNAP_RATIO)) {
          steps = d.dx < 0 ? 1 : -1;
        }
        // Dragging is a direct manipulation of a finite strip: it should stop
        // at the ends rather than teleport to the far side like autoplay does.
        go(Math.max(0, Math.min(lastIndex, index + steps)));
      }
      release();
    };

    rail.addEventListener('pointerdown', onDown);
    rail.addEventListener('pointermove', onMove);
    rail.addEventListener('pointerup', onUp);
    rail.addEventListener('pointercancel', onUp);
    // Scoped to the track, not the rail: the arrows and dots live outside it,
    // so no drag can ever swallow a click on a control.
    track.addEventListener('click', (e) => {
      if (!swallowClick) return;
      swallowClick = false;
      e.preventDefault();
      e.stopPropagation();
    }, true);
    // Native image dragging would hijack the gesture on desktop.
    rail.addEventListener('dragstart', (e) => e.preventDefault());

    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    reduced.addEventListener('change', start);
    window.addEventListener('resize', () => { measure(); paint(); }, { passive: true });
    // Late images change scrollWidth, which changes where the end stop is.
    rail.querySelectorAll('img').forEach((img) => {
      if (img.complete) return;
      img.addEventListener('load', () => { measure(); paint(); }, { once: true });
    });

    measure();
    paint();
    start();
  };

  const boot = () => document.querySelectorAll('[data-gs-rail]').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
