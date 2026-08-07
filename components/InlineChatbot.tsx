'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { COMPANY, DISPLAY, links } from '../lib/company';

const ACTION_RE = /\[\[ACTION:(email|whatsapp|call)\]\]/gi;

type Msg = {
  role: 'user' | 'model';
  text: string;
  searching?: boolean;
  grounded?: boolean;
  error?: boolean;
};

const GREETING = 'I can answer all your questions about Gasstocks or connect you with a rep';

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

export default function InlineChatbot() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'model', text: GREETING }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastQuestion = useRef('');

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  const send = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || busy) return;
      lastQuestion.current = q;
      setInput('');
      setBusy(true);

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
    <section style={{ padding: '60px 32px', background: 'var(--color-surface)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--color-bg)', border: '1px solid var(--color-divider)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '16px 20px',
            background: 'var(--color-accent-900)',
            color: 'var(--color-bg)',
            flex: '0 0 auto',
          }}
        >
          <img src="/assets/gasstocks-ai-mascot.png" alt="" style={{ height: '36px', width: 'auto' }} />
          <div style={{ marginRight: 'auto', lineHeight: 1.25 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '16px', letterSpacing: '0.04em' }}>
              Gasstocks assistant
            </div>
            <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-bg) 68%,transparent)' }}>
              Usually answers instantly
            </div>
          </div>
        </header>

        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          style={{ flex: '1 1 auto', overflowY: 'auto', padding: '24px', display: 'grid', gap: '16px', alignContent: 'start' }}
        >
          {msgs.map((m, i) => {
            const isUser = m.role === 'user';
            const { body, actions } = isUser ? { body: m.text, actions: [] } : splitActions(m.text);
            const pending = !isUser && !m.text && !m.searching && busy && i === msgs.length - 1;
            return (
              <div key={i} data-gs-msg={m.role} style={{ justifySelf: isUser ? 'end' : 'start', maxWidth: '85%' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    fontSize: '15px',
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                    background: isUser ? 'var(--color-accent-900)' : 'var(--color-surface)',
                    color: isUser ? 'var(--color-bg)' : 'var(--color-text)',
                    border: m.error ? '1px solid #b3261e' : '1px solid var(--color-divider)',
                    borderRadius: '8px',
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
                  <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in srgb,var(--color-text) 45%,transparent)', marginTop: '6px' }}>
                    Answered using a web search
                  </div>
                )}
                {!isUser && <ActionButtons actions={actions} question={lastQuestion.current} />}
              </div>
            );
          })}

          {msgs.length === 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  style={{
                    font: 'inherit',
                    fontSize: '13px',
                    padding: '8px 12px',
                    border: '1px solid var(--color-divider)',
                    background: 'transparent',
                    color: 'color-mix(in srgb,var(--color-text) 72%,transparent)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
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
          style={{ flex: '0 0 auto', display: 'flex', gap: '12px', padding: '16px 20px', borderTop: '1px solid var(--color-divider)', background: 'var(--color-surface)' }}
        >
          <label htmlFor="gs-inline-chat-input" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
            Your question
          </label>
          <input
            ref={inputRef}
            id="gs-inline-chat-input"
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            autoComplete="off"
            maxLength={2000}
            disabled={busy}
            style={{ flex: '1 1 auto', fontSize: '15px' }}
          />
          <button
            className="btn btn-primary blueprint"
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send"
            style={{ padding: '10px 20px', fontSize: '15px' }}
          >
            {busy ? '…' : 'Send'}
            <i className="corner tl"></i>
            <i className="corner tr"></i>
            <i className="corner bl"></i>
            <i className="corner br"></i>
          </button>
        </form>
      </div>
    </section>
  );
}
