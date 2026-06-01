# SEO Score Log

| # | Date | Change | Overall | Δ |
|---|------|--------|---------|---|
| 0 | 2025-05-31 | Baseline | 60 | — |
| 4 | 2025-05-31 | Plan 01 complete | **72** | +12 |
| 5 | 2025-05-31 | Plan 02 complete | **80** | +8 |

## Plan 02 breakdown (2025-05-31)

| Item | Change |
|------|--------|
| H5 | `noIndex` on Login, Register, NotFound, Dashboard |
| H3 | Project title `<h1>` on detail pages |
| H2 | `/calculator` in sitemap |
| H4 | Real `/contact` page with form + contact info |
| H6 | `generate-sitemap.mjs` prebuild (Railway API → 7 projects) |

**Sitemap:** 13 URLs (6 static + 7 projects)

**Lighthouse baseline (2026-06-01, mobile, production):** Perf **61** avg | A11y **85** avg | Best **100** | SEO **100**

| 6 | 2026-06-01 | Plan 03 implemented (perf + a11y) | **80** (rubric) | — |

## Plan 03 summary (2026-06-01)

| Item | Change |
|------|--------|
| A1 | Input `id` / `htmlFor` fix |
| A2 | `aria-label` on nav, carousel, social; Lucide in navbar |
| A3 | Projects `h2`, Process section `h2` |
| A4 | Calculator valid `<ul>`/`<li>` |
| A5 | Contact form white card |
| P1 | Self-hosted Assistant (`@fontsource`); async Font Awesome |
| P2 | Hero poster preload + video `preload="metadata"` |
| P3 | Image `width`/`height` defaults; listing/detail alts |
| P4 | `optimizeCloudinaryImageUrl` in shared |

**Lighthouse local (2026-06-01, Plan 03 build):** Perf **79** avg | A11y **98** | Best **96** | SEO **95**

| 7 | 2026-06-01 | Plan 04 (local preview) | **80** (rubric) | — |

**Lighthouse local (2026-06-01, Plan 04 build):** Perf **85** avg | A11y **98** | Best **96** | SEO **95**

| Page | Perf | A11y | LCP | CLS |
|------|------|------|-----|-----|
| Home | 72 | 100 | 6.4s | 0 |
| Projects | 69 | 100 | 3.2s | 0.295* |
| Process | 90 | 100 | 3.1s | 0 |

\*Projects CLS mostly footer shift when project list replaces loading placeholder (mitigation: `loadingMinHeight` 3200px).

| 8 | 2026-06-01 | Plan 05 skeleton loaders | **80** (rubric) | — |

## Plan 05 summary (2026-06-01)

| Item | Change |
|------|--------|
| S1 | `Skeleton` / `SkeletonText` / `LoadingRegion` primitives |
| S2 | Layout skeletons (projects list, detail, favourites, testimonials) |
| S3 | `DataStateGuard.loadingFallback`; removed `loadingMinHeight` hack on `/projects` |

**Lighthouse local (2026-06-01, Plan 05 build):** Perf **84** avg | A11y **98** | Best **96** | SEO **95**

| Page | Perf | A11y | LCP | CLS |
|------|------|------|-----|-----|
| Home | 75 | 100 | 4.6s | 0 |
| Projects | **83** | 100 | 3.2s | **0** |
| Process | 90 | 100 | 3.1s | 0 |

**Next:** JSON-LD, breadcrumbs, SPA prerender
