import multer from 'multer';
import { IMAGE_UPLOAD } from '@shirans/shared';
import { HttpError } from './errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { getServerErrorMessage } from '@/constants/errorMessages';

const storage = multer.memoryStorage();

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void {
  if (
    (IMAGE_UPLOAD.ALLOWED_MIME_TYPES as readonly string[]).includes(
      file.mimetype,
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new HttpError(
        HTTP_STATUS.BAD_REQUEST,
        getServerErrorMessage('VALIDATION.INVALID_FILE_TYPE'),
      ),
    );
  }
}

export const uploadImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: IMAGE_UPLOAD.MAX_SIZE_BYTES,
    files: IMAGE_UPLOAD.MAX_FILES_PER_REQUEST,
  },
}).array('files', IMAGE_UPLOAD.MAX_FILES_PER_REQUEST);
