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
- [x] E2E Testing — Playwright tests for core flows (admin, auth, projects, calculator, data state, react-query-smoke).
- [x] Unit/Integration Testing — Vitest for server logic.
- [x] Client-side caching — TanStack Query for projects, categories, testimonials, calculator config, admin data.
- [x] **Image pipeline (admin uploads)** — Server-side sharp + Cloudinary; tests and optional E2E upload (`E2E_CLOUDINARY_UPLOAD=1`). Legacy script-based conversion remains separate if needed.
- [x] **Project media admin UX** — Global `media[]` response shape; admin delete/reorder for images/plans; row loading on favourite/completed toggles.
- [x] **Production Deploy — restored (2026-09-17)** — Railway redeployed and the Supabase database resumed; the API has answered since. History in [production-incident-2026-09-17.md](production-incident-2026-09-17.md). Server is on **Railway**, not Render.
- [ ] **🔴 Intermittent Netlify 500s** — every deploy of the site, production included, fails a share of requests at Netlify's edge. Needs a Netlify support ticket. [netlify-500s-2026-09-23.md](netlify-500s-2026-09-23.md).
- [x] **SEO brief — titles, descriptions, H1s, sitemap, share previews** — per [the brief](../03-PRDs/seo-brief.md).
- [ ] **SEO — remaining items from the brief** — GA4 + Search Console, conversion events, structured data on static pages, per-project SEO fields in the admin. See the status table in [the brief](../03-PRDs/seo-brief.md#implementation-requirements).

## Phase 5: Redesign & Content (IN REVIEW — PR #78, not merged)
- [x] **Design system** — token layer, `lint:design`, navy-and-cream palette. [Brand guide](../05-Design/brand-guide.md).
- [x] **Shiran's review, rounds 1 and 2** — [08-Feedback](../08-Feedback/2026-09-shiran-review.md).
- [x] **Five service pages** from Shiran's designs.
- [x] **Knowledge centre** — `/blog`, `/blog/:slug`, `/admin/articles`; API merged and deployed (PR #79).
- [x] **Calculator and result pages** on the design system; the result page reachable on deploy previews without saving a lead.
- [ ] **Open items from Shiran** — a photo for ליווי אונליין, her OK on the home headline, licensing FAQ Q5.
- [ ] **`NETLIFY_BUILD_HOOK_URL`** on the Railway service.
- [ ] **First article.**
- [ ] **Merge PR #78** once Shiran signs off.

## Phase 6: Polish & Launch
- [ ] Content Review — Finalizing project descriptions and testimonials.
- [ ] Performance Audit — Lighthouse scores and load times (initial CLS: navbar shell fixed via eager Layout import, Mar 2026).
- [ ] Final Launch — Domain pointing and production go-live.
