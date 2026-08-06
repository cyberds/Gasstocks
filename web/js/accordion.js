/* About accordion — each item toggles independently (not exclusive: more
   than one section can stay open, matching the reference). Height animates
   via a 0fr/1fr grid-template-rows transition, so there is no JS measuring
   and no jump when content or viewport width changes. */
(() => {
  const items = document.querySelectorAll('[data-gs-acc-item]');

  items.forEach((item) => {
    const trigger = item.querySelector('[data-gs-acc-trigger]');
    const panel = item.querySelector('[data-gs-acc-panel]');
    if (!trigger || !panel) return;

    const set = (open) => {
      item.toggleAttribute('data-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      panel.hidden = false; // stays in the DOM; the grid-rows transition owns visibility
    };

    set(item.hasAttribute('data-open'));
    trigger.addEventListener('click', () => set(!item.hasAttribute('data-open')));
  });
})();
