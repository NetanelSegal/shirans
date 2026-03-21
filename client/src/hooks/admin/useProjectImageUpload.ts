import { useState, useCallback, type RefObject } from 'react';
import { IMAGE_UPLOAD } from '@shirans/shared';
import type { ProjectResponse } from '@shirans/shared';
import type { UploadProjectImagesInput } from '@/services/admin/projects.service';
import {
  filterAdminImageUploadFiles,
  type AdminUploadableProjectImageType,
} from '@/utils/adminProjectImageUpload';

export function useProjectImageUpload(
  fileInputRef: RefObject<HTMLInputElement | null>,
  options: {
    project: ProjectResponse | null;
    selectedType: AdminUploadableProjectImageType;
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

      const { valid, rejected } = filterAdminImageUploadFiles(Array.from(files));
      if (valid.length === 0) {
        setError('אף קובץ לא תקין. מותר: JPEG, PNG, WebP, HEIC, HEIF');
        return;
      }

      if (valid.length > IMAGE_UPLOAD.MAX_FILES_PER_REQUEST) {
        setError(`מותר עד ${IMAGE_UPLOAD.MAX_FILES_PER_REQUEST} קבצים בבת אחת`);
        return;
      }

      if (selectedType === 'MAIN' && project.mainImage) {
        setError('כבר קיימת תמונה ראשית. מחק אותה לפני העלאת חדשה');
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
          setError(`${rejected} קבצים נדחו (סוג לא נתמך)`);
        }
      } catch (err) {
        setError((err as Error)?.message ?? 'העלאה נכשלה');
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [project, selectedType, uploadImages, setError, fileInputRef],
  );

  return { uploading, handleFilesSelected };
}
