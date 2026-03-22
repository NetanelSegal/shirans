import { Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import type { CategoryResponse, CreateProjectInput } from '@shirans/shared';
import { Input } from '@/components/ui/Input';

export interface ProjectFormFieldsProps {
  /** Create form instance; for update flows cast from `UseFormReturn<UpdateProjectInput>` (same field UI). */
  form: UseFormReturn<CreateProjectInput>;
  categories: CategoryResponse[];
  formError: string | null;
}

const checkboxClass =
  'h-4 w-4 rounded border border-gray-200 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0';

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
        <div className="flex items-center gap-2">
          <input
            id="project-form-is-completed"
            type="checkbox"
            {...register('isCompleted')}
            className={checkboxClass}
          />
          <label htmlFor="project-form-is-completed" className="text-sm font-medium">
            הושלם
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="project-form-favourite"
            type="checkbox"
            {...register('favourite')}
            className={checkboxClass}
          />
          <label htmlFor="project-form-favourite" className="text-sm font-medium">
            מועדף
          </label>
        </div>
      </div>
      <div>
        <span className="mb-2 block text-sm font-medium text-dark">קטגוריות</span>
        <Controller
          control={control}
          name="categoryIds"
          render={({ field }) => {
            const value = field.value ?? [];
            return (
              <div className="flex flex-wrap gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <input
                      id={`project-form-cat-${cat.id}`}
                      type="checkbox"
                      checked={value.includes(cat.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...value, cat.id]);
                        } else {
                          field.onChange(value.filter((id) => id !== cat.id));
                        }
                      }}
                      className={checkboxClass}
                      aria-describedby={
                        errors.categoryIds ? 'categoryIds-error' : undefined
                      }
                    />
                    <label htmlFor={`project-form-cat-${cat.id}`} className="text-sm">
                      {cat.title}
                    </label>
                  </div>
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
      </div>
      {formError && (
        <p className="text-sm text-red-500" role="alert">
          {formError}
        </p>
      )}
    </>
  );
}
