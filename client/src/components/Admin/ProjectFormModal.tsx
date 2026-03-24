import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Resolver, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema, updateProjectSchema } from '@shirans/shared';
import type {
  CreateProjectInput,
  ProjectResponse,
  UpdateProjectInput,
} from '@shirans/shared';
import { useAdminProjects } from '@/hooks/admin/useAdminProjects';
import { useAdminCategories } from '@/hooks/admin/useAdminCategories';
import { FormModal } from '@/components/Admin/FormModal';
import { ProjectFormFields } from '@/components/Admin/ProjectFormFields';

export interface ProjectFormModalProps {
  open: boolean;
  /** `null` = create mode; otherwise edit this project */
  project: ProjectResponse | null;
  onClose: () => void;
}

export function ProjectFormModal({ open, project, onClose }: ProjectFormModalProps) {
  const { create, update } = useAdminProjects();
  const { categories } = useAdminCategories();
  const [formError, setFormError] = useState<string | null>(null);

  const isEditing = project !== null;

  const createForm = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema) as Resolver<CreateProjectInput>,
    defaultValues: {
      title: '',
      description: '',
      location: '',
      client: '',
      constructionArea: 1,
      isCompleted: false,
      favourite: false,
      categoryIds: [],
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

  useEffect(() => {
    if (!open) {
      setFormError(null);
      return;
    }
    setFormError(null);
    if (!project) {
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
    } else {
      const categoryIds = (project.categories ?? [])
        .map((urlCode) => categories.find((c) => c.urlCode === urlCode)?.id)
        .filter((id): id is string => !!id);
      updateForm.reset({
        id: project.id,
        title: project.title,
        description: project.description,
        location: project.location,
        client: project.client,
        constructionArea: project.constructionArea,
        isCompleted: project.isCompleted,
        favourite: project.favourite,
        categoryIds:
          categoryIds.length > 0 ? categoryIds : [categories[0]?.id].filter(Boolean),
      });
    }
    // Intentionally sync only when modal opens / project / categories change; RHF methods are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, project, categories]);

  const handleClose = () => {
    setFormError(null);
    onClose();
  };

  const onSubmitCreate = createForm.handleSubmit(async (data: CreateProjectInput) => {
    setFormError(null);
    try {
      await create(data);
      handleClose();
    } catch (err) {
      setFormError((err as Error)?.message ?? 'שגיאה בשמירה');
    }
  });

  const onSubmitUpdate = updateForm.handleSubmit(async (data: UpdateProjectInput) => {
    setFormError(null);
    try {
      await update(data);
      handleClose();
    } catch (err) {
      setFormError((err as Error)?.message ?? 'שגיאה בשמירה');
    }
  });

  if (isEditing) {
    return (
      <FormModal
        open={open}
        onClose={handleClose}
        title="עריכת פרויקט"
        onSubmit={onSubmitUpdate}
        isSubmitting={updateForm.formState.isSubmitting}
      >
        <ProjectFormFields
          form={updateForm as unknown as UseFormReturn<CreateProjectInput>}
          categories={categories}
          formError={formError}
        />
      </FormModal>
    );
  }

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      title="הוספת פרויקט"
      onSubmit={onSubmitCreate}
      isSubmitting={createForm.formState.isSubmitting}
    >
      <ProjectFormFields
        form={createForm}
        categories={categories}
        formError={formError}
      />
    </FormModal>
  );
}
