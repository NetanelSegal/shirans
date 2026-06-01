# Plan 05 — Layout-matched skeleton loaders (CLS)

**Branch:** `feature/plan-03-perf-a11y`  
**Status:** Implemented

## Problem

`LoadingState` spinners with arbitrary `minHeight` (e.g. 3200px on `/projects`) did not match final content height, causing footer jump (**CLS 0.295**).

## Solution

- **`Skeleton` / `SkeletonText` / `LoadingRegion`** primitives (`client/src/components/ui/Skeleton/`)
- Layout skeletons (`client/src/components/skeletons/`) mirroring project rows, detail hero, carousel, testimonials
- **`DataStateGuard.loadingFallback`** for custom loading UI; spinner remains default for admin

## Pages wired

| Surface | Skeleton |
|---------|----------|
| `/projects` | `ProjectListSkeleton` (3 rows) |
| `/projects/:id` | `ProjectDetailSkeleton` |
| Home favourites | `FavoriteProjectsCarouselSkeleton` |
| Home testimonials | `TestimonialsStripSkeleton` |

## Lighthouse local (2026-06-01, Plan 05 build, mobile, `127.0.0.1:4175`)

| Metric | Average |
|--------|---------|
| Performance | **84** |
| Accessibility | **98** |
| Best practices | **96** |
| SEO | **95** |

| Page | Perf | A11y | LCP | CLS |
|------|------|------|-----|-----|
| Home | 75 | 100 | 4.6s | 0 |
| Projects | **83** | 100 | 3.2s | **0** |
| Process | 90 | 100 | 3.1s | 0 |

**Targets met:** `/projects` CLS **< 0.1**, Perf **≥ 70**. A11y **≥ 95**.

## Verification

```bash
npm run build -w @shirans/shared
npm run build -w client
cd client && npx vite preview --host 127.0.0.1 --port 4173
npm run type-check
npm run lint:client
```
