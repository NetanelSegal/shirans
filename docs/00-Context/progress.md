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
- **Admin ProjectsManagement refactor (Mar 2026):** Split [`ProjectsManagement`](../../client/src/pages/Admin/ProjectsManagement.tsx) into `ProjectFormFields`, smart `ProjectFormModal` (internal hooks), and `getProjectColumns` for readability.
- **CLS / initial load (Mar 2026):** Public [`Layout`](../../client/src/components/Layout/Layout.tsx) is imported eagerly in [`App.tsx`](../../client/src/App.tsx) so the navbar mounts with the router instead of after a `Suspense` fallback (`Loader` only). Route-level code-splitting remains for pages.
- **Project images (Mar 2026):** Admin uploads go through **sharp** (resize/WebP) on the server, then **Cloudinary**; multipart API; partial-upload cleanup; `ProjectImage.publicId` for deletes. Vitest coverage for service, integration, and `imageProcessing`; Playwright `e2e/admin-projects.spec.ts` (CRUD; full upload when `E2E_CLOUDINARY_UPLOAD=1`).
- **Project media model (May 2026):** `ProjectResponse.media[]` replaces flattened `mainImage` / `images` / `plans` / `videos` globally (admin + public). Shared helpers in `@shirans/shared` (`getMainImageUrl`, `getMediaUrlsByType`, `buildFullReorderIds`). Admin media modal: delete all types, reorder IMAGE/PLAN, per-row loading on favourite/completed toggles.
- **Project create API (Mar 2026):** JSON `POST /api/projects` no longer accepts `images`; image rows are created only via multipart upload flows. Shared `updateProjectSchema` is derived from `createProjectSchema` (with `id` + optional `categoryIds` override for PATCH).
- **Design system (Sep 2026):** Token layer in `client/src/styles/tokens.css`; Tailwind replaces (not extends) its defaults so off-system classes do nothing; `npm run lint:design` rejects hard-coded values. Palette cut to navy and cream — six colours and a hairline. See [brand guide](../05-Design/brand-guide.md).
- **Redesign, Shiran's review (Sep 2026):** Two rounds of client fixes on the redesign preview — palette, square photos, the zero-height mobile menu, the blurry process photo, five services in one row, the contact page and band, the calculator and result pages. Record: [08-Feedback](../08-Feedback/2026-09-shiran-review.md).
- **Service pages (Sep 2026):** Five pages from Shiran's designs at their own URLs, rendered by one template from `client/src/data/service-pages.ts`; service cards link to them.
- **Knowledge centre (Sep 2026):** `Article` model and `/api/articles` (merged to `main` in PR #79, deployed to Railway); `/blog`, `/blog/:slug` and `/admin/articles` with a TipTap editor on the redesign branch. Hebrew slugs, server-side HTML sanitisation, Article/BreadcrumbList/FAQPage JSON-LD, a static share page per article.
- **SEO brief (Sep 2026):** Titles, descriptions and H1s per [the brief](../03-PRDs/seo-brief.md); service pages and articles in the sitemap.

## Current Focus
- **Redesign awaiting go-live:** PR [#78](https://github.com/NetanelSegal/shirans/pull/78) (`redesign/design-language`) holds the redesign, the service pages and the knowledge-centre client. It is reviewed on its deploy preview, `deploy-preview-78--shirans.netlify.app`, and **not merged to `main`**. Open items from Shiran are listed at the end of [the review](../08-Feedback/2026-09-shiran-review.md#still-open).
- **🔴 Intermittent Netlify 500s (open):** Every deploy of this site, production included, fails a share of requests at Netlify's edge — not in this code. Needs a Netlify support ticket. [netlify-500s-2026-09-23.md](netlify-500s-2026-09-23.md).
- **`NETLIFY_BUILD_HOOK_URL` not yet set** on the Railway service, so publishing an article does not yet refresh the static share pages.
- **Production backend (resolved):** The Railway and Supabase outage of 2026-09-17 is over — `/api/health` and `/api/articles/published` answer 200. History: [production-incident-2026-09-17.md](production-incident-2026-09-17.md).

## Tech Stack
- **Frontend:** React 18.3.1, Vite 7.3.1, Tailwind 3.4.14, Motion 12.29.2, React Hook Form, Zod, TanStack Query, TipTap (article editor).
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
