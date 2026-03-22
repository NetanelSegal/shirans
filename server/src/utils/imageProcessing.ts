import sharp from 'sharp';

const MAX_DIMENSION = 2048;
const WEBP_QUALITY = 80;

/**
 * Compress and resize an image buffer using sharp.
 * Converts any supported format (JPEG, PNG, WebP, HEIC, HEIF, TIFF, AVIF)
 * to WebP, resized to fit within MAX_DIMENSION on the longest edge.
 */
export async function compressImageBuffer(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate() // auto-rotate based on EXIF orientation
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}
