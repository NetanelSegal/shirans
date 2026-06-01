# Plan 03 — Performance & Accessibility (Lighthouse)

**Branch:** `feature/plan-03-perf-a11y`  
**Status:** Implemented

## Baseline (production mobile, 2026-06-01)

| Metric | Average |
|--------|---------|
| Performance | 61 |
| Accessibility | 85 |
| Best practices | 100 |
| SEO | 100 |

## Changes implemented

### Accessibility (A1–A5)
- **Input** — stable `id` + `htmlFor` via `useId()` fallback
- **Navbar / UserMenu** — `aria-label`, Lucide icons (no FA on chrome)
- **ContactInfo** — social link `aria-label`s
- **FavoriteProjects / Project carousel** — Hebrew `aria-label`s
- **Projects** — card titles `h4` → `h2`; **Process** sections `h3` → `h2`
- **Calculator** — valid `<ul>` / `<li>` structure
- **Contact** — form in white card for contrast

### Performance (P1–P4)
- **Fonts** — `@fontsource/assistant` (removed blocking Google Fonts)
- **Font Awesome** — async load (`media="print"` + `onload`) for About/admin icons
- **Hero** — poster preload via Helmet, `preload="metadata"` on video, poster dimensions
- **CLS** — default `width`/`height` on `Image`, project listing/detail
- **Cloudinary** — `optimizeCloudinaryImageUrl()` in shared (`f_auto,q_auto,w_*`)

## Verification

```bash
npm run build -w @shirans/shared
npm run type-check
npm run lint:client
npm run build -w client
```

Re-run Lighthouse mobile on 7 public URLs; record in `seo/scores/score-log.md`.

## Deferred (Plan 04)

JSON-LD, breadcrumbs, SPA prerender, aggressive JS code-splitting.
