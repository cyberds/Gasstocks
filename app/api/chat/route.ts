import { NextResponse } from 'next/server';
import { z } from 'zod';

import { COMPANY } from '../../../lib/company';
import { NEED_WEB, buildContents, streamGemini, type Usage } from '../../../lib/gemini';
import { clientIp, rateLimit } from '../../../lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  message: z.string().trim().min(1, 'Ask a question').max(2000),
  history: z
    .array(z.object({ role: z.enum(['user', 'model']), text: z.string().max(8000) }))
    .max(20)
    .default([]),
});

/* Long enough to contain the sentinel with room to spare. Pass 1 emits
   NEED_WEB and nothing else, so if the first few characters are not a prefix
   of it, the answer is genuine and can start streaming. */
const PEEK = NEED_WEB.length + 8;

/* What the visitor sees when the document cannot answer and the web pass is
   unavailable. Written here rather than asked of the model, because at this
   point we already know we cannot get a reliable answer — and the action
   markers get turned into real buttons by the client. */
const cannotAnswer = () =>
  "I don't have that detail to hand, and I'd rather not guess. " +
  'The team can answer it properly — would you like to get in touch?\n' +
  '[[ACTION:email]]\n[[ACTION:whatsapp]]\n[[ACTION:call]]';

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`chat:${ip}`, 20);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'You have sent a lot of messages. Please try again in a few minutes.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }
  const { message, history } = parsed.data;

  if (!process.env.GEMINI_API_KEY) {
    console.error('[chat] GEMINI_API_KEY is not set');
    return NextResponse.json(
      { error: `The assistant is not available right now. Please email ${COMPANY.email}.` },
      { status: 503 },
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));

      const logUsage = (pass: string, u: Usage) => {
        /* cached > 0 is the proof that prefix caching is working. It stays 0
           on a free-tier key, where caching is disabled outright — the prompt
           ordering in lib/gemini.ts starts paying off as soon as the API
           project has billing enabled, with no code change. */
        console.log(
          `[chat] ${pass} tokens prompt=${u.prompt} cached=${u.cached} output=${u.output}` +
            (u.cached > 0 ? ` (cache hit: ${Math.round((u.cached / u.prompt) * 100)}% of prompt)` : ''),
        );
      };

      try {
        // ── pass 1: the document, no tools, cacheable prefix ──────────────
        const contents = buildContents(history, message);
        let head = '';
        let decided: 'answer' | 'web' | null = null;

        for await (const part of streamGemini(contents, { search: false })) {
          if (part.usage) {
            logUsage('pass1', part.usage);
            continue;
          }
          if (!part.text) continue;

          if (decided === null) {
            head += part.text;
            const trimmed = head.trimStart();
            // Still ambiguous: what we have so far could still become NEED_WEB.
            if (trimmed.length < PEEK && NEED_WEB.startsWith(trimmed.slice(0, NEED_WEB.length))) {
              continue;
            }
            decided = trimmed.startsWith(NEED_WEB) ? 'web' : 'answer';
            if (decided === 'web') break;
            send({ text: head });
            continue;
          }
          send({ text: part.text });
        }

        // Stream ended while still ambiguous — flush whatever we held back.
        if (decided === null) {
          const trimmed = head.trimStart();
          if (trimmed.startsWith(NEED_WEB)) decided = 'web';
          else {
            decided = 'answer';
            if (head) send({ text: head });
          }
        }

        // ── pass 2: only when the document fell short ─────────────────────
        if (decided === 'web') {
          send({ searching: true });
          try {
            let got = '';
            for await (const part of streamGemini(contents, { search: true })) {
              if (part.usage) logUsage('pass2(web)', part.usage);
              else if (part.text) {
                got += part.text;
                send({ text: part.text });
              }
            }
            if (got.trim()) send({ grounded: true });
            else send({ searching: false, text: cannotAnswer() });
          } catch (err) {
            /* Grounded search has its own quota, separate from ordinary
               generation, and it is the first thing to run out on a free-tier
               key. A visitor who asked a reasonable question should not be
               shown a hard error because of that — fall back to the honest
               answer plus a way to reach a person. */
            console.error('[chat] web pass failed, degrading gracefully', err);
            send({ searching: false, text: cannotAnswer() });
          }
        }

        send({ done: true });
      } catch (err) {
        console.error('[chat] failed', err);
        send({
          error: `Sorry — I could not answer that just now. Please email ${COMPANY.email} and the team will pick it up.`,
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}
