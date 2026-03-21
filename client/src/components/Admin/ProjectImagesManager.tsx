import { useState, useRef, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { useAdminProjects } from '@/hooks/admin/useAdminProjects';
import type { ProjectResponse, ProjectImageType } from '@shirans/shared';
import { IMAGE_UPLOAD } from '@shirans/shared';

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

  const [selectedType, setSelectedType] = useState<ProjectImageType>('IMAGE');
  const [uploading, setUploading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || !project) return;
    setError(null);
    setUploading(true);

    try {
      const fileArray = Array.from(files);
      const metadata = fileArray.map((_, i) => ({
        type: selectedType,
        order: i,
      }));

      await uploadImages({
        projectId: project.id,
        files: fileArray,
        metadata,
      });
    } catch (err) {
      setError((err as Error)?.message ?? 'העלאה נכשלה');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [project, selectedType, uploadImages]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFilesSelected(e.dataTransfer.files);
  }, [handleFilesSelected]);

  const handleDeleteImage = useCallback(async (imageUrl: string, type: string) => {
    if (!project) return;
    setError(null);
    setDeletingIds((prev) => new Set(prev).add(imageUrl));

    try {
      if (type === 'MAIN') {
        await deleteMainImage({ id: project.id });
      } else {
        // We don't have image DB IDs in ProjectResponse, so we need to use the URL
        // For now, this will be enhanced when we add image IDs to the response
        // For MVP, we'll delete by telling the server the project ID
        // TODO: When backend returns image IDs in response, use deleteProjectImages
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
  }, [project, deleteMainImage]);

  if (!project) return null;

  const allImages = [
    ...(project.mainImage ? [{ url: project.mainImage, type: 'MAIN' as const }] : []),
    ...project.images.map((url) => ({ url, type: 'IMAGE' as const })),
    ...(project.plans ?? []).map((url) => ({ url, type: 'PLAN' as const })),
    ...(project.videos ?? []).map((url) => ({ url, type: 'VIDEO' as const })),
  ];

  const acceptedTypes = IMAGE_UPLOAD.ALLOWED_MIME_TYPES.join(',');

  return (
    <Modal
      open
      onBackdropClick={onClose}
      center
      containerClassName="w-full max-w-3xl"
    >
      <div className="rounded-xl bg-white p-6 shadow-xl" dir="rtl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">
            ניהול תמונות - {project.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-primary text-2xl leading-none transition-colors"
            aria-label="סגור"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        {/* Upload section */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <label className="text-sm font-medium">סוג:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ProjectImageType)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            >
              {(Object.entries(IMAGE_TYPE_LABELS) as [ProjectImageType, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                )
              )}
            </select>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition-colors hover:border-primary/50 hover:bg-gray-100"
            onClick={() => fileInputRef.current?.click()}
          >
            <i className="fa-solid fa-cloud-arrow-up mb-2 text-3xl text-gray-400" />
            <p className="text-sm text-gray-600">
              {uploading ? 'מעלה...' : 'גרור קבצים לכאן או לחץ לבחירה'}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              JPEG, PNG, WebP · עד 10MB · עד 20 קבצים
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

        {/* Images grid */}
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
                {/* Type badge */}
                <span className="absolute top-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {IMAGE_TYPE_LABELS[img.type]}
                </span>
                {/* Delete button */}
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
          <Button variant="secondary" onClick={onClose}>סגור</Button>
        </div>
      </div>
    </Modal>
  );
}
