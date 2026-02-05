---
name: form-management
description: Guidelines for form state management, validation, and error handling using React Hook Form. This rule should be applied when implementing or refactoring any form in the frontend application.
alwaysApply: true
---

# Form Management Best Practices (React Hook Form)

## Overview

For robust and efficient form management in React applications, we utilize `react-hook-form`. It provides excellent performance by minimizing re-renders, simplifies validation with schema-based approaches (e.g., Zod), and offers a clean API for handling form state and submissions.

## When to Apply

- When creating any new form in the frontend application (create, edit, search forms, etc.).
- When refactoring existing forms to improve performance, maintainability, or validation.
- When implementing complex validation logic.

## Core Principles

1.  **Use `useForm` hook**: Always initialize forms using the `useForm` hook for state management.
2.  **Schema-based Validation**: Integrate with validation libraries like Zod for defining clear and reusable validation schemas.
3.  **Single Source of Truth for Schemas/Types**: If a type or Zod schema is used in both frontend and backend (e.g., for API request/response validation), it MUST be defined in the `shared` folder.
4.  **`Controller` for controlled components**: Use the `Controller` component for integrating third-party controlled components (e.g., custom select, date pickers).
5.  **`register` for native inputs**: Directly register native HTML inputs (e.g., `input`, `select`, `textarea`) with `register`.
6.  **Display Error Messages**: Always display clear and user-friendly error messages for validation failures.
7.  **Handle Submission State**: Disable submit buttons during form submission and show loading indicators.
8.  **Reset Forms**: Ensure forms are reset appropriately after successful submission or cancellation.

## Installation

```bash
npm install react-hook-form
# If using with Zod for validation
npm install @hookform/resolvers zod
```

## Basic Usage

### 1. Simple Form with Native Inputs

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
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" {...register('name')} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" {...register('email')} />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

### 2. Form with Controlled Components (e.g., Custom Select)

```tsx
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Assume CustomSelect is a component that takes `value` and `onChange` props
// interface CustomSelectProps { value: string; onChange: (value: string) => void; options: { label: string; value: string }[] }
// const CustomSelect = ({ value, onChange, options }: CustomSelectProps) => { /* ... */ };

const schema = z.object({
  selection: z.string().min(1, 'Selection is required'),
});

type FormData = z.infer<typeof schema>;

function MyFormWithControlled() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { selection: '' },
  });

  const onSubmit = (data: FormData) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="selection">Select Option</label>
        <Controller
          name="selection"
          control={control}
          render={({ field }) => (
            <CustomSelect
              {...field}
              options={[
                { label: 'Option A', value: 'A' },
                { label: 'Option B', value: 'B' },
              ]}
            />
          )}
        />
        {errors.selection && <p className="text-red-500">{errors.selection.message}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

## Styling and Accessibility

- Integrate error messages directly below the input field.
- Use `aria-invalid` attribute for invalid fields.
- Ensure proper `label` association with `htmlFor` and `id`.
- Disable submit buttons using `formState.isSubmitting` or `!formState.isValid` when appropriate.

## Example File Structure

```
client/
└── src/
    └── components/
        └── forms/
            ├── MyForm.tsx           # Example form component
            └── inputs/
                └── CustomSelect.tsx # Reusable controlled input
    └── hooks/
        └── useAuthForm.ts           # Custom hook for auth forms (optional)
    └── validators/
        └── schemas.ts               # Centralized Zod schemas
```

## Key Benefits

- **Performance**: Minimizes re-renders by isolating re-renders to only the components that are subscribed to state changes.
- **Developer Experience**: Simple API, easy to integrate with various UI libraries.
- **Validation**: Flexible validation with support for schema-based approaches (Zod, Yup, etc.).
- **Accessibility**: Built-in features and guidance for creating accessible forms.
