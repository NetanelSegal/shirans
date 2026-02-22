# Don't Forget — Recurring Patterns

Quick reference for patterns that should be used consistently to avoid regressions.

---

## DataState Components (Loading, Error, Empty)

**Always use DataState components** for pages that fetch data. Do not use custom `Loader` or ad-hoc error/empty UI.

### File Locations

- **Components:** `client/src/components/DataState/`
  - `LoadingState.tsx` — loading spinner with optional `minHeight`
  - `ErrorState.tsx` — error message with optional `onRetry`
  - `EmptyState.tsx` — empty list message
  - `DataStateGuard.tsx` — combines loading, error, empty, and success in one wrapper
- **Exports:** `client/src/components/DataState/index.ts`

### When to Use What

| Scenario | Component | Example |
|----------|-----------|---------|
| Single data source (list page) | `DataStateGuard` | Projects list, admin CRUD tables |
| Multiple data sources (dashboard) | `LoadingState` + `ErrorState` | Admin Overview |
| Custom layout with data | `DataStateGuard` with render prop | `Projects.tsx` |

### DataStateGuard Usage

```tsx
import { DataStateGuard } from '@/components/DataState';

<DataStateGuard
  data={items}
  isLoading={isLoading}
  error={error}
  emptyMessage="אין פריטים להצגה"
  onRetry={refresh}
  loadingMinHeight="20rem"
>
  {(data) => (
    <>
      <AdminPageHeader ... />
      <DataTable data={data} isLoading={false} ... />
    </>
  )}
</DataStateGuard>
```

**Reference:** `client/src/pages/Projects/Projects.tsx` (lines 50–68), `client/src/pages/Admin/ProjectsManagement.tsx`

### LoadingState + ErrorState (Multiple Sources)

```tsx
import { LoadingState, ErrorState } from '@/components/DataState';

if (error) return <ErrorState message={error} onRetry={refresh} />;
if (isLoading) return <LoadingState minHeight="20rem" />;
```

**Reference:** `client/src/pages/Admin/Overview.tsx`

---

## Padding — Do NOT Use on Admin Dashboard

**Do not use** `px-page-all` or `py-section-all` on admin dashboard containers. These utilities scale up to `20rem` at 2xl breakpoint and cause layout issues in the admin panel.

### Definitions (for reference)

- **File:** `client/src/index.css` (lines 26–35)
- **Tailwind spacing:** `client/tailwind.config.js` — `page-sm` (1rem) through `page-2xl` (20rem)
- `.px-page-all` = responsive horizontal padding from 1rem to 20rem
- `.py-section-all` = responsive vertical padding

### Admin Layout Padding

- **Admin main content:** `client/src/components/Admin/AdminLayout.tsx` — `main` has `p-6` only
- **Do not add** `px-page-all`, `py-section-all`, or extra `p-6` on admin page wrappers

### Where These Utilities Belong

- **Public pages:** `Layout.tsx`, `Navbar.tsx`, `Footer.tsx`, `HeroSection.tsx`, `Project.tsx` — use `px-page-all` / `py-section-all` as needed for public site layout
- **Admin pages:** Rely on `AdminLayout`'s `p-6` on `main`; no additional page-level padding

**Reference:** `client/src/components/Admin/AdminLayout.tsx` (line 129), `client/src/index.css` (lines 26–32)

---

## Types — Use Shared, Never Duplicate

**Never define types in the client** that already exist in `@shirans/shared`. Always import from shared.

### Shared Package Exports

- **Schemas & inferred types:** `shared/src/schemas/` — `CreateProjectInput`, `UpdateProjectInput`, `CreateCategoryInput`, `UpdateCategoryInput`, `CreateTestimonialInput`, `UpdateTestimonialInput`, etc.
- **Response types:** `shared/src/types/responses.types.ts` — `ProjectResponse`, `CategoryResponse`, `TestimonialResponse`, `ContactResponse`, `UserResponse`
- **Common types:** `shared/src/types/common.types.ts` — `UserRole`, `ResponsiveImage`, `CategoryUrlCode`
- **Error types:** `shared/src/types/error.types.ts` — `ApiErrorResponse`

### When to Use What

| Need | Import from shared |
|------|-------------------|
| Form data for create/update | `CreateProjectInput`, `UpdateProjectInput`, `CreateCategoryInput`, etc. |
| API response shapes | `ProjectResponse`, `TestimonialResponse`, etc. |
| Subset of response | `Pick<TestimonialResponse, 'name' \| 'message'>` |
| Zod schemas | `createProjectSchema`, `updateProjectSchema`, etc. |

### Anti-pattern (Don't Do)

```ts
// ❌ Duplicate - type already exists in shared
type CreateFormData = z.infer<typeof createProjectSchema>;
type FormData = { name: string; message: string };
interface ITestimonial { name: string; message: string; }
```

### Correct Pattern

```ts
// ✅ Import from shared
import type { CreateProjectInput, TestimonialResponse } from '@shirans/shared';
// For subsets: Pick<TestimonialResponse, 'name' | 'message'>
```

**Reference:** `shared/src/index.ts` (exports), `client/src/pages/Admin/ProjectsManagement.tsx`
