import cloudinary from '../config/cloudinary';
import logger from '../middleware/logger';
import { HttpError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { getServerErrorMessage } from '@/constants/errorMessages';

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
          return reject(
            new HttpError(
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
              getServerErrorMessage('SERVER.PROJECT.CLOUDINARY_UPLOAD_FAILED'),
            ),
          );
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
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      getServerErrorMessage('SERVER.PROJECT.CLOUDINARY_DELETE_FAILED'),
    );
  }
}

/** Delete multiple images from Cloudinary by public IDs. */
export async function deleteImages(publicIds: string[]): Promise<void> {
  if (publicIds.length === 0) return;
  try {
    await cloudinary.api.delete_resources(publicIds, { resource_type: 'image' });
  } catch (error) {
    logger.error('Cloudinary bulk delete failed', { error, publicIds });
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      getServerErrorMessage('SERVER.PROJECT.CLOUDINARY_DELETE_FAILED'),
    );
  }
}
