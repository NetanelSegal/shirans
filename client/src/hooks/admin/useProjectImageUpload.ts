import { useState, useCallback, type RefObject } from 'react';
import {
  ERROR_KEYS,
  IMAGE_UPLOAD,
  type ErrorKey,
  type ProjectResponse,
} from '@shirans/shared';
import type { UploadProjectImagesInput } from '@/services/admin/projects.service';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { transformError } from '@/utils/errorHandler';
import { filterAdminImageUploadFiles } from '@/utils/adminProjectImageUpload';
import type { ProjectImageMultipartUploadType } from '@shirans/shared';

export function useProjectImageUpload(
  fileInputRef: RefObject<HTMLInputElement | null>,
  options: {
    project: ProjectResponse | null;
    selectedType: ProjectImageMultipartUploadType;
    uploadImages: (input: UploadProjectImagesInput) => Promise<unknown>;
    setError: (message: string | null) => void;
  },
) {
  const { project, selectedType, uploadImages, setError } = options;
  const [uploading, setUploading] = useState(false);

  const handleFilesSelected = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0 || !project) return;
      setError(null);

      const { valid, rejected } = filterAdminImageUploadFiles(
        Array.from(files),
      );
      if (valid.length === 0) {
        setError(
          getClientErrorMessage(ERROR_KEYS.VALIDATION.INVALID_FILE_TYPE),
        );
        return;
      }

      if (valid.length > IMAGE_UPLOAD.MAX_FILES_PER_REQUEST) {
        setError(getClientErrorMessage(ERROR_KEYS.VALIDATION.TOO_MANY_FILES));
        return;
      }

      if (selectedType === 'MAIN' && project.mainImage) {
        setError(
          getClientErrorMessage(
            ERROR_KEYS.VALIDATION.MAIN_IMAGE_ALREADY_EXISTS,
          ),
        );
        return;
      }

      try {
        setUploading(true);
        const metadata = valid.map((_, i) => ({
          type: selectedType,
          order: i,
        }));

        await uploadImages({
          projectId: project.id,
          files: valid,
          metadata,
        });

        if (rejected > 0) {
          setError(
            `${rejected} קבצים נדחו — ${getClientErrorMessage(ERROR_KEYS.VALIDATION.INVALID_FILE_TYPE)}`,
          );
        }
      } catch (err) {
        const app = transformError(err);
        setError(getClientErrorMessage(app.errorKey as ErrorKey));
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [project, selectedType, uploadImages, setError, fileInputRef],
  );

  return { uploading, handleFilesSelected };
}
