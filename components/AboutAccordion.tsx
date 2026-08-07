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

// Only "Who we are?" has real copy. The other three are filler awaiting real
// text — swap the body here when it's ready, no other change needed.
const ITEMS: Item[] = [
  {
    title: 'Who we are?',
    open: true,
    body: (
      <p>
        Gasstocks Limited is an indigenous Nigerian support services company focused on delivering
        high-quality, efficient support services to Nigeria&apos;s upstream oil and gas industry.
        Established in 2008, we work alongside operators and project teams to provide dependable
        marine, engineering, instrumentation and supply support that helps keep operations moving
        safely and on schedule.
      </p>
    ),
  },
  {
    title: 'What we want to become',
    body: (
      <>
        <p className="gs-acc-lede">
          To be the first-choice support services partner for Nigeria&apos;s upstream oil and gas
          industry.
        </p>
        <p>
          We remain focused on functional execution with a trained workforce backed by a highly
          professional management team, and we continually raise the bar on the quality,
          timeliness and value of what we deliver.
        </p>
      </>
    ),
  },
  {
    title: 'Our purpose',
    body: (
      <>
        <p>
          To deliver high-quality, efficient support services to Nigeria&apos;s upstream oil and gas
          industry, while remaining economically sustainable and socially responsible.
        </p>
        <p>
          We are consistent in our commitment to our stakeholders, whether that is the client, the
          communities in which we operate, or our employees. We remain alert to evolving industry
          needs and continue to strengthen our delivery capability through disciplined execution,
          local capability building and responsible operations.
        </p>
      </>
    ),
  },
  {
    title: 'Our values',
    body: (
      <>
        <p>
          <b>Compliance and accountability</b> — deliver work that meets ISO, NUPRC, NCDMB and industry standards, with transparent, evidence-backed execution.
        </p>
        <p>
          <b>Quality and timeliness</b> — execute contracts to specification and on schedule, with a focus on functional delivery and right-first-time performance.
        </p>
        <p>
          <b>Integrity and professionalism</b> — act with honesty, fairness and respect, and maintain the highest standards of professional conduct.
        </p>
        <p>
          <b>Safety and sustainability</b> — protect people, assets and the environment, and operate in a way that is socially responsible and economically sustainable.
        </p>
        <p>
          <b>Local capability and sustainability</b> — build local workforce capacity, support knowledge transfer, and offer solutions that are economically sustainable and socially responsible.
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
