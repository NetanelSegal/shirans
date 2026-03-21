import cloudinary from '../config/cloudinary';
import logger from '../middleware/logger';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

/**
 * Upload a buffer to Cloudinary.
 * @param buffer - File bytes (from multer memoryStorage)
 * @param folder - Cloudinary folder path, e.g. "shirans/projects/{id}/main"
 */
export async function uploadImage(
  buffer: Buffer,
  folder: string,
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          logger.error('Cloudinary upload failed', { error, folder });
          return reject(error ?? new Error('No result from Cloudinary'));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(buffer);
  });
}

/** Delete a single image from Cloudinary by public ID. */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (error) {
    logger.error('Cloudinary delete failed', { error, publicId });
    throw error;
  }
}

/** Delete multiple images from Cloudinary by public IDs. */
export async function deleteImages(publicIds: string[]): Promise<void> {
  if (publicIds.length === 0) return;
  try {
    await cloudinary.api.delete_resources(publicIds, { resource_type: 'image' });
  } catch (error) {
    logger.error('Cloudinary bulk delete failed', { error, publicIds });
    throw error;
  }
}
