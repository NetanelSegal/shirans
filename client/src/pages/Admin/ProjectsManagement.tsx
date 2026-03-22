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
  const [formProject, setFormProject] = useState<ProjectResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectResponse | null>(null);
  const [imagesTarget, setImagesTarget] = useState<ProjectResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenCreate = () => {
    setFormProject(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: ProjectResponse) => {
    setFormProject(p);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormProject(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFavourite = useCallback(
    async (p: ProjectResponse) => {
      await update({
        id: p.id,
        favourite: !p.favourite,
      });
    },
    [update],
  );

  const handleToggleCompleted = useCallback(
    async (p: ProjectResponse) => {
      await update({
        id: p.id,
        isCompleted: !p.isCompleted,
      });
    },
    [update],
  );

  const columns = useMemo(
    () =>
      getProjectColumns(categories, handleToggleFavourite, handleToggleCompleted),
    [categories, handleToggleFavourite, handleToggleCompleted],
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
                    onClick={() => setImagesTarget(row)}
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
                    onClick={() => setDeleteTarget(row)}
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
        onClose={() => setDeleteTarget(null)}
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
        onClose={() => setImagesTarget(null)}
      />
    </div>
  );
}
