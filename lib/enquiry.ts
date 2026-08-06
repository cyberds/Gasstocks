import { z } from 'zod';

/* The enquiry payload, defined once and imported by both the form and the
   route handler, so client and server validation cannot drift apart.
   Server-side validation is the one that counts — the client copy exists only
   to give immediate feedback. */

/** Must match the <select> options in components/ContactForm.tsx. */
export const SCOPES = [
  'Shipping & chartering',
  'Marine logistics',
  'Dredging & reclamation',
  'Jetty & marine construction',
  'Marine security',
  'Marine catering',
  'Civil engineering',
  'Roads & earthworks',
  'Multi-discipline / EPC',
] as const;

/* A missing field would otherwise report zod's generic "Invalid input" rather
   than the message written for it, so every field carries an explicit `error`
   for the absent/wrong-type case as well as its min/max messages. */
export const enquirySchema = z.object({
  organisation: z
    .string({ error: 'Enter your organisation' })
    .trim()
    .min(2, 'Enter your organisation')
    .max(200, 'That organisation name is too long'),
  name: z
    .string({ error: 'Enter your name' })
    .trim()
    .min(2, 'Enter your name')
    .max(120, 'That name is too long'),
  email: z.email({ error: 'Enter a valid email address' }).max(254),
  reference: z.string().trim().max(120, 'That reference is too long').optional(),
  scope: z.enum(SCOPES, { error: 'Choose a scope of enquiry' }),
  brief: z
    .string({ error: 'Tell us about the scope' })
    .trim()
    .min(20, 'Please give us at least a sentence about the scope')
    .max(5000, 'Please keep the brief under 5000 characters'),
  /* Honeypot. A real person never sees this field, so anything in it is a bot.
     Named plausibly rather than "honeypot" so it is not trivially skipped.
     Deliberately UNCONSTRAINED: the schema must accept a filled honeypot so
     the route can answer 200 and drop it silently. Rejecting it here would
     hand the bot a 400 telling it exactly which field gave it away. */
  company_website: z.string().optional(),
});

export type Enquiry = z.infer<typeof enquirySchema>;

/** Field-keyed errors, the shape the form renders. */
export type FieldErrors = Partial<Record<keyof Enquiry, string>>;

export function fieldErrorsOf(error: z.ZodError<Enquiry>): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof Enquiry | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
