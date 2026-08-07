/* Single source of truth for company facts.
 *
 * The page, the contact form's recipient, and (from Phase 3) the chatbot's
 * action buttons all read from here, so a changed phone number is one edit.
 *
 * Sourced from the company profile supplied by the client. Anything NOT in
 * that profile is marked UNVERIFIED — see the notes at the bottom of this file
 * and in README.md. Do not add claims here that the profile does not support:
 * this file feeds a tender-facing site.
 */

export const COMPANY = {
  legalName: 'Gasstocks Limited',
  shortName: 'Gasstocks',
  registrationNumber: 'RC359117',
  commenced: 2008,
  website: 'https://gasstocksltd.com',

  /** The only email address in the company profile. */
  email: 'info@gasstocksinc.org',

  phones: {
    nigeria: '+2348025240251',
    usa: '+18323821221',
  },

  /* WhatsApp: the profile does not name a WhatsApp line. Defaulting to the
     Nigeria number, overridable without a code change. wa.me wants digits
     only, no '+' and no spaces. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2348025240251',

  offices: [
    {
      label: 'Port Harcourt',
      country: 'Nigeria',
      lines: ['41 Herbert Macauley Street', 'Port Harcourt, Nigeria'],
    },
    {
      label: 'Lagos',
      country: 'Nigeria',
      lines: ['Plot 5a Block A10, Admiralty Way', 'by Admiralty Gate, Lekki Phase 1, Lagos, Nigeria'],
    },
    {
      label: 'Houston',
      country: 'United States',
      lines: ['3317 McCulloch Circle', 'Houston, Texas 77056, United States'],
    },
  ],

  /* Compliance, and ONLY what the company profile evidences.
   *
   * This list previously carried ISO 14001, ISO 45001, ISM Code DOC, ISO 22000
   * and a NIMASA cabotage licence, none of which the company holds. They came
   * from design placeholder copy. Do not restore anything here without a
   * certificate to point at: this is the section a prequalification audit
   * checks first, and an unsupported ISO claim is worse than a missing one.
   *
   * `headline` is the tile's large text, `detail` the line beneath it. */
  accreditations: [
    {
      headline: 'ISO 9001:2015',
      detail: 'Quality management · DQS / IQNet · cert. 40400090 QM15',
      logo: '/assets/ISO-9001-2015-DQS-300x300.png',
      logo2: '/assets/IQNET-300x300.png'
    },
    { headline: 'NUPRC', detail: 'Licensed operator', logo: '/assets/NUPRC-logo.png' },
    { headline: 'NCDMB', detail: 'NOGIC JQS · Category 1 Marine Vessel Operator', logo: '/assets/NOJIC-JQS-logo.webp' },
    { headline: 'IMCA', detail: 'Member contractor', logo: '/assets/IMCAlogo-768x284.png' },
    { headline: 'PETAN', detail: 'Member', logo: '/assets/UPDATED-PETAN-LOGO-Transparent.webp' },
    { headline: 'RC359117', detail: 'Registered in Nigeria · 2008' },
  ],
} as const;

/** Display forms. Kept beside the data so formatting never drifts per-usage. */
export const DISPLAY = {
  phoneNigeria: '+234 802 524 0251',
  phoneUsa: '+1 832 382 1221',
} as const;

/** Prefilled deep links, used by the contact block and the Phase 3 chatbot. */
export const links = {
  mailto: (subject?: string, body?: string) => {
    const q = new URLSearchParams();
    if (subject) q.set('subject', subject);
    if (body) q.set('body', body);
    const qs = q.toString();
    return `mailto:${COMPANY.email}${qs ? `?${qs}` : ''}`;
  },
  whatsapp: (text?: string) =>
    `https://wa.me/${COMPANY.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`,
  tel: (which: 'nigeria' | 'usa' = 'nigeria') => `tel:${COMPANY.phones[which]}`,
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   UNVERIFIED CLAIMS STILL ON THE PAGE
   Deliberately NOT represented in this file, so nothing here can launder them
   into the chatbot. Still awaiting the client:

   - Footer: "operating in 14 countries" (profile lists three offices, in
     Nigeria and the USA).
   - Hero stat strip: "184 projects delivered" (profile gives no project count).
   - Equipment rail: "24 units / 31 units / 96 units / 94% / 48h" fleet and
     availability figures, flagged as placeholders since the original build.
   - Two 3D journey panels carry spec strips: "Design code — BS 6349 · Eurocode"
     and "Piling — Tubular to 1,220 mm" (panel 3), "Roads built — 610 km
     cumulative" and "Standard — AASHTO · ISO 9001" (panel 4). Left in place
     because design codes describe what you build TO rather than a credential
     you hold, which is a weaker claim than the certifications that were
     removed — but "610 km cumulative" is an unevidenced metric of the same
     kind as "184 projects delivered", and none of it is confirmed.

   RESOLVED: the services question — the client confirmed the previous site's
   dredging, roads & earthworks, jetty construction and ship management lines
   are genuine, so lib/services.ts is the union of both sources. The compliance
   over-claims are gone. The hero's "est. 2004" is corrected to 2008, which the
   profile and the About accordion both give.
   ───────────────────────────────────────────────────────────────────────── */
