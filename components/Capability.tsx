'use client';

import { useMemo, useState } from 'react';

import { GROUPS, SERVICES, type Group } from '../lib/services';

/* The capability register — every service Gasstocks offers.
 *
 * There are twenty, which is a wall of text if you present it as one flat
 * table, so the register is grouped and filterable: "All" renders four labelled
 * blocks rather than twenty undifferentiated rows, and a visitor who only cares
 * about instrumentation can get to four rows in one click.
 *
 * The categories are deliberately the quiet layer. They filter, sort and label;
 * the service names are what people actually read. That is why the filter chips
 * are small and the group headings sit inside the table as section rules rather
 * than as competing headlines.
 *
 * Two columns from the original are gone on purpose:
 *   - "Standard" carried per-service claims (IADC, BS 6349, Eurocode, AASHTO,
 *     ISO 55001) that sat in exactly the same unevidenced category as the
 *     certifications we removed from the Assurance section. It now carries the
 *     category instead, which is also how the grouping gets mentioned without
 *     shouting.
 *   - "Key plant" had no data for eleven of the twenty services, so it would
 *     have been blank more often than filled. Representative plant is folded
 *     into the scope text where it is known.
 */

type Filter = 'all' | Group;

const chipBase = {
  font: 'inherit',
  fontSize: '12px',
  letterSpacing: '0.04em',
  padding: '7px 13px',
  border: '1px solid var(--color-divider)',
  background: 'transparent',
  color: 'color-mix(in srgb,var(--color-text) 70%,transparent)',
  cursor: 'pointer',
  whiteSpace: 'nowrap' as const,
};

const chipOn = {
  ...chipBase,
  background: 'var(--color-accent-900)',
  borderColor: 'var(--color-accent-900)',
  color: 'var(--color-bg)',
};

export default function Capability() {
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(() => {
    const c = {} as Record<Group, number>;
    for (const g of GROUPS) c[g] = SERVICES.filter((s) => s.group === g).length;
    return c;
  }, []);

  /* Which groups to render, and which services inside each. Filtering by group
     rather than flattening keeps the numbering and the section rules coherent
     in both states. */
  const visibleGroups = filter === 'all' ? GROUPS : GROUPS.filter((g) => g === filter);
  const total = filter === 'all' ? SERVICES.length : counts[filter];

  // Register numbers run across the whole catalogue, so 13 is always 13
  // whichever filter is on.
  const numberOf = new Map(SERVICES.map((s, i) => [s.id, String(i + 1).padStart(2, '0')]));

  return (
    <section
      id="capability"
      style={{ padding: '104px 32px 96px', borderTop: '1px solid var(--color-divider)' }}
    >
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '32px',
            marginBottom: '28px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '10.5px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-accent-700)',
                marginBottom: '10px',
              }}
            >
              Capability register
            </div>
            <h2 style={{ fontSize: '46px', lineHeight: '1.02', margin: '0', maxWidth: '20ch' }}>
              Everything we do, set out for prequalification.
            </h2>
          </div>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              maxWidth: '38ch',
              margin: '0',
              color: 'color-mix(in srgb,var(--color-text) 65%,transparent)',
              textWrap: 'pretty',
            }}
          >
            Twenty services across marine, engineering, instrumentation and supply — delivered with
            owned assets and directly employed supervision. Asset registers and method statements
            are issued with the prequalification pack.
          </p>
        </div>

        {/* Filter chips. A toolbar of toggle buttons rather than tabs: there is
            no tab panel here, just one table that narrows. */}
        <div
          role="group"
          aria-label="Filter services by category"
          style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '22px' }}
        >
          <button
            type="button"
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
            style={filter === 'all' ? chipOn : chipBase}
          >
            All services{' '}
            <span style={{ opacity: 0.6, fontFamily: 'ui-monospace,Menlo,monospace' }}>
              {SERVICES.length}
            </span>
          </button>
          {GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setFilter(g)}
              aria-pressed={filter === g}
              style={filter === g ? chipOn : chipBase}
            >
              {g}{' '}
              <span style={{ opacity: 0.6, fontFamily: 'ui-monospace,Menlo,monospace' }}>
                {counts[g]}
              </span>
            </button>
          ))}
        </div>

        {/* Announce the change to screen readers, which otherwise get no signal
            that the table beneath them just shrank. */}
        {/* Visually hidden, same technique the rails use for their live region
            (see components/ShowcaseRail.tsx) — there is no .sr-only utility in
            the design system. */}
        <div
          aria-live="polite"
          data-gs-register-live=""
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
          }}
        >
          {`Showing ${total} of ${SERVICES.length} services`}
        </div>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="table" style={{ fontSize: '14px', minWidth: '760px' }}>
            <thead>
              <tr>
                <th style={{ width: '52px' }}>No.</th>
                <th style={{ width: '26%' }}>Service</th>
                <th>What it covers</th>
                <th style={{ width: '20%' }}>Category</th>
              </tr>
            </thead>
            {visibleGroups.map((group) => {
              const rows = SERVICES.filter((s) => s.group === group);
              return (
                <tbody key={group} data-gs-group={group}>
                  {/* Section rule. Only earns its place when more than one
                      group is on screen; filtered to one, the chip already
                      says which. */}
                  {filter === 'all' && (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          paddingTop: '26px',
                          paddingBottom: '8px',
                          borderBottom: '1px solid var(--color-divider)',
                          fontSize: '10.5px',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: 'var(--color-accent-700)',
                        }}
                      >
                        {group}
                      </td>
                    </tr>
                  )}
                  {rows.map((s) => (
                    <tr key={s.id} data-gs-service={s.id}>
                      <td
                        style={{
                          fontFamily: 'ui-monospace,Menlo,monospace',
                          fontSize: '12px',
                          color: 'var(--color-accent-700)',
                        }}
                      >
                        {numberOf.get(s.id)}
                      </td>
                      <td
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: '600',
                          fontSize: '16px',
                        }}
                      >
                        {s.name}
                      </td>
                      <td>{s.covers}</td>
                      <td>
                        <span className="tag tag-accent">{s.group}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              );
            })}
          </table>
        </div>
      </div>
    </section>
  );
}
