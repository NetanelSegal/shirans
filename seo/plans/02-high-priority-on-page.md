# Plan 02 — High Priority (On-Page & Crawl)

**Priority:** After Plan 01  
**Estimated effort:** 1–2 days  
**Expected score after completion:** ~80 / 100 (+8 from post-Plan-01)  
**Branch:** `feature/seo-improvements`

---

## H1 — Complete Calculator SEO tags

**Issue:** Incomplete Helmet on calculator landing page.

**Files:**
- `client/src/pages/LandingCalculator/LandingCalculator.tsx`

**Action:**
- Add `og:description`, `og:type`, `og:image`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Add `og:locale` → `he_IL`
- Add canonical → `${BASE_URL}/calculator`

**Score impact:** Social / OG +2, Meta +1

---

## H2 — Add `/calculator` to sitemap

**Issue:** Calculator not discoverable via sitemap.

**Files:**
- `client/public/sitemap.xml`

**Action:**
```xml
<url>
  <loc>https://shiran-gilad.com/calculator</loc>
  <lastmod>2025-05-31</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

**Score impact:** Crawlability +2

---

## H3 — Fix project page heading hierarchy

**Issue:** Project title is `<h3>`, should be `<h1>` for SEO.

**Files:**
- `client/src/pages/Project/Project.tsx` — change project title to `<h1>`

**Verify:** One H1 per project page with project name.

**Score impact:** On-page +2

---

## H4 — Implement real `/contact` page

**Issue:** Route renders empty `<div>` — thin content for indexed URL.

**Files:**
- `client/src/App.tsx` — replace empty div with Contact page component
- New: `client/src/pages/Contact/Contact.tsx` (or scroll-to-footer + unique meta)

**Action:**
- Dedicated page with H1 "צור קשר", contact info, link to footer form
- Full Helmet meta + canonical

**Score impact:** On-page +2, Crawlability +1

---

## H5 — `noindex` on non-public routes

**Issue:** Login/register/404 rely only on robots.txt.

**Files:**
- `Login.tsx`, `Register.tsx`, `NotFound.tsx`, `Dashboard.tsx`

**Action:**
```tsx
<meta name="robots" content="noindex, nofollow" />
```

**Score impact:** Technical +1

---

## H6 — Sitemap: sync project URLs

**Issue:** Sitemap lists 4 projects; production has more.

**Options (pick one):**
1. **Manual** — update `sitemap.xml` with current IDs
2. **Build script** — `scripts/generate-sitemap.ts` fetches `/api/projects` at build time

**Files:**
- `client/public/sitemap.xml` or new script in `client/scripts/`
- `client/package.json` — `"prebuild": "tsx scripts/generate-sitemap.ts"`

**Score impact:** Crawlability +3

---

## H7 — Introduce shared `PageSeo` component

**Issue:** Duplicated Helmet blocks; easy to miss tags on new pages.

**Files:**
- New: `client/src/components/Seo/PageSeo.tsx`

**Props:** `title`, `description`, `path`, `image?`, `noIndex?`

**Refactor:** Home, Process, Projects, About, Project, Calculator, Contact, NotFound

**Score impact:** Maintainability (indirect); prevents future regressions

---

## Execution order

```
H7 (component first) → H1 → H2 → H3 → H4 → H5 → H6
```

Log each step in [`../scores/score-log.md`](../scores/score-log.md).

---

## Checklist

- [x] H1 — Calculator full OG/Twitter (Plan 01)
- [x] H2 — Calculator in sitemap
- [x] H3 — Project H1
- [x] H4 — Contact page
- [x] H5 — noindex on private routes
- [x] H6 — Dynamic sitemap script
- [x] H7 — PageSeo component (Plan 01)
