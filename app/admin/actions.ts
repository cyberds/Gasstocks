'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

import { authorizedEmails, masterEmail, normalizeEmail, requireAdmin } from '../../lib/server/admin-auth';
import { destroyImages, PORTFOLIO_FOLDER, signUpload } from '../../lib/server/cloudinary';
import { PORTFOLIO_TAG, portfoliosCollection } from '../../lib/portfolio';

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string; fields?: Record<string, string> };

/* Server actions are public POST endpoints — every one re-checks the session. */

function fail(err: unknown, what: string): ActionResult {
  console.error(`[admin] ${what} failed`, err);
  const detail = err instanceof Error ? err.message : String(err);
  return { ok: false, error: `${what} failed because of a technical fault: ${detail}` };
}

function refreshPublicPages(slugs: string[] = []) {
  revalidateTag(PORTFOLIO_TAG);
  revalidatePath('/', 'layout'); // header menu on every page lists projects
  for (const slug of slugs) revalidatePath(`/portfolio/${slug}`);
}

// ── uploads ──────────────────────────────────────────────────────────────

export async function getUploadSignature() {
  await requireAdmin();
  return signUpload();
}

// ── track record ─────────────────────────────────────────────────────────

const imageSchema = z.object({
  url: z.string().url().refine((u) => u.startsWith('https://res.cloudinary.com/'), 'Images must be hosted on Cloudinary'),
  publicId: z.string().refine((id) => id.startsWith(`${PORTFOLIO_FOLDER}/`), 'Unexpected image location'),
});

const portfolioSchema = z.object({
  title: z.string().trim().min(3, 'Title is required').max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens only')
    .max(120),
  description: z.string().trim().min(10, 'Description is required').max(5000),
  client: z.string().trim().min(1, 'Client is required').max(200),
  location: z.string().trim().min(1, 'Location is required').max(200),
  date: z.string().trim().min(1, 'Date is required').max(100),
  serviceCategory: z.string().trim().min(1, 'Category is required').max(200),
  order: z.coerce.number().int().min(0).max(100000),
  images: z.array(imageSchema).min(1, 'Add at least one image').max(60),
});

export type PortfolioInput = z.input<typeof portfolioSchema>;

function validate(input: unknown) {
  const parsed = portfolioSchema.safeParse(input);
  if (parsed.success) return { data: parsed.data } as const;
  const fields: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0] ?? 'form');
    fields[key] ??= issue.message;
  }
  return { result: { ok: false, error: 'Please fix the highlighted fields.', fields } satisfies ActionResult } as const;
}

function isDuplicateKey(err: unknown) {
  return typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000;
}

export async function createPortfolio(input: PortfolioInput): Promise<ActionResult> {
  await requireAdmin();
  const v = validate(input);
  if (v.result) return v.result;
  try {
    const now = new Date();
    const { insertedId } = await (await portfoliosCollection()).insertOne({
      _id: new ObjectId(),
      ...v.data,
      createdAt: now,
      updatedAt: now,
    });
    refreshPublicPages([v.data.slug]);
    return { ok: true, id: insertedId.toHexString() };
  } catch (err) {
    if (isDuplicateKey(err)) return { ok: false, error: 'Please fix the highlighted fields.', fields: { slug: 'Another project already uses this slug' } };
    return fail(err, 'Saving the project');
  }
}

export async function updatePortfolio(id: string, input: PortfolioInput): Promise<ActionResult> {
  await requireAdmin();
  if (!ObjectId.isValid(id)) return { ok: false, error: 'Project not found.' };
  const v = validate(input);
  if (v.result) return v.result;
  try {
    const col = await portfoliosCollection();
    const before = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...v.data, updatedAt: new Date() } },
      { returnDocument: 'before' },
    );
    if (!before) return { ok: false, error: 'Project not found — it may have been deleted by someone else.' };

    const kept = new Set(v.data.images.map((i) => i.publicId));
    await destroyImages(before.images.map((i) => i.publicId).filter((pid) => !kept.has(pid)));
    refreshPublicPages([before.slug, v.data.slug]);
    return { ok: true, id };
  } catch (err) {
    if (isDuplicateKey(err)) return { ok: false, error: 'Please fix the highlighted fields.', fields: { slug: 'Another project already uses this slug' } };
    return fail(err, 'Saving the project');
  }
}

export async function deletePortfolio(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!ObjectId.isValid(id)) return { ok: false, error: 'Project not found.' };
  try {
    const doc = await (await portfoliosCollection()).findOneAndDelete({ _id: new ObjectId(id) });
    if (!doc) return { ok: false, error: 'Project not found — it may already have been deleted.' };
    await destroyImages(doc.images.map((i) => i.publicId));
    refreshPublicPages([doc.slug]);
    return { ok: true };
  } catch (err) {
    return fail(err, 'Deleting the project');
  }
}

/** Removes images uploaded in a form that was then abandoned. */
export async function discardUploads(publicIds: string[]): Promise<void> {
  await requireAdmin();
  const ids = publicIds.filter((id) => typeof id === 'string' && id.startsWith(`${PORTFOLIO_FOLDER}/`));
  if (ids.length === 0) return;
  // Never delete an image a saved project still uses.
  const inUse = await (await portfoliosCollection()).distinct('images.publicId', { 'images.publicId': { $in: ids } });
  await destroyImages(ids.filter((id) => !inUse.includes(id)));
}

// ── authorized emails ────────────────────────────────────────────────────

const emailSchema = z.string().trim().toLowerCase().email('Enter a valid email address');

export async function addAuthorizedEmail(raw: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = emailSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const email = normalizeEmail(parsed.data);
  if (email === masterEmail()) return { ok: false, error: 'That is the master admin email — it always has access.' };
  try {
    await (await authorizedEmails()).insertOne({ _id: new ObjectId(), email, addedBy: admin.email, createdAt: new Date() });
    revalidatePath('/admin/emails');
    return { ok: true };
  } catch (err) {
    if (isDuplicateKey(err)) return { ok: false, error: 'That email is already authorized.' };
    return fail(err, 'Adding the email');
  }
}

export async function removeAuthorizedEmail(email: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  const e = normalizeEmail(email);
  if (e === admin.email) return { ok: false, error: 'You cannot remove your own access.' };
  try {
    const { deletedCount } = await (await authorizedEmails()).deleteOne({ email: e });
    if (deletedCount === 0) return { ok: false, error: 'That email was not on the list.' };
    revalidatePath('/admin/emails');
    return { ok: true };
  } catch (err) {
    return fail(err, 'Removing the email');
  }
}
