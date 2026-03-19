# Task Board: Shiran Gilad Architecture & Interior Design

## Phase 1: Core Foundation (COMPLETE)
- [x] Monorepo Setup — NPM Workspaces + TypeScript.
- [x] Backend Infrastructure — Express, Prisma, PostgreSQL.
- [x] Frontend Infrastructure — React 18, Vite, Tailwind 3.
- [x] Authentication System — JWT, Bcrypt, Login/Register.
- [x] Shared Data Layer — @shirans/shared (Zod schemas).

## Phase 2: Portfolio & Features (COMPLETE)
- [x] Home Page — Hero, selected projects, testimonials.
- [x] Process Page — Describing the architectural journey.
- [x] Projects Page — Filtering by categories, project details, images/plans.
- [x] Contact System — Form submission and lead tracking.
- [x] Cost Calculator — Interior design cost estimation for leads.

## Phase 3: Admin Management (COMPLETE)
- [x] Admin Dashboard — Overview and stats.
- [x] Projects Management — CRUD for projects and images.
- [x] Categories Management — CRUD for project categories.
- [x] Testimonials Management — Approval and publishing.
- [x] Contacts Management — Tracking and reading leads.
- [x] Calculator Leads — Managing and reviewing cost estimates.
- [x] Admin Bulk Actions — Multi-select and bulk status change/delete for leads, contacts, testimonials.
- [x] Calculator Lead Email — EmailJS notification on new lead from calculator.
- [x] Calculator Form Enhancements — Configurable built area (100–500), empty initial state, validation-gated display, icon dropdowns, admin builtAreaSqmRange.

## Phase 4: Quality & Deployment (IN PROGRESS)
- [x] E2E Testing — Playwright tests for core flows.
- [x] Unit/Integration Testing — Vitest for server logic.
- [x] Client-side caching — TanStack Query for projects, categories, testimonials, calculator config, admin data.
- [ ] **⚠️ Image Optimization** — Processing large project images (found scripts).
- [ ] **⚠️ Production Deploy** — Finalize Render (Server) and Netlify (Client) settings.
- [ ] **⚠️ SEO & Meta** — Refining metadata for search engines.

## Phase 5: Polish & Launch
- [ ] Content Review — Finalizing project descriptions and testimonials.
- [ ] Performance Audit — Lighthouse scores and load times (initial CLS: navbar shell fixed via eager Layout import, Mar 2026).
- [ ] Final Launch — Domain pointing and production go-live.
