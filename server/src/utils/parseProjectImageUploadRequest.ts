import type { Request } from 'express';
import { z } from 'zod';
import {
  singleProjectQuerySchema,
  uploadImageMetadataSchema,
  type UploadImageMetadata,
} from '@shirans/shared';
import { HttpError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { getServerErrorMessage } from '@/constants/errorMessages';
import { validateRequest } from './validation';

export interface ParsedProjectImageUpload {
  id: string;
  files: Express.Multer.File[];
  metadata: UploadImageMetadata[];
}

/**
 * Validates multipart body for POST /api/projects/uploadImgs.
 * Multer must have run first so req.files and req.body are populated.
 */
export function parseProjectImageUploadRequest(
  req: Request,
): ParsedProjectImageUpload {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      getServerErrorMessage('VALIDATION.INVALID_INPUT'),
    );
  }

  const { id } = validateRequest(singleProjectQuerySchema, {
    id: req.body.id,
  });

  let metadata: UploadImageMetadata[] = [];
  try {
    const raw = JSON.parse(
      typeof req.body.metadata === 'string' ? req.body.metadata : '[]',
    );
    metadata = z.array(uploadImageMetadataSchema).parse(raw);
  } catch {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      getServerErrorMessage('VALIDATION.INVALID_INPUT'),
    );
  }

  if (metadata.length !== files.length) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      getServerErrorMessage(
        'VALIDATION.UPLOAD_METADATA_FILE_COUNT_MISMATCH',
      ),
    );
  }

  return { id, files, metadata };
}
