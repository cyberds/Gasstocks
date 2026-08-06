'use client';

import { useEffect } from 'react';

/* Loads a classic script from public/ once, after the calling component's
   markup is in the DOM.

   Both public/js/gs-scene.js and public/js/image-slot.js define custom
   elements whose class bodies `extend HTMLElement`. That throws on import in
   Node, so neither file can be bundled or server-rendered — they have to stay
   unbundled in public/ and arrive as ordinary <script> tags. Keeping them
   classic scripts (not modules) also preserves document.currentScript, which
   gs-scene.js uses to resolve three.js relative to its own URL.

   Calling this from useEffect is what guarantees the markup exists first —
   see the ordering note in components/Journey.tsx. */
export function useScript(src: string) {
  useEffect(() => {
    if (document.querySelector(`script[data-gs-src="${src}"]`)) return;
    const el = document.createElement('script');
    el.src = src;
    el.async = false;
    el.dataset.gsSrc = src;
    document.body.appendChild(el);
  }, [src]);
}
