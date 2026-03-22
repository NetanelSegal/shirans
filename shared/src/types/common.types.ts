export type UserRole = 'ADMIN' | 'USER';
export type CategoryUrlCode = string;

/** File upload constraints shared between server (multer) and client (validation). */
export const IMAGE_UPLOAD = {
  MAX_SIZE_BYTES: 50 * 1024 * 1024, // 50 MB — raw camera files; sharp compresses server-side
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
  ] as const,
  MAX_FILES_PER_REQUEST: 5,
} as const;
