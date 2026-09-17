/* The service catalogue — the single source of truth for what Gasstocks does.
 *
 * Read by components/Capability.tsx (the register on the page) and by
 * tools/sync-company-doc.mjs, which regenerates the services block of
 * content/company.md. Keeping one authoritative list is the point: if the page
 * and the chatbot's knowledge document drift apart, the bot ends up
 * contradicting the page the visitor is looking at.
 *
 * PROVENANCE: assembled from the company profile supplied by the client and
 * from the previous Gasstocks website / marketing material, which the client
 * has confirmed reflects genuine offerings. Do not add a service here that the
 * company cannot actually deliver — this list feeds a tender-facing site and,
 * from Phase 3, an assistant that will assert it to strangers.
 *
 * NAMING RULE (set by the client): the `name` is what visitors read, so it must
 * be a concrete service someone would recognise and search for — never an
 * internal category or an abstraction. The `group` is the quiet layer: it
 * exists to filter, sort and label, and should never be the first thing
 * competing for attention.
 */

export const GROUPS = [
  'Marine & vessels',
  'Engineering & construction',
  'Instrumentation & asset integrity',
  'Supply & equipment',
] as const;

export type Group = (typeof GROUPS)[number];

export type Service = {
  /** Stable slug — safe for anchors, filters and analytics. Never re-use one. */
  id: string;
  /** What the visitor reads. Concrete and recognisable. */
  name: string;
  /** One line, plain language, for the register and the chatbot. */
  covers: string;
  group: Group;
  /** True where the service appears among the nine 3D-journey labels. */
  flagship?: boolean;
};

export const SERVICES: Service[] = [
  // ── Marine & vessels ────────────────────────────────────────────────────
  {
    id: 'marine-logistics',
    name: 'Marine logistics',
    covers:
      'Planning and coordination of cargo, crew and materials movement across ports, jetties, swamp and offshore locations.',
    group: 'Marine & vessels',
    flagship: true,
  },
  {
    id: 'vessel-charter',
    name: 'Vessel chartering & management',
    covers:
      'AHTSVs, PSVs, crew boats, tugs and houseboats on bare or crewed charter, with full technical and crew management.',
    group: 'Marine & vessels',
    flagship: true,
  },
  {
    id: 'offshore-support',
    name: 'Offshore supply & support',
    covers:
      'Supply runs, crew transfer, standby and field support for offshore installations and drilling campaigns.',
    group: 'Marine & vessels',
    flagship: true,
  },
  {
    id: 'marine-transportation',
    name: 'Marine transportation',
    covers:
      'Movement of cargo, equipment and petroleum products by sea and inland waterways on time and voyage charter.',
    group: 'Marine & vessels',
    flagship: true,
  },
  {
    id: 'barge-workboat',
    name: 'Barge & workboat operations',
    covers:
      'Flat-top, spud-leg and crane barges with tugs and workboats for towage, mooring and marine works.',
    group: 'Marine & vessels',
    flagship: true,
  },
  {
    id: 'marine-procurement',
    name: 'Marine procurement & supply',
    covers:
      'Sourcing and delivery of vessel spares, consumables, provisions, fuel and marine equipment.',
    group: 'Marine & vessels',
    flagship: true,
  },
  {
    id: 'vessel-mobilisation',
    name: 'Vessel mobilisation & demobilisation',
    covers:
      'Preparing vessels to join or leave a campaign — surveys, certification, insurance and transit to or from location.',
    group: 'Marine & vessels',
    flagship: true,
  },
  {
    id: 'offshore-project-logistics',
    name: 'Offshore project logistics',
    covers:
      'End-to-end logistics for offshore construction and installation projects, including heavy-lift and out-of-gauge cargo.',
    group: 'Marine & vessels',
    flagship: true,
  },
  {
    id: 'fleet-management',
    name: 'Fleet management',
    covers:
      'Maintenance planning, crewing, compliance and performance monitoring across multi-vessel fleets.',
    group: 'Marine & vessels',
    flagship: true,
  },

  // ── Engineering & construction ──────────────────────────────────────────
  {
    id: 'pipelines',
    name: 'Pipeline & flowline construction',
    covers:
      'Construction of pipelines and flowlines, and modification of gas flowlines on producing facilities.',
    group: 'Engineering & construction',
  },
  {
    id: 'jetty-construction',
    name: 'Jetty & marine construction',
    covers:
      'Piled jetties, berthing and mooring dolphins, quay walls, loading platforms and marine repairs.',
    group: 'Engineering & construction',
    flagship: true,
  },
  {
    id: 'dredging',
    name: 'Dredging & land reclamation',
    covers:
      'Capital and maintenance dredging, land reclamation, shoreline protection and bathymetric survey.',
    group: 'Engineering & construction',
    flagship: true,
  },
  {
    id: 'roads',
    name: 'Roads & earthworks',
    covers:
      'Highways, terminal access roads, drainage, culverts and bridge approaches.',
    group: 'Engineering & construction',
    flagship: true,
  },
  {
    id: 'civil-structural',
    name: 'Civil & structural engineering',
    covers:
      'Tank farms, process buildings, bunds, deep foundations and structural steel erection.',
    group: 'Engineering & construction',
    flagship: true,
  },
  {
    id: 'fabrication',
    name: 'Steel fabrication & boatbuilding',
    covers:
      'Fabrication of steel structures and pressure vessels, and construction of barges, houseboats and shallow-water crew boats.',
    group: 'Engineering & construction',
  },
  {
    id: 'epcm',
    name: 'Engineering design & project management',
    covers:
      'Bespoke engineering design, EPCM delivery, and technical sales and support engineering.',
    group: 'Engineering & construction',
  },

  // ── Instrumentation & asset integrity ───────────────────────────────────
  {
    id: 'instrumentation',
    name: 'Instrumentation & control systems',
    covers:
      'Procurement, supply, installation and commissioning of analytical, control and safety systems.',
    group: 'Instrumentation & asset integrity',
  },
  {
    id: 'metering',
    name: 'Fiscal metering & flow measurement',
    covers:
      'Supply, installation and commissioning of fiscal metering and flow measurement systems.',
    group: 'Instrumentation & asset integrity',
  },
  {
    id: 'calibration',
    name: 'Calibration & certification',
    covers:
      'NUPRC-compliant calibration and certification of measurement systems, with technical manpower outsourcing.',
    group: 'Instrumentation & asset integrity',
  },
  {
    id: 'asset-integrity',
    name: 'Plant maintenance & facility upgrades',
    covers:
      'Maintenance of pipelines, storage facilities and heat exchangers, plus environmental and safety upgrades to crude production facilities.',
    group: 'Instrumentation & asset integrity',
  },

  // ── Supply & equipment ──────────────────────────────────────────────────
  {
    id: 'plant-hire',
    name: 'Equipment & plant hire',
    covers:
      'Bare or operated hire of excavators, dozers, tippers, rollers, cranes and forklifts, plus barges, pontoons, tugs and workboats — with maintenance, fuel and operators on request.',
    group: 'Supply & equipment',
    flagship: true,
  },
  {
    id: 'oilfield-supply',
    name: 'Oilfield equipment & materials',
    covers:
      'Wellheads, line pipe, fittings, tubing, connectors, seal rings, valves and umbilical hoses; pumps, heat exchangers, plates, beams and gratings; and instrumentation components.',
    group: 'Supply & equipment',
  },
  {
    id: 'gases',
    name: 'LPG, industrial gases & oilfield chemicals',
    covers: 'Bulk supply and distribution of LPG, industrial gases and specialised oilfield chemicals.',
    group: 'Supply & equipment',
  },
  {
    id: 'manpower',
    name: 'Technical manpower & land logistics',
    covers:
      'Control and automation specialists, general technical manpower, and land logistics and haulage.',
    group: 'Supply & equipment',
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
