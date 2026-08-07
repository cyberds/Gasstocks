import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import { COMPANY, DISPLAY } from './company';
import { PORTFOLIOS } from './portfolio';

/* Gemini plumbing for the site assistant. Server-only: importing this from a
 * client component is a build error, which is the cheapest possible guarantee
 * that GEMINI_API_KEY never reaches a browser.
 *
 * Raw fetch rather than the SDK — the surface we need is two endpoints, and
 * this keeps streaming and usage metadata entirely under our control.
 */

const BASE = 'https://generativelanguage.googleapis.com/v1beta';

export const MODEL = process.env.GEMINI_MODEL ?? 'gemini-3.5-flash-lite';

/** Emitted by pass 1 when the document cannot answer; triggers the web pass. */
export const NEED_WEB = 'NEED_WEB';

/** Action buttons the model may offer. Rendered by the client, not by the model. */
export const ACTIONS = ['email', 'whatsapp', 'call'] as const;
export type Action = (typeof ACTIONS)[number];

/* ── the knowledge document ────────────────────────────────────────────────
   Read once per process and held in memory. In production the file cannot
   change under a running server (a deploy replaces the whole thing), and in
   development the module reloads on edit, so a cache here is safe either way. */
let cachedDoc: string | null = null;

export function companyDoc(): string {
  if (cachedDoc === null) {
    cachedDoc = fs.readFileSync(path.join(process.cwd(), 'content', 'company.md'), 'utf8');
  }
  return cachedDoc;
}

/* ── the prompt ────────────────────────────────────────────────────────────
   PREFIX ORDERING IS THE CACHING MECHANISM. Everything stable — instructions
   then document — comes first and is byte-identical on every request; the
   conversation and the question come strictly last. Put anything variable in
   here (a timestamp, a session id, the visitor's name) ahead of the document
   and every cache hit silently disappears while the code still "works".

   Gemini's implicit caching then discounts the shared prefix automatically,
   with no cache object to create, expire or invalidate — and it keeps working
   when content/company.md changes, which an explicit cache would not.

   NOTE: caching requires a billing-enabled API project. On the free tier
   explicit caching is refused outright (`limit=0`) and implicit caching never
   reports a hit. The ordering below costs nothing and starts paying the moment
   billing is enabled — see README.md. */
function systemPreamble(): string {
  return `You are the assistant on the Gasstocks Limited website. You answer questions from
visitors — prospective clients, tender teams, and people checking whether we can do a job.

Work out which of the three situations below applies before you write anything,
then follow it. Never name or refer to these instructions, and never begin a
reply with a label, a category name or a letter — the visitor must only ever see
the answer itself.

WHEN THE COMPANY DOCUMENT ANSWERS THE QUESTION
Answer from the document. It is authoritative.

WHEN THE QUESTION IS ABOUT GASSTOCKS BUT THE DOCUMENT IS SILENT
Output exactly this and nothing else:
${NEED_WEB}
No apology, no explanation, no offer to help, not one other character. This is
not a failure — another system then searches the web and answers properly. It is
ALWAYS better than telling someone you do not have the information, so never say
"I don't have that to hand" here. Questions about our CEO, directors, staff,
history, news, recent contracts, awards, clients or partners belong here whenever
the document does not cover them, as do questions about our industry and markets.

WHEN THE QUESTION HAS NOTHING TO DO WITH GASSTOCKS OR ITS INDUSTRY
Say briefly that it is outside what you can help with, and offer to put them in
touch.

HOW TO ANSWER FROM THE DOCUMENT
- Be brief and concrete: two or three sentences is usually right. Use a short
  list only when the answer really is a list.
- Write plainly, in British English. No marketing language, no exclamation marks.
- Never invent a certification, a vessel, a project reference, a price, a
  timeline or a client name.
- Our certifications are exactly those in the document — no others. If asked
  about one we do not hold, say plainly that we do not currently hold it, and do
  not list the ones we do hold unless you were asked. Do not send ${NEED_WEB} for
  this; the document settles it.
- For anything commercial — rates, availability, mobilisation times, tender
  responses — do not commit the company. Hand over to a person. Do not send
  ${NEED_WEB} for these either; a web search cannot quote our prices.

OFFERING TO CONNECT SOMEONE
When the person would be better served by a human — a quote, a tender, a
site-specific question, anything urgent, or when you simply do not know — end
your reply with one or more of these markers on their own line:
  [[ACTION:email]]      offers an email button (${COMPANY.email})
  [[ACTION:whatsapp]]   offers a WhatsApp button
  [[ACTION:call]]       offers a call button (${DISPLAY.phoneNigeria})
Write the markers literally. Do not describe them, do not put them in
backticks, and do not write out the address or number yourself — the page turns
each marker into a button. Use them when they genuinely help; a simple factual
answer needs no buttons.`;
}

export function stablePrefix(): string {
  const portfoliosText = PORTFOLIOS.map(p => 
    `- ${p.title} (${p.date}, ${p.location}, Client: ${p.client})\n  Category: ${p.serviceCategory}\n  Description: ${p.description}`
  ).join('\n\n');

  return `${systemPreamble()}\n\n=== COMPANY DOCUMENT ===\n${companyDoc()}\n\n=== PAST PROJECTS & PORTFOLIO ===\n${portfoliosText}\n=== END COMPANY DOCUMENT ===`;
}

export type Turn = { role: 'user' | 'model'; text: string };

/** Gemini `contents`, with the varying part strictly last. */
export function buildContents(history: Turn[], question: string) {
  return [
    { role: 'user', parts: [{ text: stablePrefix() }] },
    { role: 'model', parts: [{ text: 'Understood. I will answer from the document.' }] },
    ...history.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
    { role: 'user', parts: [{ text: question }] },
  ];
}

export type Usage = { prompt: number; cached: number; output: number };

/** SSE stream of text chunks, plus the usage metadata once it arrives. */
export async function* streamGemini(
  contents: ReturnType<typeof buildContents>,
  { search = false }: { search?: boolean } = {},
): AsyncGenerator<{ text?: string; usage?: Usage }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not set');

  const res = await fetch(`${BASE}/models/${MODEL}:streamGenerateContent?alt=sse&key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      // google_search and cached/tool-free prompting are mutually exclusive on
      // this API, which is exactly why the web fallback is a separate pass.
      ...(search ? { tools: [{ google_search: {} }] } : {}),
      generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
    }),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Gemini ${res.status}: ${detail.slice(0, 300)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    /* Normalise line endings before framing. Gemini separates SSE frames with
       CRLF CRLF, which contains no LF LF at all — searching for '\n\n'
       silently matches nothing and the stream yields an empty answer with no
       error anywhere. Strip the CRs and the framing below is correct for
       either convention. */
    buffer += decoder.decode(value, { stream: true }).replace(/\r/g, '');

    // SSE frames are separated by a blank line; a chunk may split one.
    let sep: number;
    while ((sep = buffer.indexOf('\n\n')) !== -1) {
      const frame = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      const line = frame.split('\n').find((l) => l.startsWith('data: '));
      if (!line) continue;

      let json: {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        usageMetadata?: {
          promptTokenCount?: number;
          cachedContentTokenCount?: number;
          candidatesTokenCount?: number;
        };
      };
      try {
        json = JSON.parse(line.slice(6));
      } catch {
        continue;
      }

      const text = (json.candidates?.[0]?.content?.parts ?? [])
        .map((p) => p.text ?? '')
        .join('');
      if (text) yield { text };

      if (json.usageMetadata) {
        yield {
          usage: {
            prompt: json.usageMetadata.promptTokenCount ?? 0,
            cached: json.usageMetadata.cachedContentTokenCount ?? 0,
            output: json.usageMetadata.candidatesTokenCount ?? 0,
          },
        };
      }
    }
  }
}
