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
        Gasstocks Limited is one of the foremost indigenous company operating in Nigeria&apos;s
        oil and gas Industry with an authorized share capital of N25,000,000. It commenced
        business in the year 2008 and was established to provide quality services to
        Nigeria&apos;s Oil and Gas industry. Gasstocks is managed by a team of highly trained
        Nigerian and foreign professionals, with decades of corporate experience in the global
        financial and energy sectors.
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
          Placeholder copy — to be replaced. We remain focused on functional execution with a
          trained workforce backed by a highly professional management team, and we continually
          raise the bar on the quality, timeliness and value of what we deliver.
        </p>
      </>
    ),
  },
  {
    title: 'Our purpose',
    body: (
      <p>
        Placeholder copy — to be replaced. Our purpose is to connect vessel to shore safely, on
        schedule and to specification, so the clients we serve can operate with confidence in
        every jurisdiction we work.
      </p>
    ),
  },
  {
    title: 'Our values',
    body: (
      <p>
        Placeholder copy — to be replaced. Safety, integrity and accountability govern every
        contract we take on, from the first site survey to final handover.
      </p>
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
