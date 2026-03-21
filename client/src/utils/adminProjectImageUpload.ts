import { IMAGE_UPLOAD } from '@shirans/shared';

export const ADMIN_IMAGE_UPLOAD_MIME_TYPES =
  IMAGE_UPLOAD.ALLOWED_MIME_TYPES as readonly string[];

/** Types allowed for multipart image upload (matches server MIME allowlist). */
export const ADMIN_UPLOADABLE_PROJECT_IMAGE_TYPES = [
  'MAIN',
  'IMAGE',
  'PLAN',
] as const;

export type AdminUploadableProjectImageType =
  (typeof ADMIN_UPLOADABLE_PROJECT_IMAGE_TYPES)[number];

export function filterAdminImageUploadFiles(files: File[]): {
  valid: File[];
  rejected: number;
} {
  const valid = files.filter((f) =>
    ADMIN_IMAGE_UPLOAD_MIME_TYPES.includes(f.type),
  );
  return { valid, rejected: files.length - valid.length };
}
