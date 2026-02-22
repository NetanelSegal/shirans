import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAdminCategories } from '@/hooks/admin/useAdminCategories';
import { useAdminProjects } from '@/hooks/admin/useAdminProjects';
import { AdminPageHeader } from '@/components/Admin/AdminPageHeader';
import { DataTable } from '@/components/Admin/DataTable';
import { FormModal } from '@/components/Admin/FormModal';
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog';
import { DataStateGuard } from '@/components/DataState';
import type {
  CategoryResponse,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@shirans/shared';
import { createCategorySchema, updateCategorySchema } from '@shirans/shared';

const CATEGORY_URL_OPTIONS = [
  { value: 'privateHouses', label: 'בתים פרטיים' },
  { value: 'apartments', label: 'דירות' },
  { value: 'publicSpaces', label: 'חללים מסחריים' },
] as const;

export default function CategoriesManagement() {
  const {
    categories,
    isLoading,
    error,
    create,
    update,
    delete: deleteCategory,
    refresh,
  } = useAdminCategories();
  const { projects } = useAdminProjects();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<CategoryResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const createForm = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { title: '', urlCode: 'privateHouses' },
  });

  const updateForm = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: { title: '', urlCode: 'privateHouses' },
  });

  const getProjectCount = (urlCode: string) =>
    projects.filter((p) => p.categories?.includes(urlCode)).length;

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormError(null);
    createForm.reset({ title: '', urlCode: 'privateHouses' });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryResponse) => {
    setEditingCategory(cat);
    setFormError(null);
    updateForm.reset({ title: cat.title, urlCode: cat.urlCode });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setFormError(null);
  };

  const onSubmitCreate = createForm.handleSubmit(async (data) => {
    setFormError(null);
    try {
      await create(data);
      handleCloseModal();
    } catch (err) {
      setFormError((err as Error)?.message ?? 'שגיאה בשמירה');
    }
  });

  const onSubmitUpdate = updateForm.handleSubmit(async (data) => {
    if (!editingCategory) return;
    setFormError(null);
    try {
      await update(editingCategory.id, data);
      handleCloseModal();
    } catch (err) {
      setFormError((err as Error)?.message ?? 'שגיאה בשמירה');
    }
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'כותרת',
      render: (row: CategoryResponse) => row.title,
    },
    {
      key: 'urlCode',
      header: 'קוד URL',
      render: (row: CategoryResponse) => row.urlCode,
    },
    {
      key: 'projectCount',
      header: 'מספר פרויקטים',
      render: (row: CategoryResponse) => getProjectCount(row.urlCode),
    },
  ];

  const Form = editingCategory ? updateForm : createForm;
  const onSubmit = editingCategory ? onSubmitUpdate : onSubmitCreate;

  return (
    <div dir="rtl">
      <DataStateGuard
        data={categories}
        isLoading={isLoading}
        error={error}
        emptyMessage="אין קטגוריות"
        onRetry={refresh}
        loadingMinHeight="20rem"
      >
        {(data) => (
          <>
            <AdminPageHeader
              title="ניהול קטגוריות"
              actionLabel="הוסף קטגוריה"
              onAction={handleOpenCreate}
            />
            <DataTable
              columns={columns}
              data={data}
              isLoading={false}
              emptyMessage="אין קטגוריות"
              getRowId={(row) => row.id}
              actions={(row) => (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(row)}
                    className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                    aria-label={`ערוך ${row.title}`}
                  >
                    עריכה
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(row)}
                    className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
                    aria-label={`מחק ${row.title}`}
                  >
                    מחיקה
                  </button>
                </div>
              )}
            />
          </>
        )}
      </DataStateGuard>
      <FormModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'עריכת קטגוריה' : 'הוספת קטגוריה'}
        onSubmit={onSubmit}
        isSubmitting={Form.formState.isSubmitting}
      >
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            כותרת
          </label>
          <input
            id="title"
            type="text"
            {...Form.register('title')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            aria-invalid={!!Form.formState.errors.title}
          />
          {Form.formState.errors.title && (
            <p className="mt-1 text-sm text-red-600">
              {Form.formState.errors.title.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="urlCode" className="mb-1 block text-sm font-medium">
            קוד URL
          </label>
          <select
            id="urlCode"
            {...Form.register('urlCode')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            aria-invalid={!!Form.formState.errors.urlCode}
          >
            {CATEGORY_URL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {Form.formState.errors.urlCode && (
            <p className="mt-1 text-sm text-red-600">
              {Form.formState.errors.urlCode.message}
            </p>
          )}
        </div>
        {formError && (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}
      </FormModal>
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="מחיקת קטגוריה"
        message={
          deleteTarget
            ? `האם אתה בטוח שברצונך למחוק את "${deleteTarget.title}"? פרויקטים המשויכים לקטגוריה זו לא יימחקו.`
            : ''
        }
        confirmLabel="מחק"
        isLoading={isDeleting}
      />
    </div>
  );
}
