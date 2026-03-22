import { Controller } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import type { CategoryResponse, CreateProjectInput } from '@shirans/shared';

export interface ProjectFormFieldsProps {
  /** Create form instance; for update flows cast from `UseFormReturn<UpdateProjectInput>` (same field UI). */
  form: UseFormReturn<CreateProjectInput>;
  categories: CategoryResponse[];
  formError: string | null;
}

export function ProjectFormFields({
  form,
  categories,
  formError,
}: ProjectFormFieldsProps) {
  return (
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
}
