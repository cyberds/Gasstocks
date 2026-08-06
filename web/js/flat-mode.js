/* Flat-mode arbiter. Runs in <head>, before the scene, so a device that will
   never get the 3D journey never pays for it: setting data-gs-flat on the root
   element is the only signal, and styles/site.css owns everything that follows
   from it. */
(function () {
  var root = document.documentElement;
  var flat = function () { root.setAttribute('data-gs-flat', ''); };
  if (window.matchMedia('(max-width: 860px)').matches) flat();
  window.addEventListener('resize', function () {
    if (window.matchMedia('(max-width: 860px)').matches) flat();
  }, { passive: true });
  // three.js never arrived — stop waiting and show the flat page. The scene
  // signals data-booting once its module import resolves, so a slow fetch
  // and a slow world build each get their own budget rather than sharing one.
  // A hidden tab has no animation frames, so the world build legitimately
  // stalls; give up only once the page is actually being looked at.
  var giveUp = function () {
    if (document.querySelector('gs-scene[data-ready]')) return;
    if (document.hidden) {
      document.addEventListener('visibilitychange', function once() {
        document.removeEventListener('visibilitychange', once);
        setTimeout(giveUp, 9000);
      });
      return;
    }
    flat();
  };
  setTimeout(function () {
    var s = document.querySelector('gs-scene');
    if (s && s.hasAttribute('data-ready')) return;
    if (s && s.hasAttribute('data-booting')) { setTimeout(giveUp, 12000); return; }
    giveUp();
  }, 9000);
})();
