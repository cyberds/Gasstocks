/* The service catalogue — the single source of truth for what Gasstocks does.
 *
 * Read by components/Capability.tsx (the register on the page), the rails, the
 * /services pages, and tools/sync-company-doc.mjs, which regenerates the
 * services block of content/company.md. Keeping one authoritative list is the
 * point: if the page and the chatbot's knowledge document drift apart, the bot
 * ends up contradicting the page the visitor is looking at.
 *
 * PROVENANCE: consolidated against the Gasstocks business profile, which
 * lists five service lines — 01 Marine, 02 Mechanical engineering,
 * 03 Instrumentation & control automation, 04 Civil engineering, 05 Other
 * services (procurement, equipment leasing & specialised manpower, bunkering,
 * fresh water & chandelling, marine hospitality, warehousing). Mechanical and
 * civil share one group here. Lines the profile does not mention but the
 * client confirmed from the previous website (dredging, vessel management,
 * LPG & industrial gases) are kept and marked `legacy` below.
 *
 * NAMING RULE (set by the client): the `name` is what visitors read, so it must
 * be a concrete service someone would recognise and search for — never an
 * internal category or an abstraction. The `group` is the quiet layer.
 */

export const GROUPS = [
  'Marine & logistics',
  'Mechanical & civil engineering',
  'Instrumentation & control automation',
  'Procurement, leasing & manpower',
] as const;

export type Group = (typeof GROUPS)[number];

/** Per-group page content. `slug` is the /services/<slug> URL — never change one. */
export const GROUP_INFO: Record<
  Group,
  { slug: string; short: string; image: string; intro: string; description: string; highlight: { title: string; body: string; cta: string } }
> = {
  'Marine & logistics': {
    slug: 'marine-vessels',
    short: 'MARINE',
    image: '/assets/portfolio/2/IMG-20260618-WA0011.jpg',
    intro:
      'Gasstocks owns several classes of marine vessels and works with key vessel owners, so houseboats, tugs, crew boats, barges and security vessels can be on location at short notice — for swamp, shallow-water and deep offshore operations.',
    description:
      'Swamp and deep offshore logistics, vessel supply, armed security escort, bunkering, fresh water, chandelling and offshore catering.',
    highlight: {
      title: 'Licensed for maritime security',
      body: 'Gasstocks is licensed as a Private Guard Maritime Company (NSCDC/PG/015/000697), so Government security agencies can mount on our designated vessels. Gunboats manned by the Nigerian Navy and Army are available at short notice.',
      cta: 'Request a vessel quote',
    },
  },
  'Mechanical & civil engineering': {
    slug: 'engineering-construction',
    short: 'ENGINEERING',
    image: '/assets/portfolio/1/IMG-20260618-WA0025.jpg',
    intro:
      'Pipelines and flowlines, subsea equipment installation, fabrication, piling, jetties, roads and bridges — designed and delivered to timeline and budget, with sister companies for civil works.',
    description:
      'Pipelines and flowlines, subsea installation, fabrication of pressure vessels and boats, piling, jetties, roads, bridges and dredging.',
    highlight: {
      title: 'Led by 41 years of project delivery',
      body: 'Our technical management team is led by an expatriate engineer with over 41 years of experience delivering engineering projects, including Nigerdock.',
      cta: 'Request an engineering proposal',
    },
  },
  'Instrumentation & control automation': {
    slug: 'instrumentation-asset-integrity',
    short: 'INSTRUMENTATION',
    image: '/assets/portfolio/2/IMG-20260618-WA0014.jpg',
    intro:
      'Analytical, control, safety and metering systems — procured, supplied, installed, commissioned, calibrated and then maintained, with control and automation specialists available to your team.',
    description:
      'Analytical, control, safety and metering systems; calibration and certification; post-installation maintenance and specialist manpower.',
    highlight: {
      title: 'Calibration and certification',
      body: 'We calibrate and certify measurement systems, and our post-installation maintenance keeps them delivering value after handover.',
      cta: 'Discuss an instrumentation scope',
    },
  },
  'Procurement, leasing & manpower': {
    slug: 'supply-equipment',
    short: 'SUPPLY',
    image: '/assets/portfolio/1/IMG-20260618-WA0028.jpg',
    intro:
      'Piping, wellhead, instrumentation and mechanical materials sourced through logistics bases in Houston, London, Belgium, India, China and Hong Kong; heavy equipment on lease; and the specialists to run it.',
    description:
      'Piping, wellhead and instrumentation procurement, heavy equipment leasing, specialised manpower, warehousing and LPG supply.',
    highlight: {
      title: 'Houston-coordinated procurement',
      body: 'Gasstocks Inc., our Houston subsidiary, coordinates overseas cargo and its logistics, while Port Harcourt and Lagos handle in-country delivery.',
      cta: 'Send a materials list',
    },
  },
};

export type Service = {
  /** Stable slug, safe for anchors, filters and analytics. Never re-use one. */
  id: string;
  /** What the visitor reads. Concrete and recognisable. */
  name: string;
  /** One line, plain language, for the register and the chatbot. */
  covers: string;
  group: Group;
  /** Not in the 2019 profile; confirmed by the client from the previous site. */
  legacy?: boolean;
};

export const SERVICES: Service[] = [
  // ── 01 Marine & logistics ───────────────────────────────────────────────
  {
    id: 'marine-logistics',
    name: 'Swamp & deep offshore logistics',
    covers:
      'Complete marine logistics spreads (houseboats, tugs, crew boats, catering, diesel, potable water, waste disposal and security escort) for pipeline, wellhead and field operations.',
    group: 'Marine & logistics',
  },
  {
    id: 'vessel-charter',
    name: 'Vessel charter & management',
    covers:
      'Owned vessels and fast access to key owners’ fleets: crew boats, tugboats, houseboats, hovercraft, PSVs, AHTS, CSVs and diving support vessels.',
    group: 'Marine & logistics',
  },
  {
    id: 'barge-workboat',
    name: 'Barges & offshore heavy equipment',
    covers:
      'Lay, fuel, ramp, dump and jack-up barges, offshore heavy-duty equipment and crane services.',
    group: 'Marine & logistics',
  },
  {
    id: 'marine-security',
    name: 'Marine security, surveillance & escort',
    covers:
      'Security personnel, pipeline surveillance and armed escort. Licensed Private Guard Maritime Company, with Navy and Army gunboats on call.',
    group: 'Marine & logistics',
  },
  {
    id: 'bunkering',
    name: 'Bunkering, fresh water & chandelling',
    covers:
      'Vessel bunkering, fresh water at sea and in difficult riverine terrain, and ship chandelling, as supplied to SPDC East and West.',
    group: 'Marine & logistics',
  },
  {
    id: 'marine-hospitality',
    name: 'Offshore catering & accommodation',
    covers:
      'Houseboats and accommodation barges with first-class offshore catering, delivered with Courdeau Catering.',
    group: 'Marine & logistics',
  },

  // ── 02 Mechanical & 04 civil engineering ────────────────────────────────
  {
    id: 'pipelines',
    name: 'Pipeline & flowline construction',
    covers:
      'Construction of pipelines and flowlines, modification of gas flowlines, and subsea heavy-duty equipment construction and installation.',
    group: 'Mechanical & civil engineering',
  },
  {
    id: 'fabrication',
    name: 'Steel fabrication & boatbuilding',
    covers:
      'Fabrication of steel structures and pressure vessels, and construction of barges, houseboats and shallow-water crew boats.',
    group: 'Mechanical & civil engineering',
  },
  {
    id: 'asset-integrity',
    name: 'Facility maintenance & upgrades',
    covers:
      'Maintenance of pipelines, storage facilities and heat exchangers, plus environmental and safety upgrades of crude production facilities.',
    group: 'Mechanical & civil engineering',
  },
  {
    id: 'epcm',
    name: 'Engineering design & project management',
    covers:
      'Bespoke engineering design, project management, technical sales and support engineering for project-based procurement.',
    group: 'Mechanical & civil engineering',
  },
  {
    id: 'piling',
    name: 'Piling & foundations',
    covers: 'Design and execution of piling projects with our sister companies.',
    group: 'Mechanical & civil engineering',
  },
  {
    id: 'jetty-construction',
    name: 'Jetty construction',
    covers: 'Design and construction of jetties, delivered to timeline and budget.',
    group: 'Mechanical & civil engineering',
  },
  {
    id: 'roads',
    name: 'Roads & bridges',
    covers: 'Design and construction of roads and bridges, including access routes to riverine and terminal sites.',
    group: 'Mechanical & civil engineering',
  },
  {
    id: 'dredging',
    name: 'Dredging & land reclamation',
    covers:
      'Dredging and reclamation works, and the marine support spread around them, as delivered for SPDC at Tunu Wells 3 and 5.',
    group: 'Mechanical & civil engineering',
    legacy: true,
  },

  // ── 03 Instrumentation & control automation ────────────────────────────
  {
    id: 'instrumentation',
    name: 'Control & safety systems',
    covers:
      'Procurement, supply, installation and commissioning of analytical, control and safety systems.',
    group: 'Instrumentation & control automation',
  },
  {
    id: 'metering',
    name: 'Metering systems',
    covers: 'Supply, installation and commissioning of metering and measurement systems.',
    group: 'Instrumentation & control automation',
  },
  {
    id: 'calibration',
    name: 'Calibration & certification',
    covers: 'Calibration and certification of measurement systems.',
    group: 'Instrumentation & control automation',
  },
  {
    id: 'instrument-maintenance',
    name: 'Post-installation maintenance',
    covers: 'Maintenance and sustenance of installed systems so they keep delivering value after commissioning.',
    group: 'Instrumentation & control automation',
  },
  {
    id: 'automation-manpower',
    name: 'Control & automation specialists',
    covers: 'Control and automation specialist manpower for oil and gas operators in Nigeria.',
    group: 'Instrumentation & control automation',
  },

  // ── 05 Procurement, leasing & manpower ─────────────────────────────────
  {
    id: 'oilfield-supply',
    name: 'Piping, wellhead & mechanical procurement',
    covers:
      'Line pipe, fittings, tubing, connectors, seal rings, valves, Christmas trees, choke and shut-off valves, umbilical hoses; manifold parts; heat exchangers, pumps, plates, beams and gratings.',
    group: 'Procurement, leasing & manpower',
  },
  {
    id: 'instrument-supply',
    name: 'Instrumentation supply',
    covers: 'Actuators, control panels, pressure gauges and transmitters, testers, analysers and instrumentation valves.',
    group: 'Procurement, leasing & manpower',
  },
  {
    id: 'plant-hire',
    name: 'Heavy equipment leasing',
    covers:
      'Heavy-duty marine and engineering construction equipment for land, swamp and deep offshore: ROVs, cranes from 30 t to 80 t, and everything from swamp buggies to production platforms.',
    group: 'Procurement, leasing & manpower',
  },
  {
    id: 'manpower',
    name: 'Specialised manpower',
    covers: 'Crews to operate leased equipment, and engineers and technicians to fill expert gaps on your project.',
    group: 'Procurement, leasing & manpower',
  },
  {
    id: 'warehousing',
    name: 'Warehousing',
    covers: 'Permitted warehousing to support procurement and in-country logistics.',
    group: 'Procurement, leasing & manpower',
  },
  {
    id: 'gases',
    name: 'LPG & industrial gases',
    covers: 'Supply and distribution of LPG and industrial gases.',
    group: 'Procurement, leasing & manpower',
    legacy: true,
  },
];

/** Services in a group, in catalogue order. */
export function servicesInGroup(group: Group): Service[] {
  return SERVICES.filter((s) => s.group === group);
}

/** Group → count, for the filter chips. */
export function groupCounts(): Record<Group, number> {
  return Object.fromEntries(GROUPS.map((g) => [g, servicesInGroup(g).length])) as Record<
    Group,
    number
  >;
}

/** The group whose page lives at /services/<slug>. */
export function groupBySlug(slug: string): Group | undefined {
  return GROUPS.find((g) => GROUP_INFO[g].slug === slug);
}
