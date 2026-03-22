import { useState, useRef, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { useAdminProjects } from '@/hooks/admin/useAdminProjects';
import { useProjectImageUpload } from '@/hooks/admin/useProjectImageUpload';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { transformError } from '@/utils/errorHandler';
import {
  IMAGE_UPLOAD,
  PROJECT_IMAGE_TYPE_LABELS_HE,
  PROJECT_IMAGE_TYPES_UPLOADABLE,
  type ErrorKey,
  type ProjectImageMultipartUploadType,
  type ProjectImageType,
  type ProjectResponse,
} from '@shirans/shared';

interface ProjectImagesManagerProps {
  project: ProjectResponse | null;
  onClose: () => void;
}

export function ProjectImagesManager({ project, onClose }: ProjectImagesManagerProps) {
  const { uploadImages, deleteMainImage } = useAdminProjects();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedType, setSelectedType] =
    useState<ProjectImageMultipartUploadType>('IMAGE');
  const [error, setError] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const { uploading, handleFilesSelected } = useProjectImageUpload(fileInputRef, {
    project,
    selectedType,
    uploadImages,
    setError,
  });

  const isBusy = uploading;

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!isBusy) handleFilesSelected(e.dataTransfer.files);
    },
    [handleFilesSelected, isBusy],
  );

  const handleDeleteMainImage = useCallback(
    async (imageUrl: string) => {
      if (!project) return;
      setError(null);
      setDeletingIds((prev) => new Set(prev).add(imageUrl));

      try {
        await deleteMainImage({ id: project.id });
      } catch (err) {
        const app = transformError(err);
        setError(getClientErrorMessage(app.errorKey as ErrorKey));
      } finally {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(imageUrl);
          return next;
        });
      }
    },
    [project, deleteMainImage],
  );

  const safeClose = useCallback(() => {
    if (!isBusy) onClose();
  }, [isBusy, onClose]);

  if (!project) return null;

  const allImages: Array<{ url: string; type: ProjectImageType }> = [
    ...(project.mainImage ? [{ url: project.mainImage, type: 'MAIN' as const }] : []),
    ...project.images.map((url) => ({ url, type: 'IMAGE' as const })),
    ...(project.plans ?? []).map((url) => ({ url, type: 'PLAN' as const })),
    ...(project.videos ?? []).map((url) => ({ url, type: 'VIDEO' as const })),
  ];

  const acceptedTypes = IMAGE_UPLOAD.ALLOWED_MIME_TYPES.join(',');

  return (
    <Modal
      open
      onBackdropClick={safeClose}
      center
      containerClassName="w-full max-w-3xl"
    >
      <div className="rounded-xl bg-white p-6 shadow-xl" dir="rtl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">
            ניהול תמונות - {project.title}
          </h2>
          <Button
            variant="light"
            onClick={safeClose}
            disabled={isBusy}
            className="!px-2 !py-1 text-lg leading-none"
            ariaLabel="סגור"
          >
            ×
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <label
              htmlFor="project-image-upload-type"
              className="text-sm font-medium"
            >
              סוג:
            </label>
            <select
              id="project-image-upload-type"
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value as ProjectImageMultipartUploadType)
              }
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              disabled={isBusy}
            >
              {PROJECT_IMAGE_TYPES_UPLOADABLE.map((value) => (
                <option key={value} value={value}>
                  {PROJECT_IMAGE_TYPE_LABELS_HE[value]}
                </option>
              ))}
            </select>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            role="region"
            aria-label="אזור גרירת קבצים להעלאה"
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${isBusy ? 'border-gray-200 bg-gray-100' : 'border-gray-300 bg-gray-50'}`}
          >
            <i className="fa-solid fa-cloud-arrow-up mb-2 text-3xl text-gray-400" aria-hidden />
            <p className="text-sm text-gray-600">
              {uploading ? 'מעלה ומעבד תמונות...' : 'גרור קבצים לכאן'}
            </p>
            <p className="mt-1 mb-3 text-xs text-gray-400">
              JPEG, PNG, WebP, HEIC · עד 20 קבצים
            </p>
            <Button
              type="button"
              variant="secondary"
              disabled={isBusy}
              className="text-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              בחר קבצים
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={(e) => handleFilesSelected(e.target.files)}
            className="hidden"
          />
        </div>

        {allImages.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-8">אין תמונות</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {allImages.map((img) => (
              <div key={img.url} className="relative overflow-hidden rounded-lg">
                {img.type === 'VIDEO' ? (
                  <div className="flex aspect-video items-center justify-center bg-gray-100">
                    <i className="fa-solid fa-video text-2xl text-gray-400" aria-hidden />
                  </div>
                ) : (
                  <Image
                    src={img.url}
                    alt={`${project.title} — ${PROJECT_IMAGE_TYPE_LABELS_HE[img.type]}`}
                    className="aspect-video w-full object-cover"
                  />
                )}
                <span className="absolute top-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {PROJECT_IMAGE_TYPE_LABELS_HE[img.type]}
                </span>
                {img.type === 'MAIN' && (
                  <Button
                    type="button"
                    variant="danger"
                    ariaLabel="מחק תמונה ראשית"
                    onClick={() => handleDeleteMainImage(img.url)}
                    disabled={deletingIds.has(img.url)}
                    className="absolute top-1 left-1 !min-h-0 !min-w-0 !px-2 !py-1.5"
                  >
                    <i className="fa-solid fa-trash text-xs" aria-hidden />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={safeClose} disabled={isBusy}>
            סגור
          </Button>
        </div>
      </div>
    </Modal>
  );
}
