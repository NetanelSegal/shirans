import { IMAGE_UPLOAD } from '@shirans/shared';

const allowedMimeTypes = IMAGE_UPLOAD.ALLOWED_MIME_TYPES as readonly string[];

export function filterAdminImageUploadFiles(files: File[]): {
  valid: File[];
  rejected: number;
} {
  const valid = files.filter((f) => allowedMimeTypes.includes(f.type));
  return { valid, rejected: files.length - valid.length };
}
