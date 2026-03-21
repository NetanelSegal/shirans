export type UserRole = 'ADMIN' | 'USER';
export type CategoryUrlCode = string;
export type ProjectImageType = 'MAIN' | 'IMAGE' | 'PLAN' | 'VIDEO';

/** File upload constraints shared between server (multer) and client (validation). */
export const IMAGE_UPLOAD = {
  MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
  MAX_FILES_PER_REQUEST: 20,
} as const;
