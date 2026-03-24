import { Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import type { CategoryResponse, CreateProjectInput } from '@shirans/shared';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';

export interface ProjectFormFieldsProps {
  form: UseFormReturn<CreateProjectInput>;
  categories: CategoryResponse[];
  formError: string | null;
}

export function ProjectFormFields({
  form,
  categories,
  formError,
}: ProjectFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <>
      <Input
        id="project-form-title"
        label="כותרת"
        type="text"
        {...register('title')}
        error={errors.title}
      />
      <Input
        id="project-form-description"
        as="textarea"
        label="תיאור"
        rows={4}
        {...register('description')}
        error={errors.description}
      />
      <Input
        id="project-form-location"
        label="מיקום"
        type="text"
        {...register('location')}
        error={errors.location}
      />
      <Input
        id="project-form-client"
        label="לקוח"
        type="text"
        {...register('client')}
        error={errors.client}
      />
      <Input
        id="project-form-construction-area"
        label='שטח בנייה (מ"ר)'
        type="number"
        min={1}
        {...register('constructionArea', { valueAsNumber: true })}
        error={errors.constructionArea}
      />
      <div className="flex flex-wrap items-center gap-6">
        <Checkbox
          id="project-form-is-completed"
          label="הושלם"
          {...register('isCompleted')}
        />
        <Checkbox
          id="project-form-favourite"
          label="מועדף"
          {...register('favourite')}
        />
      </div>
      <fieldset className="min-w-0 border-0 p-0">
        <legend className="mb-2 block text-sm font-bold text-dark">קטגוריות</legend>
        <Controller
          control={control}
          name="categoryIds"
          render={({ field }) => {
            const value = field.value ?? [];
            return (
              <div className="flex flex-wrap gap-4">
                {categories.map((cat) => (
                  <Checkbox
                    key={cat.id}
                    id={`project-form-cat-${cat.id}`}
                    label={cat.title}
                    name={field.name}
                    checked={value.includes(cat.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange([...value, cat.id]);
                      } else {
                        field.onChange(value.filter((id) => id !== cat.id));
                      }
                    }}
                    onBlur={field.onBlur}
                    aria-describedby={
                      errors.categoryIds ? 'categoryIds-error' : undefined
                    }
                  />
                ))}
              </div>
            );
          }}
        />
        {errors.categoryIds && (
          <p id="categoryIds-error" className="mt-1 text-sm text-red-500">
            {errors.categoryIds.message}
          </p>
        )}
      </fieldset>
      {formError && (
        <p className="text-sm text-red-500" role="alert">
          {formError}
        </p>
      )}
    </>
  );
}
