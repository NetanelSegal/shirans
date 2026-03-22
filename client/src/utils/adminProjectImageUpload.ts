import {
  IMAGE_UPLOAD,
  PROJECT_IMAGE_TYPES_UPLOADABLE,
  type ProjectImageMultipartUploadType,
} from '@shirans/shared';

export const ADMIN_IMAGE_UPLOAD_MIME_TYPES =
  IMAGE_UPLOAD.ALLOWED_MIME_TYPES as readonly string[];

/** @deprecated Prefer `PROJECT_IMAGE_TYPES_UPLOADABLE` from `@shirans/shared`. */
export const ADMIN_UPLOADABLE_PROJECT_IMAGE_TYPES = PROJECT_IMAGE_TYPES_UPLOADABLE;

/** @deprecated Prefer `ProjectImageMultipartUploadType` from `@shirans/shared`. */
export type AdminUploadableProjectImageType = ProjectImageMultipartUploadType;

export function filterAdminImageUploadFiles(files: File[]): {
  valid: File[];
  rejected: number;
} {
  const valid = files.filter((f) =>
    ADMIN_IMAGE_UPLOAD_MIME_TYPES.includes(f.type),
  );
  return { valid, rejected: files.length - valid.length };
}
