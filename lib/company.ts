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
    { headline: 'NUPRC', detail: 'Licensed operator · service-category permits (issued by DPR, now NUPRC)', logo: '/assets/NUPRC-logo.png' },
    { headline: 'NCDMB', detail: 'NOGIC JQS · Category 1 Marine Vessel Operator', logo: '/assets/NOJIC-JQS-logo.webp' },
    { headline: 'IMCA', detail: 'Member contractor', logo: '/assets/IMCAlogo-768x284.png' },
    { headline: 'PETAN', detail: 'Member', logo: '/assets/UPDATED-PETAN-LOGO-Transparent.webp' },
    { headline: 'RC359117', detail: 'Registered in Nigeria · 2008' },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   Everything below is taken from the Gasstocks Limited business profile
   (Gasstocks_Limited_Company_Profile_Accessible.md, © 2019). Wording is tidied
   but claims are not extended. The profile is a 2019 document — dated items
   (contract periods, "to date") describe that point in time.
   ───────────────────────────────────────────────────────────────────────── */

/** Clients. The first eight are the profile's client page; the last three
 *  come from the previous website and are kept pending client confirmation. */
export const CLIENTS = [
  { name: 'Shell Petroleum Development Company of Nigeria (SPDC)', logo: '/assets/clients/Shell-gas-station-logo-trans.png' },
  { name: 'Nigerian Agip Oil Company (Eni)', logo: '/assets/clients/eni-logo.png' },
  { name: 'Nigeria LNG (NLNG)', logo: '/assets/clients/nlng-logo.png' },
  { name: 'Chevron Nigeria Limited', logo: '/assets/clients/Chevron_Logo.svg.webp' },
  { name: 'Mobil Producing Nigeria (ExxonMobil)', logo: '/assets/clients/Exxon_Mobil_Logo.svg.webp' },
  { name: 'Total E&P Nigeria (TotalEnergies)', logo: '/assets/clients/totalenergies-logo.png' },
  { name: 'Saipem', logo: '/assets/clients/saipem-logo.png' },
  { name: 'Eroton Exploration & Production', logo: '/assets/clients/eroton-logo.png' },
  { name: 'NNPC Limited', logo: '/assets/clients/Nigerian_National_Petroleum_Company_logo.svg.webp' },
  { name: 'Ardova Plc', logo: '/assets/clients/ardova.e1c5751.png' },
  { name: 'Ronish', logo: '/assets/clients/ronish-logo.png' },
] as const;

/** The owned and accessible fleet, as listed on the profile's equipment page. */
export const FLEET = [
  { name: 'River tugboats', spec: '500 hp, 800 hp and 1,000 hp' },
  { name: 'Ocean tugboats', spec: 'Three power classes (30, 40 and 50)' },
  { name: 'Ramp barges', spec: '500 t, 800 t and 1,000 t' },
  { name: 'Dump barges', spec: '500 t to 1,500 t' },
  { name: 'Passenger crew boats', spec: '40, 50 and 60 seats · 20–25 knots' },
  { name: 'Houseboats', spec: '40-, 60- and 80-man, with catering and hotel services' },
  { name: 'Security vessels & gunboats', spec: 'Manned by the Nigerian Navy, Army and Police' },
  { name: 'Patrol boats', spec: '15 passengers · 25 knots' },
  { name: 'Fast crew / patrol vessels', spec: 'Accommodation for 10–15 · 25 knots' },
  { name: 'Hovercraft', spec: '12 persons · 50 km/h' },
  { name: 'Fast supply vessel', spec: '64 passengers, 18 berths · 20 knots' },
  { name: 'DP3 multipurpose offshore construction vessel', spec: 'ROV, 40 t crane, helideck, 140 persons' },
  { name: 'Cranes', spec: '30 t, 50 t, 60 t and 80 t' },
] as const;

/** Logistics bases operated with strategic partners. */
export const LOGISTICS_BASES = [
  'Port Harcourt', 'Lagos', 'Warri', 'Houston', 'India', 'China', 'Hong Kong', 'London', 'Belgium',
] as const;

/** Jetties and fabrication yards accessible for in-country logistics. */
export const JETTIES = [
  'Brawal Shipping Jetty, Onne FTZ',
  'Starzs Marine & Engineering Jetty, FOT Onne',
  'Premier Logistics Base (former Panalpina), Onne',
  'El-Toutoma Jetty, Woji, Port Harcourt',
  'Akpos Jetty, Abuloma, Port Harcourt',
  'Hollyfield Jetty, Elelenwo Bypass, Port Harcourt',
  'Tecon Jetty, Trans Amadi, Port Harcourt',
  'Mabisel Jetty, Trans Amadi, Port Harcourt',
  'Multiplan Jetty, Abuloma, Port Harcourt',
  'PW Jetty, Abuloma, Port Harcourt',
  'Lumbert Jetty, Trans Amadi',
  'Nest Oil Jetty',
  'Graham Petroserve Jetty, Warri',
  'LADOL Deep Offshore Logistics Base, Lagos',
] as const;

/** Contract history from the profile. Client contact names are deliberately
 *  omitted — they are third parties' personal details. */
export const TRACK_RECORD = [
  { client: 'SPDC', period: '2004 – 2007', contract: 'Oloma pipeline', scope: 'Crew boat for offshore pipeline surveillance' },
  { client: 'SPDC', period: '2005 – 2007', contract: 'B-Nag / Oloma pipeline', scope: 'Crew boat and catering for pipeline surveillance' },
  { client: 'SPDC', period: '2007 – 2009', contract: 'Krakama location', scope: 'Accommodation vessel' },
  { client: 'SPDC', period: '2007 – 2009', contract: 'Cawthorne Channel', scope: 'Houseboat and catering for pipeline surveillance' },
  { client: 'SPDC', period: '2008 – 2010', contract: 'Cawthorne Channel flow station', scope: 'Crew boat and accommodation barge' },
  { client: 'SPDC', period: '2008 – 2010', contract: 'Krakama flow station', scope: 'Crew boat, accommodation barge and catering' },
  { client: 'SPDC', period: '2017 – 2019', contract: 'Pipeline maintenance, Patrick Waterside', scope: 'Full marine logistics spread' },
  { client: 'SPDC', period: '2018 – 2019', contract: 'Dredging, Tunu Well 3 / Kanbo', scope: 'Full marine logistics spread' },
  { client: 'SPDC', period: '2018 – 2019', contract: 'Dredging, Tunu Well 5', scope: 'Full marine logistics spread' },
  { client: 'SPDC', period: '2018 –', contract: 'Wellhead maintenance & wireline, Soku', scope: 'Full marine logistics spread' },
  { client: 'SPDC', period: '2018 –', contract: 'Wellhead maintenance, Odimodi / Ogbotobo', scope: 'Full marine logistics spread' },
  { client: 'SPDC', period: '2019 – 2021', contract: 'Dodo North field security support', scope: 'Full marine logistics spread' },
  { client: 'Eroton E&P', period: '2018 –', contract: 'Akaso field workover, Cawthorne Channel', scope: 'Houseboat, tugboat and ancillary services' },
  { client: 'Eroton E&P', period: '2018 –', contract: 'Akaso field workover, Cawthorne Channel', scope: 'Tugboat fuel and security service' },
] as const;

/** What "full marine logistics spread" means in the profile's contract table. */
export const LOGISTICS_SPREAD =
  'Houseboats, tugboats, crew boats, catering, diesel (AGO), potable water, waste disposal and security escort';

/** Operating credentials the profile names, beyond the accreditations above. */
export const CREDENTIALS = [
  { headline: 'NSCDC licence', detail: 'Private Guard Maritime Company · NSCDC/PG/015/000697' },
  { headline: 'Marine insurance', detail: 'Hull, public liability and group life · Cornerstone Insurance Plc' },
  { headline: 'Staff health cover', detail: 'Staff, spouses and up to four children · Wellness Health Management Services' },
  { headline: 'Offshore catering', detail: 'Delivered with Courdeau Catering' },
] as const;

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
   OPEN QUESTIONS for the client. The 2019 business profile disagrees with
   the site on these points; the site values are kept until confirmed:

   - Port Harcourt address: profile gives 36D Herbert Macauley Street, Amadi
     Flats, Old GRA; site gives 41 Herbert Macauley Street.
   - Houston address: profile gives 19830 F.M. 1093, Suite 601, Richmond TX
     77407; site gives 3317 McCulloch Circle, Houston TX 77056.
   - Email: profile gives enquiries@gasstocksltd.com; site uses
     info@gasstocksinc.org.
   - The profile also lists cellular 0703 409 0947 and 0805 281 2645.
   - Leadership: profile says "Managing Director" with an MBA and an MSc in
     Project Management, both from Queen Mary University of London. The site
     says CEO, MBA from the University of Benin, MSc from Queen Mary.
   - Profile contracts start in 2004 but business "commenced" in 2008.
   - The DP3 vessel spec (ROV, 40 t crane, helideck, 140 persons) is garbled in
     the profile across two rows (DP3 / Gunboats); read here as the DP3's.
   - NNPC, Ardova and Ronish logos come from the previous site, not the profile.

   RESOLVED: fabricated hero stats (184 projects, 14 countries, 9
   accreditations), equipment-rail fleet figures, and the design-code and
   tonnage spec strips in the 3D journey have been replaced with profile facts.
   ───────────────────────────────────────────────────────────────────────── */
