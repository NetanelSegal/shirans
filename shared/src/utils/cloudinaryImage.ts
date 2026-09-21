const CLOUDINARY_UPLOAD = '/upload/';

/**
 * Applies Cloudinary delivery transforms for responsive images (f_auto, q_auto, width cap).
 * No-op for non-Cloudinary URLs or URLs that already include width transforms.
 */
export function optimizeCloudinaryImageUrl(
  url: string,
  width: number,
): string {
  if (!url || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const uploadIndex = url.indexOf(CLOUDINARY_UPLOAD);
  if (uploadIndex === -1) {
    return url;
  }

  const afterUpload = url.slice(uploadIndex + CLOUDINARY_UPLOAD.length);
  if (/w_\d+/.test(afterUpload.split('/')[0] ?? '')) {
    return url;
  }

  const transform = `f_auto,q_auto,w_${width}`;
  return url.replace(CLOUDINARY_UPLOAD, `${CLOUDINARY_UPLOAD}${transform}/`);
}

/** Link-preview image dimensions: the 1.91:1 frame every major platform uses. */
export const SHARE_IMAGE_WIDTH = 1200;
export const SHARE_IMAGE_HEIGHT = 630;

/**
 * A Cloudinary image shaped for a link preview: exactly 1200x630, JPEG,
 * cropped around the subject.
 *
 * Deliberately not `f_auto`. Cloudinary negotiates that from the Accept header
 * and can hand a crawler WebP, which WhatsApp previews don't reliably render. A
 * fixed width alone isn't enough either — a portrait photo would stay portrait
 * and show up as a small thumbnail instead of a full card.
 */
export function cloudinaryShareImageUrl(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) {
    return url;
  }
  if (url.indexOf(CLOUDINARY_UPLOAD) === -1) {
    return url;
  }
  const transform = `c_fill,g_auto,w_${SHARE_IMAGE_WIDTH},h_${SHARE_IMAGE_HEIGHT},f_jpg,q_auto`;
  return url.replace(CLOUDINARY_UPLOAD, `${CLOUDINARY_UPLOAD}${transform}/`);
}
