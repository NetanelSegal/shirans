import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAdminProjects } from '@/hooks/admin/useAdminProjects';
import { useAdminCategories } from '@/hooks/admin/useAdminCategories';
import { AdminPageHeader } from '@/components/Admin/AdminPageHeader';
import { DataTable } from '@/components/Admin/DataTable';
import { FormModal } from '@/components/Admin/FormModal';
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog';
import { DataStateGuard } from '@/components/DataState';
import type {
  ProjectResponse,
  CreateProjectInput,
  UpdateProjectInput,
} from '@shirans/shared';
import { createProjectSchema, updateProjectSchema } from '@shirans/shared';

export default function ProjectsManagement() {
  const {
    projects,
    isLoading,
    error,
    create,
    update,
    delete: deleteProject,
    refresh,
  } = useAdminProjects();
  const { categories } = useAdminCategories();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ProjectResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const createForm = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema) as never,
    defaultValues: {
      title: '',
      description: '',
      location: '',
      client: '',
      constructionArea: 1,
      isCompleted: false,
      favourite: false,
      categoryIds: [],
      images: [],
    },
  });

  const updateForm = useForm<UpdateProjectInput>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      id: '',
      title: '',
      description: '',
      location: '',
      client: '',
      constructionArea: 0,
      isCompleted: false,
      favourite: false,
      categoryIds: [],
    },
  });

  const getCategoryTitles = (project: ProjectResponse) => {
    return (project.categories ?? [])
      .map((urlCode) => categories.find((c) => c.urlCode === urlCode)?.title)
      .filter(Boolean)
      .join(', ') || '-';
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormError(null);
    createForm.reset({
      title: '',
      description: '',
      location: '',
      client: '',
      constructionArea: 1,
      isCompleted: false,
      favourite: false,
      categoryIds: categories.length > 0 ? [categories[0].id] : [],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: ProjectResponse) => {
    setEditingProject(p);
    setFormError(null);
    const categoryIds = (p.categories ?? [])
      .map((urlCode) => categories.find((c) => c.urlCode === urlCode)?.id)
      .filter((id): id is string => !!id);
    updateForm.reset({
      id: p.id,
      title: p.title,
      description: p.description,
      location: p.location,
      client: p.client,
      constructionArea: p.constructionArea,
      isCompleted: p.isCompleted,
      favourite: p.favourite,
      categoryIds: categoryIds.length > 0 ? categoryIds : [categories[0]?.id].filter(Boolean),
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProject(null);
    setFormError(null);
  };

  const onSubmitCreate = createForm.handleSubmit(async (data: CreateProjectInput) => {
    setFormError(null);
    try {
      await create(data);
      handleCloseModal();
    } catch (err) {
      setFormError((err as Error)?.message ?? 'שגיאה בשמירה');
    }
  });

  const onSubmitUpdate = updateForm.handleSubmit(async (data) => {
    if (!editingProject) return;
    setFormError(null);
    try {
      await update(data);
      handleCloseModal();
    } catch (err) {
      setFormError((err as Error)?.message ?? 'שגיאה בשמירה');
    }
  });

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

  const handleToggleFavourite = async (p: ProjectResponse) => {
    await update({
      id: p.id,
      favourite: !p.favourite,
    });
  };

  const handleToggleCompleted = async (p: ProjectResponse) => {
    await update({
      id: p.id,
      isCompleted: !p.isCompleted,
    });
  };

  const columns = [
    {
      key: 'title',
      header: 'כותרת',
      render: (row: ProjectResponse) => row.title,
    },
    {
      key: 'location',
      header: 'מיקום',
      render: (row: ProjectResponse) => row.location,
    },
    {
      key: 'categories',
      header: 'קטגוריות',
      render: (row: ProjectResponse) => getCategoryTitles(row),
    },
    {
      key: 'favourite',
      header: 'מועדף',
      render: (row: ProjectResponse) => (
        <button
          type="button"
          onClick={() => handleToggleFavourite(row)}
          className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
            row.favourite ? 'bg-amber-400 text-black' : 'bg-gray-200 text-gray-600'
          }`}
          aria-label={row.favourite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
        >
          <i className="fa-solid fa-star" aria-hidden />
        </button>
      ),
    },
    {
      key: 'isCompleted',
      header: 'הושלם',
      render: (row: ProjectResponse) => (
        <button
          type="button"
          onClick={() => handleToggleCompleted(row)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            row.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          aria-label={row.isCompleted ? 'סמן כלא הושלם' : 'סמן כהושלם'}
        >
          {row.isCompleted ? 'כן' : 'לא'}
        </button>
      ),
    },
  ];

  type ProjectFormType = ReturnType<typeof useForm<CreateProjectInput>>;
  const ProjectFormFields = ({ form }: { form: ProjectFormType }) => (
    <>
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          כותרת
        </label>
        <input
          id="title"
          type="text"
          {...form.register('title')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          aria-invalid={!!form.formState.errors.title}
        />
        {form.formState.errors.title && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          תיאור
        </label>
        <textarea
          id="description"
          rows={4}
          {...form.register('description')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          aria-invalid={!!form.formState.errors.description}
        />
        {form.formState.errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="location" className="mb-1 block text-sm font-medium">
          מיקום
        </label>
        <input
          id="location"
          type="text"
          {...form.register('location')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          aria-invalid={!!form.formState.errors.location}
        />
        {form.formState.errors.location && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.location.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="client" className="mb-1 block text-sm font-medium">
          לקוח
        </label>
        <input
          id="client"
          type="text"
          {...form.register('client')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          aria-invalid={!!form.formState.errors.client}
        />
        {form.formState.errors.client && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.client.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="constructionArea"
          className="mb-1 block text-sm font-medium"
        >
          שטח בנייה (מ"ר)
        </label>
        <input
          id="constructionArea"
          type="number"
          min={1}
          {...form.register('constructionArea', { valueAsNumber: true })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          aria-invalid={!!form.formState.errors.constructionArea}
        />
        {form.formState.errors.constructionArea && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.constructionArea.message}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            id="isCompleted"
            type="checkbox"
            {...form.register('isCompleted')}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="isCompleted" className="text-sm font-medium">
            הושלם
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="favourite"
            type="checkbox"
            {...form.register('favourite')}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="favourite" className="text-sm font-medium">
            מועדף
          </label>
        </div>
      </div>
      <div>
        <span className="mb-2 block text-sm font-medium">קטגוריות</span>
        <Controller
          control={form.control}
          name="categoryIds"
          render={({ field }) => {
            const value = field.value ?? [];
            return (
              <div className="flex flex-wrap gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <input
                      id={`cat-${cat.id}`}
                      type="checkbox"
                      checked={value.includes(cat.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...value, cat.id]);
                        } else {
                          field.onChange(value.filter((id) => id !== cat.id));
                        }
                      }}
                      className="h-4 w-4 rounded"
                      aria-describedby={
                        form.formState.errors.categoryIds
                          ? 'categoryIds-error'
                          : undefined
                      }
                    />
                    <label htmlFor={`cat-${cat.id}`} className="text-sm">
                      {cat.title}
                    </label>
                  </div>
                ))}
              </div>
            );
          }}
        />
        {form.formState.errors.categoryIds && (
          <p id="categoryIds-error" className="mt-1 text-sm text-red-600">
            {form.formState.errors.categoryIds.message}
          </p>
        )}
      </div>
      {formError && (
        <p className="text-sm text-red-600" role="alert">
          {formError}
        </p>
      )}
    </>
  );

  const renderProjectForm = () => {
    if (editingProject) {
      return (
        <FormModal
          open={modalOpen}
          onClose={handleCloseModal}
          title="עריכת פרויקט"
          onSubmit={onSubmitUpdate}
          isSubmitting={updateForm.formState.isSubmitting}
        >
          <ProjectFormFields form={updateForm as unknown as ProjectFormType} />
        </FormModal>
      );
    }
    return (
      <FormModal
        open={modalOpen}
        onClose={handleCloseModal}
        title="הוספת פרויקט"
        onSubmit={onSubmitCreate}
        isSubmitting={createForm.formState.isSubmitting}
      >
        <ProjectFormFields form={createForm} />
      </FormModal>
    );
  };

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
      {renderProjectForm()}
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
    </div>
  );
}
