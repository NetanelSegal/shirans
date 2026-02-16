# Plan: Admin Dashboard, User Pages, E2E Testing & Refactoring

## Context

The portfolio project has solid back print(new_s)
end APIs and auth infrastructure, but the admin dashboard UI is entirely placeholder. The contact form (EmailJS) is disconnected from the server/DB. Category and contact routes lack auth middleware. E2E test coverage is incomplete. This plan addresses all of these in a structured, incremental approach.

## Strategy

Work is split into **6 feature branches** (per CLAUDE.md: one task per branch). Each branch produces a working state. We'll create a `docs/todos/` directory with per-feature MD todo files as we go.

---

## Branch 1: `feature/server-fixes-and-refactoring`

**Goal**: Fix auth middleware, move testimonial schema to shared, fix Button component bug.

### 1.1 Fix auth middleware on category routes

- **File**: `server/src/routes/category.routes.ts`
- Uncomment `authenticate` and `requireAdmin` imports (lines 10-11)
- Replace unprotected POST/PUT/DELETE with auth-protected versions (lines 24, 28, 32)
- Keep GET routes public

### 1.2 Fix auth middleware on contact routes

- **File**: `server/src/routes/contact.routes.ts`
- Uncomment `authenticate` and `requireAdmin` imports (lines 10-11)
- Keep `POST /` public (line 17)
- Replace GET, PATCH, DELETE with auth-protected versions (lines 21, 25, 29, 33)

### 1.3 Move testimonial schemas to shared package

- **Create**: `shared/src/schemas/testimonial.schema.ts` (copy from `server/src/validators/testimonial.validators.ts`)
- **Edit**: `shared/src/index.ts` - add `export * from './schemas/testimonial.schema'`
- **Edit**: `server/src/controllers/testimonial.controller.ts` - update import to `@shirans/shared`
- Rebuild shared package

### 1.4 Fix Button component `onClick` not being passed through

- **File**: `client/src/components/ui/Button/Button.tsx` (line 23)
- Add `onClick` to destructured props and pass to `<button>` element

### Verification

- `cd server && npm run test` - all tests pass
- `cd server && npm run build` - no TypeScript errors
- `cd client && npm run build` - no TypeScript errors

---

## Branch 2: `feature/contact-form-api-integration`

**Goal**: Connect footer form to server API alongside EmailJS. Move EmailJS keys to env vars. Remove empty `/contact` route.

### 2.1 Move EmailJS config to environment variables

- **File**: `client/src/components/Footer/hooks/useEmailSend.tsx`
- Replace hardcoded `'service_qowi0kn'` -> `import.meta.env.VITE_EMAILJS_SERVICE_ID`
- Replace hardcoded `'shiran_contact_form'` -> `import.meta.env.VITE_EMAILJS_TEMPLATE_ID`
- Replace hardcoded `'6CI1z7b1xE3KIliQo'` -> `import.meta.env.VITE_EMAILJS_PUBLIC_KEY`
- Add these 3 vars to `.env` / `.env.example`

### 2.2 Create contact service

- **Create**: `client/src/services/contact.service.ts`
- Single function: `submitContact(data)` - POST to `urls.contact.submit`
- Maps footer form field `context` -> `message` for the API schema

### 2.3 Refactor FooterForm to dual-submit

- **File**: `client/src/components/Footer/components/FooterForm.tsx`
- On submit: call both `sendEmail(data)` and `submitContact(mappedData)` via `Promise.allSettled()`
- Primary: server API (data persistence). Secondary: EmailJS (email notification)
- Show success if at least one succeeds. Show error only if both fail.
- Reset form on success (currently missing - add `reset()` call)

### 2.4 Remove empty /contact route

- **File**: `client/src/App.tsx` (lines 60-63)
- Remove the `{ path: 'contact', ... }` entry from `appRoutes`

### Verification

- Submit footer form -> verify DB gets a ContactSubmission record AND email arrives
- `cd client && npm run build` - no errors

---

## Branch 3: `feature/admin-infrastructure`

**Goal**: Build all shared admin infrastructure - URL constants, API services, custom hooks, reusable UI components.

### 3.1 Extend URL constants

- **File**: `client/src/constants/urls.ts`
- Add admin endpoints for categories (create, update, delete), testimonials (getAll, create, getById, update, delete, updateOrder), contacts (getAll, getById, updateRead, delete)
- Keep existing entries intact, expand nested objects

### 3.2 Create admin API services

Each file uses `apiClient` (existing axios instance with auth interceptor):

| File                                                | Functions                                                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `client/src/services/admin/projects.service.ts`     | createProject, updateProject, deleteProject, uploadProjectImages, deleteMainImage, deleteProjectImages |
| `client/src/services/admin/categories.service.ts`   | fetchAllCategories, createCategory, updateCategory, deleteCategory                                     |
| `client/src/services/admin/testimonials.service.ts` | fetchAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, updateTestimonialOrder  |
| `client/src/services/admin/contacts.service.ts`     | fetchAllContacts, fetchContactById, updateContactReadStatus, deleteContact                             |

### 3.3 Create admin custom hooks

Pattern: `useState` + `useEffect` + CRUD callbacks (matches existing `ProjectsContext` pattern, no new deps).

| File                                             | Returns                                                                      |
| ------------------------------------------------ | ---------------------------------------------------------------------------- |
| `client/src/hooks/admin/useAdminProjects.ts`     | projects, isLoading, error, refresh, create, update, delete                  |
| `client/src/hooks/admin/useAdminCategories.ts`   | categories, isLoading, error, refresh, create, update, delete                |
| `client/src/hooks/admin/useAdminTestimonials.ts` | testimonials, isLoading, error, refresh, create, update, delete, updateOrder |
| `client/src/hooks/admin/useAdminContacts.ts`     | contacts, isLoading, error, refresh, updateReadStatus, delete                |

### 3.4 Create reusable admin UI components

All at `client/src/components/Admin/`:

| Component             | Purpose                                                                     |
| --------------------- | --------------------------------------------------------------------------- |
| `StatsCard.tsx`       | Stat count card with icon, title, count, optional onClick                   |
| `DataTable.tsx`       | Generic table with column config, loading state, empty message, row actions |
| `FormModal.tsx`       | Wraps existing `Modal` + form header/footer with submit/cancel              |
| `ConfirmDialog.tsx`   | Delete confirmation dialog (danger variant)                                 |
| `AdminPageHeader.tsx` | Page title + optional "Add new" action button                               |
| `StatusBadge.tsx`     | read/unread, published/draft badges                                         |

### Verification

- `cd client && npm run build` - no TypeScript errors
- `cd client && npm run lint` - no lint errors

---

## Branch 4: `feature/admin-dashboard-pages`

**Goal**: Build all 5 admin sub-pages and wire them into App.tsx routing.

### 4.1 Overview page (`client/src/pages/Admin/Overview.tsx`)

- 4 StatsCards in a grid: Projects, Categories, Testimonials, Unread Contacts
- Quick action buttons: "Add Project" -> `/admin/projects`, "View Contacts" -> `/admin/contacts`, "Add Testimonial" -> `/admin/testimonials`
- Uses all 4 admin hooks to fetch counts

### 4.2 Projects Management (`client/src/pages/Admin/ProjectsManagement.tsx`)

- DataTable: title, location, categories (tags), favourite (toggle), completed (toggle), actions (edit/delete)
- FormModal for create/edit using `createProjectSchema` / `updateProjectSchema`
- Form fields: title, description (textarea), location, client, constructionArea (number), isCompleted, favourite, categoryIds (checkboxes from fetched categories)
- Image management as a second step after create: URL input + type select (MAIN/IMAGE/PLAN/VIDEO) + order
- ConfirmDialog for delete

### 4.3 Categories Management (`client/src/pages/Admin/CategoriesManagement.tsx`)

- DataTable: title, urlCode, project count, actions
- FormModal with `createCategorySchema` / `updateCategorySchema`
- Fields: title, urlCode (select: privateHouses/apartments/publicSpaces)
- ConfirmDialog for delete (warn about associated projects)

### 4.4 Testimonials Management (`client/src/pages/Admin/TestimonialsManagement.tsx`)

- DataTable sorted by `order`: name, message (truncated), isPublished (StatusBadge), order, actions
- FormModal with `createTestimonialSchema`
- Fields: name, message (textarea), isPublished (checkbox), order (number)
- Up/down arrow buttons for reordering
- ConfirmDialog for delete

### 4.5 Contacts Management (`client/src/pages/Admin/ContactsManagement.tsx`)

- Filter tabs: All / Unread / Read
- DataTable: name, email, phone, message (truncated), isRead (StatusBadge), date, actions
- Click row -> expand to show full message
- Toggle read/unread button
- ConfirmDialog for delete
- No create/edit (contacts come from users)

### 4.6 Wire up App.tsx routing

- **File**: `client/src/App.tsx` (lines 100-121)
- Add lazy imports for all 5 pages
- Replace placeholder `<div>` elements with lazy-loaded components wrapped in `<Suspense>`

### Verification

- `cd client && npm run build` - no errors
- Manual test: login as admin, navigate all 5 admin pages
- CRUD operations work for each entity
- Contact read/unread toggle works

---

## Branch 5: `feature/e2e-tests`

**Goal**: Comprehensive E2E tests for all flows.

### 5.1 Server integration tests (Vitest)

Add missing test files in `server/test/integration/`:

| File                         | Coverage                                                                                                  |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| `category.routes.test.ts`    | GET all, GET by ID, POST (admin), PUT (admin), DELETE (admin), 401/403 auth checks                        |
| `testimonial.routes.test.ts` | GET all, GET published, POST (admin), PUT (admin), DELETE (admin), PATCH order (admin), auth checks       |
| `contact.routes.test.ts`     | POST submit (public), GET all (admin), GET by ID (admin), PATCH read (admin), DELETE (admin), auth checks |

### 5.2 E2E tests (Playwright)

Add/expand test files in `e2e/`:

| File                         | Flows Tested                                                                        |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| `contact-form.spec.ts`       | Submit footer form -> success message, validation errors, server saves submission   |
| `admin-auth.spec.ts`         | Non-admin redirected, admin can access dashboard, logout works                      |
| `admin-overview.spec.ts`     | Stats cards display correct counts, quick action navigation works                   |
| `admin-projects.spec.ts`     | List projects, create project, edit project, delete project, image management       |
| `admin-categories.spec.ts`   | List categories, create, edit, delete, validation errors                            |
| `admin-testimonials.spec.ts` | List testimonials, create, edit, delete, toggle published, reorder                  |
| `admin-contacts.spec.ts`     | List contacts, filter by read/unread, toggle read status, delete, view full message |
| `navigation.spec.ts`         | All public pages load, nav links work, 404 page works                               |

### Verification

- `cd server && npm run test` - all server tests pass
- `npm run test:e2e` - all E2E tests pass

---

## Branch 6: `feature/todo-docs`

**Goal**: Create per-feature MD todo files documenting best practices and remaining work.

### Files to create in `docs/todos/`:

- `admin-dashboard.md` - Admin pages status, patterns used, remaining improvements
- `contact-integration.md` - Contact flow architecture, EmailJS + API dual submit
- `e2e-testing.md` - Test coverage map, patterns, how to add new tests
- `refactoring-notes.md` - Items discovered during implementation

> **Note**: These files will be populated as we complete each branch, documenting decisions and patterns.

---

## Refactoring Items Discovered

| Issue                                              | Location                                                       | Fix                                              |
| -------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------ |
| Button `onClick` not passed to `<button>`          | `client/src/components/ui/Button/Button.tsx:23`                | Add onClick to destructured props (Branch 1)     |
| EmailJS keys hardcoded                             | `client/src/components/Footer/hooks/useEmailSend.tsx:21,22,40` | Move to env vars (Branch 2)                      |
| Footer form field `context` vs API field `message` | `shared/src/schemas/footer.schema.ts` vs `contact.schema.ts`   | Map fields in dual-submit handler (Branch 2)     |
| Category routes missing auth                       | `server/src/routes/category.routes.ts:24,28,32`                | Uncomment auth middleware (Branch 1)             |
| Contact routes missing auth                        | `server/src/routes/contact.routes.ts:21,25,29,33`              | Uncomment auth middleware (Branch 1)             |
| Testimonial schemas not in shared                  | `server/src/validators/testimonial.validators.ts`              | Move to `shared/src/schemas/` (Branch 1)         |
| Footer form never resets after success             | `client/src/components/Footer/components/FooterForm.tsx`       | Add `reset()` after successful submit (Branch 2) |

---

## Implementation Order

```
Branch 1 (server fixes & refactoring)
    |
    v
Branch 2 (contact form integration)
    |
    v
Branch 3 (admin infrastructure)
    |
    v
Branch 4 (admin pages)
    |
    v
Branch 5 (E2E tests)
    |
    v
Branch 6 (todo docs)
```

Each branch is merged to main before starting the next.
