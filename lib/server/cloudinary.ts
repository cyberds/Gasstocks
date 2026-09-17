import 'server-only';

import { v2 as cloudinary } from 'cloudinary';

export const PORTFOLIO_FOLDER = 'gasstocks/portfolio';

let configured = false;

export function getCloudinary() {
  if (!configured) {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      throw new Error(
        '[cloudinary] CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must all be set.',
      );
    }
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
}

/** Signature for a direct browser → Cloudinary upload. Files never pass
    through our server, so Vercel's 4.5 MB request cap does not apply. */
export function signUpload() {
  const cld = getCloudinary();
  const timestamp = Math.round(Date.now() / 1000);
  const params = { folder: PORTFOLIO_FOLDER, timestamp };
  const signature = cld.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);
  return {
    ...params,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  };
}

/** Deletes images, logging (not swallowing) any that Cloudinary refuses. */
export async function destroyImages(publicIds: string[]) {
  if (publicIds.length === 0) return;
  const cld = getCloudinary();
  const results = await Promise.allSettled(publicIds.map((id) => cld.uploader.destroy(id)));
  results.forEach((r, i) => {
    if (r.status === 'rejected' || (r.value?.result !== 'ok' && r.value?.result !== 'not found')) {
      console.error('[cloudinary] failed to delete image', publicIds[i], r.status === 'rejected' ? r.reason : r.value);
    }
  });
}
