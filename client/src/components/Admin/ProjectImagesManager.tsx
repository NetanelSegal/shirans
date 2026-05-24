import { useState, useRef, useCallback, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { Select, type SelectOption } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { useAdminProjects } from '@/hooks/admin/useAdminProjects';
import { useProjectImageUpload } from '@/hooks/admin/useProjectImageUpload';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { transformError } from '@/utils/errorHandler';
import {
  IMAGE_UPLOAD,
  PROJECT_IMAGE_TYPE_LABELS_HE,
  PROJECT_IMAGE_TYPES_UPLOADABLE,
  applyMediaIdOrder,
  buildFullReorderIdsFromMove,
  getMediaByType,
  getMediaIdOrder,
  isSameMediaOrder,
  sortProjectMedia,
  type ErrorKey,
  type ProjectImageMultipartUploadType,
  type ProjectImageType,
  type ProjectMediaItem,
  type ProjectResponse,
} from '@shirans/shared';
const UPLOAD_TYPE_OPTIONS: SelectOption<ProjectImageMultipartUploadType>[] =
  PROJECT_IMAGE_TYPES_UPLOADABLE.map((value) => ({
    value,
    label: PROJECT_IMAGE_TYPE_LABELS_HE[value],
  }));

const ACCEPTED_MIME_TYPES = IMAGE_UPLOAD.ALLOWED_MIME_TYPES.join(',');

type ReorderableType = 'IMAGE' | 'PLAN';
type ReorderMode = 'immediate' | 'bulk';

const MEDIA_SECTIONS: Array<{
  type: ProjectImageType;
  title: string;
  reorderable: boolean;
}> = [
  { type: 'MAIN', title: PROJECT_IMAGE_TYPE_LABELS_HE.MAIN, reorderable: false },
  { type: 'IMAGE', title: PROJECT_IMAGE_TYPE_LABELS_HE.IMAGE, reorderable: true },
  { type: 'PLAN', title: PROJECT_IMAGE_TYPE_LABELS_HE.PLAN, reorderable: true },
  { type: 'VIDEO', title: PROJECT_IMAGE_TYPE_LABELS_HE.VIDEO, reorderable: false },
];

interface ImageUploadZoneProps {
  selectedType: ProjectImageMultipartUploadType;
  onTypeChange: (type: ProjectImageMultipartUploadType) => void;
  uploading: boolean;
  disabled: boolean;
  onDrop: (e: React.DragEvent) => void;
  onBrowseClick: () => void;
}

function ImageUploadZone({
  selectedType,
  onTypeChange,
  uploading,
  disabled,
  onDrop,
  onBrowseClick,
}: ImageUploadZoneProps) {
  return (
    <div className="mb-6">
      <div className="mb-3 max-w-[200px]">
        <Select
          id="project-image-upload-type"
          label="סוג"
          options={UPLOAD_TYPE_OPTIONS}
          value={selectedType}
          onChange={onTypeChange}
          disabled={disabled}
        />
      </div>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        role="region"
        aria-label="אזור גרירת קבצים להעלאה"
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${disabled ? 'border-gray-200 bg-gray-100' : 'border-gray-300 bg-gray-50'}`}
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
          disabled={disabled}
          className="text-sm"
          onClick={onBrowseClick}
        >
          בחר קבצים
        </Button>
      </div>
    </div>
  );
}

interface ImageThumbnailProps {
  item: ProjectMediaItem;
  projectTitle: string;
  indexInType: number;
  reorderable: boolean;
  showDragHandle: boolean;
  isDeleting: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  onDelete: () => void;
  onDragStart: () => void;
  onDragOver: () => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

function ImageThumbnail({
  item,
  projectTitle,
  indexInType,
  reorderable,
  showDragHandle,
  isDeleting,
  isDragging,
  isDropTarget,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: ImageThumbnailProps) {
  const typeLabel = PROJECT_IMAGE_TYPE_LABELS_HE[item.type];

  return (
    <div
      draggable={showDragHandle}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        onDragOver();
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      onDragEnd={onDragEnd}
      className={`relative overflow-hidden rounded-lg border bg-white transition-all ${
        isDragging ? 'scale-[0.98] opacity-40' : ''
      } ${isDropTarget ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200'}`}
    >
      {item.type === 'VIDEO' ? (
        <div className="flex aspect-video items-center justify-center bg-gray-100">
          <i className="fa-solid fa-video text-2xl text-gray-400" aria-hidden />
        </div>
      ) : (
        <Image
          src={item.url}
          alt={`${projectTitle} — ${typeLabel}`}
          className="aspect-video w-full object-cover"
          draggable={false}
        />
      )}
      <span className="absolute top-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
        {typeLabel}
      </span>
      {reorderable && (
        <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
          {indexInType + 1}
        </span>
      )}
      <Button
        type="button"
        variant="danger"
        ariaLabel={`מחק ${typeLabel}`}
        onClick={onDelete}
        disabled={isDeleting}
        className="absolute top-1 left-1 !min-h-0 !min-w-0 !px-2 !py-1.5"
      >
        {isDeleting ? (
          <i className="fa-solid fa-spinner fa-spin text-xs" aria-hidden />
        ) : (
          <i className="fa-solid fa-trash text-xs" aria-hidden />
        )}
      </Button>
      {showDragHandle && (
        <div
          className="absolute bottom-1 left-1 flex cursor-grab items-center rounded bg-white/90 px-2 py-1 text-gray-600 shadow-sm active:cursor-grabbing"
          aria-hidden
        >
          <i className="fa-solid fa-grip-lines text-sm" />
        </div>
      )}
    </div>
  );
}

interface MediaSectionProps {
  type: ProjectImageType;
  title: string;
  reorderable: boolean;
  items: ProjectMediaItem[];
  project: ProjectResponse;
  deletingIds: Set<string>;
  dragState: { type: ReorderableType; fromIndex: number } | null;
  dropTargetIndex: number | null;
  reorderMode: ReorderMode;
  onDelete: (item: ProjectMediaItem) => void;
  onDragStart: (type: ReorderableType, index: number) => void;
  onDragOver: (index: number) => void;
  onDrop: (type: ReorderableType, toIndex: number) => void;
  onDragEnd: () => void;
}

function MediaSection({
  type,
  title,
  reorderable,
  items,
  project,
  deletingIds,
  dragState,
  dropTargetIndex,
  reorderMode,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: MediaSectionProps) {
  if (items.length === 0) return null;

  const canDrag = reorderable && items.length > 1;
  const isActiveSection = dragState?.type === type;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {canDrag && (
          <p className="text-xs text-gray-500">
            {reorderMode === 'bulk'
              ? 'גרור — השינויים יישמרו בלחיצה על "שמור סדר"'
              : 'גרור כדי לשנות סדר'}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item, indexInType) => (
          <ImageThumbnail
            key={item.id}
            item={item}
            projectTitle={project.title}
            indexInType={indexInType}
            reorderable={reorderable}
            showDragHandle={canDrag}
            isDeleting={deletingIds.has(item.id)}
            isDragging={isActiveSection && dragState?.fromIndex === indexInType}
            isDropTarget={isActiveSection && dropTargetIndex === indexInType}
            onDelete={() => onDelete(item)}
            onDragStart={() => {
              if (canDrag) onDragStart(type as ReorderableType, indexInType);
            }}
            onDragOver={() => {
              if (isActiveSection) onDragOver(indexInType);
            }}
            onDrop={() => {
              if (canDrag) onDrop(type as ReorderableType, indexInType);
            }}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </section>
  );
}

interface ProjectImagesManagerProps {
  project: ProjectResponse | null;
  onClose: () => void;
}

export function ProjectImagesManager({ project, onClose }: ProjectImagesManagerProps) {
  const { uploadImages, deleteMainImage, deleteProjectImages, reorderImages } =
    useAdminProjects();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedType, setSelectedType] =
    useState<ProjectImageMultipartUploadType>('IMAGE');
  const [error, setError] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [dragState, setDragState] = useState<{
    type: ReorderableType;
    fromIndex: number;
  } | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderMode, setReorderMode] = useState<ReorderMode>('bulk');
  const [draftMedia, setDraftMedia] = useState<ProjectMediaItem[]>([]);

  useEffect(() => {
    if (project) {
      setDraftMedia(sortProjectMedia(project.media));
    }
  }, [project?.id, project?.media]);

  const { uploading, handleFilesSelected } = useProjectImageUpload(fileInputRef, {
    project,
    selectedType,
    uploadImages,
    setError,
  });

  const uploadBlocked = uploading || isReordering;

  const hasPendingBulkReorder =
    reorderMode === 'bulk' &&
    project !== null &&
    !isSameMediaOrder(draftMedia, project.media);

  const displayMedia =
    reorderMode === 'bulk' ? draftMedia : sortProjectMedia(project?.media ?? []);

  const applyLocalReorderMove = useCallback(
    (media: ProjectMediaItem[], type: ReorderableType, fromIndex: number, toIndex: number) => {
      const imageIds = buildFullReorderIdsFromMove(media, type, fromIndex, toIndex);
      if (!imageIds) return media;
      return applyMediaIdOrder(media, imageIds);
    },
    [],
  );

  const handleReorderModeChange = useCallback(
    (useBulk: boolean) => {
      const nextMode: ReorderMode = useBulk ? 'bulk' : 'immediate';
      if (nextMode === reorderMode) return;

      if (
        reorderMode === 'bulk' &&
        project &&
        !isSameMediaOrder(draftMedia, project.media)
      ) {
        setError('שמור או בטל שינויי סדר לפני החלפת מצב שמירה');
        return;
      }

      setError(null);
      setReorderMode(nextMode);
    },
    [draftMedia, project, reorderMode],
  );

  const handleDiscardBulkReorder = useCallback(() => {
    if (!project) return;
    setDraftMedia(sortProjectMedia(project.media));
    setError(null);
  }, [project]);

  const handleSaveBulkReorder = useCallback(async () => {
    if (!project || !hasPendingBulkReorder) return;

    setError(null);
    setIsReordering(true);

    try {
      await reorderImages({
        id: project.id,
        imageIds: getMediaIdOrder(draftMedia),
      });
    } catch (err) {
      const app = transformError(err);
      setError(getClientErrorMessage(app.errorKey as ErrorKey));
    } finally {
      setIsReordering(false);
    }
  }, [draftMedia, hasPendingBulkReorder, project, reorderImages]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!uploadBlocked) handleFilesSelected(e.dataTransfer.files);
    },
    [handleFilesSelected, uploadBlocked],
  );

  const handleDelete = useCallback(
    async (item: ProjectMediaItem) => {
      if (!project) return;
      setError(null);
      setDeletingIds((prev) => new Set(prev).add(item.id));

      try {
        if (item.type === 'MAIN') {
          await deleteMainImage({ id: project.id });
        } else {
          await deleteProjectImages({ id: project.id, imageIds: [item.id] });
        }
      } catch (err) {
        const app = transformError(err);
        setError(getClientErrorMessage(app.errorKey as ErrorKey));
      } finally {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }
    },
    [project, deleteMainImage, deleteProjectImages],
  );

  const handleReorderMove = useCallback(
    async (type: ReorderableType, fromIndex: number, toIndex: number) => {
      if (!project || fromIndex === toIndex) return;

      if (reorderMode === 'bulk') {
        setDraftMedia((current) => applyLocalReorderMove(current, type, fromIndex, toIndex));
        return;
      }

      const imageIds = buildFullReorderIdsFromMove(
        project.media,
        type,
        fromIndex,
        toIndex,
      );
      if (!imageIds) return;

      setError(null);
      setIsReordering(true);

      try {
        await reorderImages({ id: project.id, imageIds });
      } catch (err) {
        const app = transformError(err);
        setError(getClientErrorMessage(app.errorKey as ErrorKey));
      } finally {
        setIsReordering(false);
      }
    },
    [applyLocalReorderMove, project, reorderImages, reorderMode],
  );

  const handleDragEnd = useCallback(() => {
    setDragState(null);
    setDropTargetIndex(null);
  }, []);

  const safeClose = useCallback(() => {
    if (uploadBlocked) return;
    if (hasPendingBulkReorder) {
      setError('יש שינויי סדר שלא נשמרו. שמור, בטל, או המשך לערוך.');
      return;
    }
    onClose();
  }, [hasPendingBulkReorder, onClose, uploadBlocked]);

  if (!project) return null;

  const hasMedia = displayMedia.length > 0;

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
            disabled={uploadBlocked}
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

        <ImageUploadZone
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          uploading={uploading}
          disabled={uploadBlocked}
          onDrop={handleDrop}
          onBrowseClick={() => fileInputRef.current?.click()}
        />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_MIME_TYPES}
          onChange={(e) => handleFilesSelected(e.target.files)}
          className="hidden"
        />

        {!hasMedia ? (
          <p className="py-8 text-center text-sm text-gray-500">אין תמונות</p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <Checkbox
                id="project-images-bulk-reorder"
                label="שמירת סדר מרוכזת (גרור מספר פעמים, שמור פעם אחת)"
                checked={reorderMode === 'bulk'}
                onChange={(e) => handleReorderModeChange(e.target.checked)}
                disabled={uploadBlocked}
              />
              {hasPendingBulkReorder && (
                <span className="text-xs font-medium text-amber-700">
                  יש שינויי סדר שלא נשמרו
                </span>
              )}
            </div>
            <div className="relative space-y-6">
            {isReordering && (
              <div
                className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60"
                aria-live="polite"
              >
                <span className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
                  <i className="fa-solid fa-spinner fa-spin" aria-hidden />
                  שומר סדר...
                </span>
              </div>
            )}
            {MEDIA_SECTIONS.map(({ type, title, reorderable }) => (
              <MediaSection
                key={type}
                type={type}
                title={title}
                reorderable={reorderable}
                items={getMediaByType(displayMedia, type)}
                project={project}
                deletingIds={deletingIds}
                dragState={dragState}
                dropTargetIndex={dropTargetIndex}
                reorderMode={reorderMode}
                onDelete={(item) => void handleDelete(item)}
                onDragStart={(sectionType, index) => {
                  setDragState({ type: sectionType, fromIndex: index });
                }}
                onDragOver={setDropTargetIndex}
                onDrop={(sectionType, toIndex) => {
                  if (dragState?.type === sectionType) {
                    void handleReorderMove(
                      sectionType,
                      dragState.fromIndex,
                      toIndex,
                    );
                  }
                  handleDragEnd();
                }}
                onDragEnd={handleDragEnd}
              />
            ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {hasPendingBulkReorder && (
            <>
              <Button
                variant="light"
                onClick={handleDiscardBulkReorder}
                disabled={uploadBlocked}
              >
                בטל שינויים
              </Button>
              <Button
                variant="primary"
                onClick={() => void handleSaveBulkReorder()}
                disabled={uploadBlocked}
              >
                שמור סדר
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={safeClose} disabled={uploadBlocked}>
            סגור
          </Button>
        </div>
      </div>
    </Modal>
  );
}
