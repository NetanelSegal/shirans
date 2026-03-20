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
- **Testing Suite:** Complete — Playwright E2E tests for admin dashboard, auth, projects, calculator, data state, and TanStack Query caching. Server integration tests for calculator routes.
- **Client-Side Caching (Mar 2025):** TanStack Query (`@tanstack/react-query`) for cacheable routes — projects, categories, testimonials, calculator config, admin data. E2E tests in `e2e/caching.spec.ts`.

## Current Focus
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
