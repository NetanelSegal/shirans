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
