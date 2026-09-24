'use client';

import { useState, type ReactNode } from 'react';

/* About accordion — port of web/js/accordion.js.

   Items toggle independently (not exclusive: more than one section can stay
   open, matching the reference). Height animates via the 0fr/1fr
   grid-template-rows transition in styles/site.css, so there is no JS
   measuring and no jump when content or viewport width changes — the panel
   always stays in the DOM.

   The original wired itself up at script-eval time against [data-gs-acc-item],
   which in the App Router runs before React renders these items and so found
   nothing. State replaces the DOM-attribute toggling; the markup, classes and
   ARIA wiring are unchanged. */

type Item = {
  title: string;
  body: ReactNode;
  /** Only the first item ships open, as in the reference. */
  open?: boolean;
};

// Copy follows the Gasstocks business profile (Who are we, What we want to
// become, Our purpose, Our competitive advantage).
const ITEMS: Item[] = [
  {
    title: 'Who we are',
    open: true,
    body: (
      <p>
        Gasstocks Limited is an indigenous company in Nigeria&apos;s oil and gas industry. We
        commenced business in 2008 and are managed by Nigerian and foreign professionals with
        decades of experience in the global financial and energy sectors. We provide marine,
        transportation and logistics, instrumentation and control automation, engineering and
        procurement services to clients onshore and offshore, under permits from the industry&apos;s
        regulatory agencies.
      </p>
    ),
  },
  {
    title: 'What we want to become',
    body: (
      <>
        <p className="gs-acc-lede">
          To be the leading service provider of first choice in our market segment.
        </p>
        <p>
          We pair a trained workforce with a professional management team, and bring current
          technology, timely execution and competitive prices to every project. Our network of
          partners across the global supply chain, from Houston and London to China, India and
          Hong Kong, is what makes us the preferred choice.
        </p>
      </>
    ),
  },
  {
    title: 'Our purpose',
    body: (
      <>
        <p>
          To provide optimised, professional and efficient services that maximise returns on our
          clients&apos; operations, while remaining economically sustainable and socially responsible.
        </p>
        <p>
          We are consistent in our commitment to our stakeholders, whether that is the client, the
          communities in which we operate, or our employees. We support the government&apos;s local
          content policy, protect the environment as part of our sustainability strategy, and keep
          community relations strong enough to move easily through difficult terrain.
        </p>
      </>
    ),
  },
  {
    title: 'What sets us apart',
    body: (
      <>
        <p>
          <b>Structure and discipline</b>: resources in the right place at the right time, and bank facilities always repaid without requests for waivers.
        </p>
        <p>
          <b>Maintenance culture</b>: every unit in our equipment pool is kept in top shape, with a short turnaround on client feedback.
        </p>
        <p>
          <b>Lean delivery</b>: a lean management approach that consistently lowers project cost for our clients.
        </p>
        <p>
          <b>Security built in</b>: a licensed Private Guard Maritime Company (NSCDC/PG/015/000697), with Navy and Army gunboats available at short notice.
        </p>
        <p>
          <b>Covered and connected</b>: GPS-tracked vessels insured by Cornerstone Insurance Plc, and health cover for every staff member and their family.
        </p>
      </>
    ),
  },
];

export default function AboutAccordion() {
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(ITEMS.flatMap((it, i) => (it.open ? [i] : []))),
  );

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set<number>();
      if (!prev.has(i)) next.add(i);
      return next;
    });

  return (
    <section id="about" className="gs-about" aria-label="About Gasstocks">
      <div className="gs-about-inner">
        <div className="gs-about-head">
          <div className="gs-about-kicker">About Gasstocks</div>
          <h2>Who we are.</h2>
        </div>

        {ITEMS.map((item, i) => {
          const isOpen = open.has(i);
          const triggerId = `gs-acc-trigger-${i + 1}`;
          const panelId = `gs-acc-panel-${i + 1}`;
          return (
            <div
              key={item.title}
              className="gs-acc-item"
              data-gs-acc-item=""
              {...(isOpen ? { 'data-open': '' } : {})}
              onMouseEnter={() => setOpen(new Set([i]))}
            >
              <h3 style={{ margin: '0' }}>
                <button
                  className="gs-acc-trigger"
                  data-gs-acc-trigger=""
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  id={triggerId}
                  onClick={() => toggle(i)}
                  onFocus={() => setOpen(new Set([i]))}
                >
                  <span className="gs-acc-title">{item.title}</span>
                  <span className="gs-acc-icon" aria-hidden="true"></span>
                </button>
              </h3>
              <div
                className="gs-acc-panel"
                data-gs-acc-panel=""
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
              >
                <div>
                  <div className="gs-acc-body">{item.body}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
