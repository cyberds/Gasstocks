'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { COMPANY, DISPLAY, links } from '../lib/company';

/* The site assistant.
 *
 * Answers come from app/api/chat as newline-delimited JSON, so text can render
 * as it arrives rather than after a multi-second wait.
 *
 * ACTION BUTTONS: the model emits literal [[ACTION:email|whatsapp|call]]
 * markers, which are stripped here and rendered as real buttons wired to
 * lib/company.ts. Markers rather than structured output or function calling,
 * because the web-search pass cannot combine google_search with either — the
 * marker approach works identically on both passes.
 */

const ACTION_RE = /\[\[ACTION:(email|whatsapp|call)\]\]/gi;

type Msg = {
  role: 'user' | 'model';
  text: string;
  /** Set while the web-search pass is running. */
  searching?: boolean;
  grounded?: boolean;
  error?: boolean;
};

const GREETING =
  'Hello — I can answer questions about what Gasstocks does, where we operate, our fleet and our certifications. What would you like to know?';

const SUGGESTIONS = [
  'What services do you offer?',
  'What certifications do you hold?',
  'Where are your offices?',
  'Can I hire equipment without operators?',
];

function splitActions(text: string): { body: string; actions: string[] } {
  const actions: string[] = [];
  const body = text.replace(ACTION_RE, (_, a: string) => {
    const k = a.toLowerCase();
    if (!actions.includes(k)) actions.push(k);
    return '';
  });
  return { body: body.replace(/\n{3,}/g, '\n\n').trim(), actions };
}

function ActionButtons({ actions, question }: { actions: string[]; question: string }) {
  if (!actions.length) return null;
  const context = `Hello Gasstocks — I was on your website and asked: "${question}"`;
  const map: Record<string, { label: string; href: string }> = {
    email: {
      label: 'Email us',
      href: links.mailto('Website enquiry', `${context}\n\n`),
    },
    whatsapp: { label: 'WhatsApp', href: links.whatsapp(context) },
    call: { label: `Call ${DISPLAY.phoneNigeria}`, href: links.tel('nigeria') },
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
      {actions.map((a) => {
        const m = map[a];
        if (!m) return null;
        return (
          <a
            key={a}
            className="btn btn-primary"
            href={m.href}
            target={a === 'whatsapp' ? '_blank' : undefined}
            rel={a === 'whatsapp' ? 'noopener noreferrer' : undefined}
            style={{ textDecoration: 'none', padding: '8px 14px', fontSize: '13px' }}
          >
            {m.label}
          </a>
        );
      })}
    </div>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'model', text: GREETING }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const lastQuestion = useRef('');

  // Follow the stream, but never yank a reader who has scrolled up.
  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes and returns focus to the launcher.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const send = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || busy) return;
      lastQuestion.current = q;
      setInput('');
      setBusy(true);

      // Only completed exchanges go back as history; the greeting is ours.
      const history = msgs
        .filter((m) => !m.error && m.text !== GREETING)
        .slice(-8)
        .map((m) => ({ role: m.role, text: m.text }));

      setMsgs((prev) => [...prev, { role: 'user', text: q }, { role: 'model', text: '' }]);

      const patch = (fn: (m: Msg) => Msg) =>
        setMsgs((prev) => prev.map((m, i) => (i === prev.length - 1 ? fn(m) : m)));

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: q, history }),
        });

        if (!res.ok || !res.body) {
          const body = await res.json().catch(() => ({}));
          patch(() => ({
            role: 'model',
            error: true,
            text: body.error ?? `Something went wrong. Please email ${COMPANY.email}.`,
          }));
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });

          let nl: number;
          while ((nl = buf.indexOf('\n')) !== -1) {
            const line = buf.slice(0, nl).trim();
            buf = buf.slice(nl + 1);
            if (!line) continue;

            let evt: {
              text?: string;
              searching?: boolean;
              grounded?: boolean;
              error?: string;
              done?: boolean;
            };
            try {
              evt = JSON.parse(line);
            } catch {
              continue;
            }

            if (evt.error) patch(() => ({ role: 'model', text: evt.error!, error: true }));
            else if (evt.searching) patch((m) => ({ ...m, searching: true, text: '' }));
            else if (evt.grounded) patch((m) => ({ ...m, searching: false, grounded: true }));
            else if (evt.text) patch((m) => ({ ...m, searching: false, text: m.text + evt.text }));
          }
        }
      } catch {
        patch(() => ({
          role: 'model',
          error: true,
          text: `I could not reach the server. Please email ${COMPANY.email}.`,
        }));
      } finally {
        setBusy(false);
        inputRef.current?.focus();
      }
    },
    [busy, msgs],
  );

  return (
    <>
      {/* ── launcher ──────────────────────────────────────────────────────
          Above the fixed header (z-index 60). Sits outside the 3D scroller so
          it never interferes with the scene's scroll capture or the rails'
          touch-action. */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? 'Close the Gasstocks assistant' : 'Ask the Gasstocks assistant'}
        data-gs-chat-launcher=""
        style={{
          position: 'fixed',
          right: 'clamp(14px, 2vw, 24px)',
          bottom: 'clamp(14px, 2vw, 24px)',
          zIndex: 70,
          display: open ? 'none' : 'block',
          padding: 0,
          border: 0,
          background: 'transparent',
          cursor: 'pointer',
          lineHeight: 0,
          filter: 'drop-shadow(0 6px 18px rgba(8,16,22,0.28))',
        }}
      >
        {/* Full banner on desktop, mascot alone where it would crowd the screen. */}
        <img
          src="/assets/Gasstocks-ai-chat-btn.png"
          alt=""
          data-gs-chat-banner=""
          style={{ height: '62px', width: 'auto', display: 'block' }}
        />
        <img
          src="/assets/gasstocks-ai-mascot.png"
          alt=""
          data-gs-chat-mascot=""
          style={{ height: '58px', width: 'auto', display: 'none' }}
        />
      </button>

      {/* ── panel ─────────────────────────────────────────────────────── */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Gasstocks assistant"
          data-gs-chat-panel=""
          style={{
            position: 'fixed',
            right: 'clamp(0px, 2vw, 24px)',
            bottom: 'clamp(0px, 2vw, 24px)',
            zIndex: 70,
            width: 'min(400px, 100vw)',
            height: 'min(600px, calc(100dvh - 100px))',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-divider)',
            boxShadow: '0 18px 50px rgba(8,16,22,0.22)',
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text)',
          }}
        >
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              background: 'var(--color-accent-900)',
              color: 'var(--color-bg)',
              flex: '0 0 auto',
            }}
          >
            <img src="/assets/gasstocks-ai-mascot.png" alt="" style={{ height: '32px', width: 'auto' }} />
            <div style={{ marginRight: 'auto', lineHeight: 1.25 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '15px', letterSpacing: '0.04em' }}>
                Gasstocks assistant
              </div>
              <div style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-bg) 68%,transparent)' }}>
                Usually answers instantly
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
              aria-label="Close the assistant"
              style={{
                border: 0,
                background: 'transparent',
                color: 'inherit',
                fontSize: '22px',
                lineHeight: 1,
                cursor: 'pointer',
                padding: '2px 6px',
              }}
            >
              ×
            </button>
          </header>

          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-atomic="false"
            style={{ flex: '1 1 auto', overflowY: 'auto', padding: '14px', display: 'grid', gap: '12px', alignContent: 'start' }}
          >
            {msgs.map((m, i) => {
              const isUser = m.role === 'user';
              const { body, actions } = isUser ? { body: m.text, actions: [] } : splitActions(m.text);
              const pending = !isUser && !m.text && !m.searching && busy && i === msgs.length - 1;
              return (
                <div key={i} data-gs-msg={m.role} style={{ justifySelf: isUser ? 'end' : 'start', maxWidth: '86%' }}>
                  <div
                    style={{
                      padding: '10px 13px',
                      fontSize: '14px',
                      lineHeight: 1.55,
                      whiteSpace: 'pre-wrap',
                      background: isUser ? 'var(--color-accent-900)' : 'var(--color-surface)',
                      color: isUser ? 'var(--color-bg)' : 'var(--color-text)',
                      border: m.error ? '1px solid #b3261e' : '1px solid var(--color-divider)',
                    }}
                  >
                    {m.searching ? (
                      <span style={{ opacity: 0.75 }}>Searching the web…</span>
                    ) : pending ? (
                      <span style={{ opacity: 0.75 }}>Thinking…</span>
                    ) : (
                      body
                    )}
                  </div>
                  {m.grounded && !m.searching && (
                    <div style={{ fontSize: '10.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 45%,transparent)', marginTop: '5px' }}>
                      Answered using a web search
                    </div>
                  )}
                  {!isUser && <ActionButtons actions={actions} question={lastQuestion.current} />}
                </div>
              );
            })}

            {msgs.length === 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '2px' }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    style={{
                      font: 'inherit',
                      fontSize: '12.5px',
                      padding: '7px 11px',
                      border: '1px solid var(--color-divider)',
                      background: 'transparent',
                      color: 'color-mix(in srgb,var(--color-text) 72%,transparent)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            style={{ flex: '0 0 auto', display: 'flex', gap: '8px', padding: '12px 14px', borderTop: '1px solid var(--color-divider)' }}
          >
            <label htmlFor="gs-chat-input" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
              Your question
            </label>
            <input
              ref={inputRef}
              id="gs-chat-input"
              className="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our services…"
              autoComplete="off"
              maxLength={2000}
              disabled={busy}
              style={{ flex: '1 1 auto', fontSize: '14px' }}
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              style={{ padding: '9px 15px', fontSize: '14px' }}
            >
              {busy ? '…' : 'Send'}
            </button>
          </form>
        </div>
      )}
      <style>{`
        @media (max-width: 600px) {
          [data-gs-chat-panel] {
            top: 72px !important;
            bottom: 12px !important;
            left: 12px !important;
            right: 12px !important;
            width: auto !important;
            height: auto !important;
            max-height: calc(100dvh - 84px) !important;
          }
        }
      `}</style>
    </>
  );
}
