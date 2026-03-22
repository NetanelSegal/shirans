/**
 * Project image taxonomy — keep in sync with Prisma `enum ProjectImageType`
 * (`server/prisma/schema.prisma`). If you add/remove a value: migrate DB, update
 * this tuple, Zod schemas (derived from here), seed data, and `transformProjectToResponse`.
 */
export const PROJECT_IMAGE_TYPE_VALUES = [
  'MAIN',
  'IMAGE',
  'PLAN',
  'VIDEO',
] as const;

export type ProjectImageType = (typeof PROJECT_IMAGE_TYPE_VALUES)[number];

/** Allowed `type` values for multipart file upload (Cloudinary pipeline — not VIDEO URLs). */
export const PROJECT_IMAGE_TYPES_UPLOADABLE = ['MAIN', 'IMAGE', 'PLAN'] as const;

export type ProjectImageMultipartUploadType =
  (typeof PROJECT_IMAGE_TYPES_UPLOADABLE)[number];

/** Hebrew labels for admin UI (RTL site). */
export const PROJECT_IMAGE_TYPE_LABELS_HE: Record<ProjectImageType, string> = {
  MAIN: 'ראשית',
  IMAGE: 'תמונה',
  PLAN: 'תוכנית',
  VIDEO: 'סרטון',
};
