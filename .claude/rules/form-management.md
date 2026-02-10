# Form Management (React Hook Form)

## Core Rules

1. Always use `useForm` hook for form state management
2. Use Zod schemas with `@hookform/resolvers/zod` for validation
3. Shared Zod schemas/types (used by both client and server) go in `shared/` folder
4. Use `Controller` for third-party controlled components, `register` for native inputs
5. Always display error messages for validation failures
6. Disable submit buttons during submission (`formState.isSubmitting`)
7. Reset forms after successful submission or cancellation

## Basic Pattern

```tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} aria-invalid={!!errors.name} />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      <button type="submit" disabled={isSubmitting}>Submit</button>
    </form>
  );
}
```

## Accessibility

- Use `aria-invalid` on invalid fields
- Associate labels with `htmlFor`/`id`
- Display errors directly below the input field
