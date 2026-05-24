import { useCallback, useMemo, useState } from 'react';
import { useAdminProjects } from '@/hooks/admin/useAdminProjects';
import { useAdminCategories } from '@/hooks/admin/useAdminCategories';
import { AdminPageHeader } from '@/components/Admin/AdminPageHeader';
import { DataTable } from '@/components/Admin/DataTable';
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog';
import { DataStateGuard } from '@/components/DataState';
import { ProjectImagesManager } from '@/components/Admin/ProjectImagesManager';
import { ProjectFormModal } from '@/components/Admin/ProjectFormModal';
import { getProjectColumns } from '@/components/Admin/ProjectColumns';
import Button from '@/components/ui/Button';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { transformError } from '@/utils/errorHandler';
import type { ProjectResponse } from '@shirans/shared';

export default function ProjectsManagement() {
  const {
    projects,
    isLoading,
    error,
    update,
    delete: deleteProject,
    refresh,
  } = useAdminProjects();
  const { categories } = useAdminCategories();

  const [modalOpen, setModalOpen] = useState(false);
  /** `null` while modal open = create mode; id = edit that project */
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [imagesTargetId, setImagesTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingFavouriteId, setPendingFavouriteId] = useState<string | null>(null);
  const [pendingCompletedId, setPendingCompletedId] = useState<string | null>(null);
  const [rowActionError, setRowActionError] = useState<string | null>(null);

  const formProject =
    modalOpen && editingProjectId
      ? (projects.find((p) => p.id === editingProjectId) ?? null)
      : null;

  const deleteTarget = deleteTargetId
    ? (projects.find((p) => p.id === deleteTargetId) ?? null)
    : null;

  const imagesTarget = imagesTargetId
    ? (projects.find((p) => p.id === imagesTargetId) ?? null)
    : null;

  const handleOpenCreate = () => {
    setEditingProjectId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: ProjectResponse) => {
    setEditingProjectId(p.id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProjectId(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteTarget.id);
      setDeleteTargetId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFavourite = useCallback(
    async (p: ProjectResponse) => {
      setRowActionError(null);
      setPendingFavouriteId(p.id);
      try {
        await update({
          id: p.id,
          favourite: !p.favourite,
        });
      } catch (err) {
        setRowActionError(getClientErrorMessage(transformError(err).errorKey));
      } finally {
        setPendingFavouriteId(null);
      }
    },
    [update],
  );

  const handleToggleCompleted = useCallback(
    async (p: ProjectResponse) => {
      setRowActionError(null);
      setPendingCompletedId(p.id);
      try {
        await update({
          id: p.id,
          isCompleted: !p.isCompleted,
        });
      } catch (err) {
        setRowActionError(getClientErrorMessage(transformError(err).errorKey));
      } finally {
        setPendingCompletedId(null);
      }
    },
    [update],
  );

  const columns = useMemo(
    () =>
      getProjectColumns(categories, handleToggleFavourite, handleToggleCompleted, {
        favouriteId: pendingFavouriteId,
        completedId: pendingCompletedId,
      }),
    [
      categories,
      handleToggleFavourite,
      handleToggleCompleted,
      pendingFavouriteId,
      pendingCompletedId,
    ],
  );


  return (
    <div dir="rtl">
      <DataStateGuard
        data={projects}
        isLoading={isLoading}
        error={error}
        emptyMessage="אין פרויקטים"
        onRetry={refresh}
        loadingMinHeight="20rem"
      >
        {(data) => (
          <>
            <AdminPageHeader
              title="ניהול פרויקטים"
              actionLabel="הוסף פרויקט"
              onAction={handleOpenCreate}
            />
            {rowActionError && (
              <div
                className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                role="alert"
              >
                {rowActionError}
              </div>
            )}
            <DataTable
              columns={columns}
              data={data}
              isLoading={false}
              emptyMessage="אין פרויקטים"
              getRowId={(row) => row.id}
              actions={(row) => (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="info"
                    onClick={() => setImagesTargetId(row.id)}
                    className="!rounded-lg !px-3 !py-1.5 text-sm font-medium"
                    ariaLabel={`תמונות ${row.title}`}
                  >
                    תמונות
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleOpenEdit(row)}
                    className="!rounded-lg !px-3 !py-1.5 text-sm font-medium"
                    ariaLabel={`ערוך ${row.title}`}
                  >
                    עריכה
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => setDeleteTargetId(row.id)}
                    className="!rounded-lg !px-3 !py-1.5 text-sm font-medium"
                    ariaLabel={`מחק ${row.title}`}
                  >
                    מחיקה
                  </Button>
                </div>
              )}
            />
          </>
        )}
      </DataStateGuard>
      <ProjectFormModal
        open={modalOpen}
        project={formProject}
        onClose={handleCloseModal}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="מחיקת פרויקט"
        message={
          deleteTarget
            ? `האם אתה בטוח שברצונך למחוק את הפרויקט "${deleteTarget.title}"?`
            : ''
        }
        confirmLabel="מחק"
        isLoading={isDeleting}
      />
      <ProjectImagesManager
        project={imagesTarget}
        onClose={() => setImagesTargetId(null)}
      />
    </div>
  );
}
