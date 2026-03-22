# Progress Log: Shiran Gilad Architecture & Interior Design

## History & Milestones
- **Monorepo Setup:** Complete — NPM Workspaces with `client`, `server`, and `shared`.
- **Backend Architecture:** Complete — Express + TypeScript; Controller-Service-Repository pattern; Prisma ORM with PostgreSQL; JWT + Bcrypt for authentication; `express-async-errors` and `winston` logger.
- **Frontend Architecture:** Complete — React 18 + Vite 7 + Tailwind 3; RTL (Hebrew) support with "Assistant" font; Motion animations; `client/src/components/ui/` primitive library.
- **Shared Logic:** Complete — `@shirans/shared` for Zod schemas and cross-stack types.
- **Projects & Categories CRUD:** Complete — Full management of architectural projects, including main images, plans, and category tagging.
- **Testimonials & Contacts:** Complete — Published testimonials management and contact form submission tracking.
- **Cost Calculator:** Complete — Lead generation and configuration management for interior design cost estimation.
- **Calculator Enhancements (Mar 2025):** Configurable built area range (100–500) from admin; empty initial form with validation-gated results; icon-enhanced dropdowns; "not fully entered" design state; SSOT config from DB.
- **Admin Dashboard:** Complete — Unified dashboard for managing projects, categories, testimonials, contacts, users, and calculator leads. Bulk actions (select multiple, change status, delete) on leads, contacts, and testimonials.
- **Calculator Lead Email:** Complete — EmailJS notification sent to admin when a new lead is submitted from the calculator page.
- **Authentication:** Complete — Login/Register with JWT, refresh tokens, and role-based access control (ADMIN/USER).
- **Testing Suite:** Complete — Playwright E2E tests for admin dashboard, auth, projects, calculator, data state, and TanStack Query smoke (`e2e/react-query-smoke.spec.ts`). Server integration tests for calculator routes.
- **Client-Side Caching:** Complete — TanStack Query for projects, categories, testimonials, calculator config, and admin data. Defaults: 5 min stale time; admin queries: 1 min stale time with invalidation on mutations.

## Current Focus
- **Admin ProjectsManagement refactor (Mar 2026):** Split [`ProjectsManagement`](client/src/pages/Admin/ProjectsManagement.tsx) into `ProjectFormFields`, smart `ProjectFormModal` (internal hooks), and `getProjectColumns` for readability.
- **CLS / initial load (Mar 2026):** Public [`Layout`](client/src/components/Layout/Layout.tsx) is imported eagerly in [`App.tsx`](client/src/App.tsx) so the navbar mounts with the router instead of after a `Suspense` fallback (`Loader` only). Route-level code-splitting remains for pages.
- **Project images (Mar 2026):** Admin uploads go through **sharp** (resize/WebP) on the server, then **Cloudinary**; multipart API; partial-upload cleanup; `ProjectImage.publicId` for deletes. Vitest coverage for service, integration, and `imageProcessing`; Playwright `e2e/admin-projects.spec.ts` (CRUD; full upload when `E2E_CLOUDINARY_UPLOAD=1`).
- **Project create API (Mar 2026):** JSON `POST /api/projects` no longer accepts `images`; image rows are created only via multipart upload flows. Shared `updateProjectSchema` is derived from `createProjectSchema` (with `id` + optional `categoryIds` override for PATCH).
- **Optimization:** Image conversion and optimization (found `scripts/convert-project2-images.js`).
- **Deployment:** Render (Server) and Netlify (Client) configuration.
- **Content:** Finalizing project data and testimonials.

## Tech Stack
- **Frontend:** React 18.3.1, Vite 7.3.1, Tailwind 3.4.14, Motion 12.29.2, React Hook Form, Zod, TanStack Query.
- **Backend:** Node.js, Express 4.21.1, Prisma 7.4.0, PostgreSQL, JWT, Bcrypt.
- **Testing:** Playwright 1.58.1, Vitest 4.0.18.
- **Shared:** @shirans/shared (Zod, Types).

## Architecture
```
shirans/
├── client/          # Vite + React (UI, Pages, Services, Hooks, Contexts)
├── server/          # Express + Prisma (Controllers, Services, Repositories, Routes)
├── shared/          # Shared Zod Schemas & Types
└── e2e/             # Playwright Test Suite
```
