import { useState, useRef, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { useAdminProjects } from '@/hooks/admin/useAdminProjects';
import { useProjectImageUpload } from '@/hooks/admin/useProjectImageUpload';
import {
  ADMIN_IMAGE_UPLOAD_MIME_TYPES,
  ADMIN_UPLOADABLE_PROJECT_IMAGE_TYPES,
  type AdminUploadableProjectImageType,
} from '@/utils/adminProjectImageUpload';
import type { ProjectResponse, ProjectImageType } from '@shirans/shared';

interface ProjectImagesManagerProps {
  project: ProjectResponse | null;
  onClose: () => void;
}

const IMAGE_TYPE_LABELS: Record<ProjectImageType, string> = {
  MAIN: 'ראשית',
  IMAGE: 'תמונה',
  PLAN: 'תוכנית',
  VIDEO: 'סרטון',
};

export function ProjectImagesManager({ project, onClose }: ProjectImagesManagerProps) {
  const { uploadImages, deleteMainImage } = useAdminProjects();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedType, setSelectedType] =
    useState<AdminUploadableProjectImageType>('IMAGE');
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

  const handleDeleteImage = useCallback(
    async (imageUrl: string, type: string) => {
      if (!project) return;
      setError(null);
      setDeletingIds((prev) => new Set(prev).add(imageUrl));

      try {
        if (type === 'MAIN') {
          await deleteMainImage({ id: project.id });
        }
      } catch (err) {
        setError((err as Error)?.message ?? 'מחיקה נכשלה');
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

  const allImages = [
    ...(project.mainImage ? [{ url: project.mainImage, type: 'MAIN' as const }] : []),
    ...project.images.map((url) => ({ url, type: 'IMAGE' as const })),
    ...(project.plans ?? []).map((url) => ({ url, type: 'PLAN' as const })),
    ...(project.videos ?? []).map((url) => ({ url, type: 'VIDEO' as const })),
  ];

  const acceptedTypes = ADMIN_IMAGE_UPLOAD_MIME_TYPES.join(',');

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
            <label className="text-sm font-medium">סוג:</label>
            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value as AdminUploadableProjectImageType)
              }
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              disabled={isBusy}
            >
              {ADMIN_UPLOADABLE_PROJECT_IMAGE_TYPES.map((value) => (
                <option key={value} value={value}>
                  {IMAGE_TYPE_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${isBusy ? 'cursor-wait border-gray-200 bg-gray-100' : 'cursor-pointer border-gray-300 bg-gray-50 hover:border-primary/50 hover:bg-gray-100'}`}
            onClick={isBusy ? undefined : () => fileInputRef.current?.click()}
          >
            <i className="fa-solid fa-cloud-arrow-up mb-2 text-3xl text-gray-400" />
            <p className="text-sm text-gray-600">
              {uploading ? 'מעלה ומעבד תמונות...' : 'גרור קבצים לכאן או לחץ לבחירה'}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              JPEG, PNG, WebP, HEIC · עד 20 קבצים
            </p>
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
              <div key={img.url} className="group relative overflow-hidden rounded-lg">
                {img.type === 'VIDEO' ? (
                  <div className="flex aspect-video items-center justify-center bg-gray-100">
                    <i className="fa-solid fa-video text-2xl text-gray-400" />
                  </div>
                ) : (
                  <Image
                    src={img.url}
                    alt=""
                    className="aspect-video w-full object-cover"
                  />
                )}
                <span className="absolute top-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {IMAGE_TYPE_LABELS[img.type]}
                </span>
                {img.type === 'MAIN' && (
                  <button
                    onClick={() => handleDeleteImage(img.url, img.type)}
                    disabled={deletingIds.has(img.url)}
                    className="absolute top-1 left-1 rounded bg-red-500/80 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                    aria-label="מחק תמונה"
                  >
                    <i className="fa-solid fa-trash text-xs" />
                  </button>
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
