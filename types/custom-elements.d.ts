import type React from 'react';

// The two custom elements defined by public/js/gs-scene.js and
// public/js/image-slot.js. React renders them as ordinary unknown tags; these
// declarations just stop TypeScript objecting.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'gs-scene': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'image-slot': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        shape?: string;
        src?: string;
        placeholder?: string;
        alt?: string;
      };
    }
  }
}

export {};
