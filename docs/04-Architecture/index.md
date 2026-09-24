# 04 Architecture - System Design

## System Overview

A monorepo with three packages — `client`, `server` and `shared` — where `shared` holds the Zod schemas and response types both sides use, so a request is validated against the same definition in the form and in the API.

## Hosting

| Piece | Where | Deploys from |
|---|---|---|
| Client (Vite SPA) | **Netlify** | `main` → production (`shiran-gilad.com`). Every PR gets a deploy preview, e.g. `deploy-preview-78--shirans.netlify.app` |
| Server (Express) | **Railway** — project `glorious-wholeness`, service `server`, account `segal.netanel4@gmail.com` | `main` only, and only when `server/**` changes (`watchPatterns`) |
| Database (PostgreSQL) | **Supabase** | Migrations are applied by hand — see [Development](../06-Development/index.md#database-migrations) |
| Images | **Cloudinary** | Uploaded through the API |

**There is one server and one database.** Deploy previews do not get their own backend: `client/public/_redirects` proxies a preview's `/api/*` to the production Railway server, because the API only accepts browser requests from the production domain. A preview therefore reads and writes **production data**. That is why it:
- blocks the contact form and the calculator's lead submission (`assertLiveSubmission`), so a test run never reaches Shiran as a real lead
- still lets the calculator reach its result page by computing the estimate in the browser (see [Lead generation](#lead-generation))
- shows a `PreviewBanner`

An article written in the admin **on a preview** is a real article, and will be live on the production site the moment the client that renders it is.

## Backend

- **Framework:** Node.js + Express.
- **Pattern:** Controller → Service → Repository.
    - **Controllers** validate the request with the shared Zod schema and shape the response.
    - **Services** own business rules, error mapping and side effects.
    - **Repositories** are the only layer that touches Prisma, and convert rows into the shared response types.
- **Auth:** JWT access tokens and refresh tokens (`cookie-parser`). Admin routes use `authenticate` + `requireAdmin` and are rate limited (`adminMutationLimiter`).
- **API docs:** Swagger at `/docs`, from `server/src/docs/swagger/`. `test/integration/swagger-sync.test.ts` fails the build if a mounted route is undocumented or the route count drifts.

## Frontend

- **Framework:** React 18 + Vite. Routes are centralised in `client/src/App.tsx`.
- **Data:** TanStack Query. Query keys in `constants/queryKeys.ts`; admin mutations invalidate the matching public caches through `lib/queryInvalidation.ts`.
- **Styling:** a token-based design system — see the [brand guide](../05-Design/brand-guide.md).

### Public routes

| Route | Page | Notes |
|---|---|---|
| `/` | Home | |
| `/about` | About | |
| `/services` | Services | Lists the five services |
| `/private-house-architecture`, `/interior-design`, `/architectural-consulting`, `/online-architecture-consulting`, `/architecture-permits` | `ServiceDetail` | One template. Content from `data/service-pages.ts` |
| `/process` | Process | |
| `/projects`, `/projects/:id` | Projects, Project | Project data from the API |
| `/blog`, `/blog/:slug` | Blog, Article | The knowledge centre |
| `/contact` | Contact | |
| `/calculator`, `/calculator/result` | Cost calculator | The result page is `noindex` |

Admin routes live under `/admin`, behind `ProtectedRoute`, in their own `Dashboard` layout.

### Service pages are data, not pages

`client/src/data/service-pages.ts` holds one entry per service: hero, intro, what's included, steps, an optional checklist, an optional signed note, the FAQ, and the closing band's copy. `pages/ServiceDetail` renders whichever blocks an entry defines.

`constants/services.ts` derives the `SERVICES` list — the cards on the home and services pages — **from the same entries**, so a service and its page can't disagree on name, photo or URL. A card can carry a shorter `cardTitle` than the page's H1.

## Articles (knowledge centre)

### Model

`Article` in `server/prisma/schema.prisma`:
- `title`, `slug` (unique), `excerpt`, `body`
- `coverImage`, `coverImageAlt`, `coverImagePublicId`
- `category`, `readingMinutes`
- `faq` — JSON array of `{ question, answer }`
- `seoTitle`, `seoDescription`
- `published`, `publishedAt`

Categories are a fixed list, `ARTICLE_CATEGORIES`, in `shared/src/schemas/article.schema.ts`.

### API — `/api/articles`

| Method | Path | Access |
|---|---|---|
| GET | `/published` | Public — summaries (no body) |
| GET | `/slug/:slug` | Public — **never serves drafts** |
| GET | `/` | Admin — includes drafts |
| POST | `/` | Admin |
| POST | `/images` | Admin — cover or in-body image to Cloudinary |
| GET / PUT / DELETE | `/:id` | Admin |
| PATCH / DELETE | `/bulk` | Admin — publish, unpublish or delete many |

### Rules the service enforces

- **Slugs keep Hebrew letters** rather than transliterating (`server/src/utils/slug.ts`), and are de-duplicated with `-2`, `-3`… so a repeated title can't break the unique constraint.
- **`publishedAt` is set on the first publish and never moved**, so a later edit doesn't change a date readers or Google have seen.
- **HTML is sanitised on the way in** (`server/src/utils/sanitizeHtml.ts`, DOMPurify with an allow-list matching what the editor can produce). The client renders the body with `dangerouslySetInnerHTML`, so this is the only thing standing between an admin account and stored XSS.
- **Reading time** is estimated from the body at about 200 words a minute unless given.

### Client

- `/blog` — a lead article, then a grid; a category filter appears once there are two or more categories in use.
- `/blog/:slug` — the article, its FAQ, and three more articles. It emits `Article`, `BreadcrumbList` and (when there is an FAQ) `FAQPage` JSON-LD.
- `/admin/articles` — list, create, edit, delete and bulk actions. The body is edited in `components/Admin/RichTextEditor.tsx` (TipTap).

## Link previews (static share pages)

Link-preview crawlers (WhatsApp, Facebook, Telegram) don't run JavaScript, so they never see the tags a page sets at runtime. After each build, `client/scripts/generate-share-pages.mjs` writes one HTML file per route with that route's title, description and image already in `<head>`:
- static pages, from `constants/pageMeta.json` — the same file pages read at runtime, so the two can't drift
- projects, fetched from the API
- **published articles**, fetched from `/api/articles/published`

If the API can't be reached, the build still succeeds and those routes fall back to the site-wide preview.

**Hebrew filenames.** An article's canonical URL must be percent-encoded, but Netlify decodes the request path *before* it looks for a file. A file named `%D7%9B….html` is therefore never found, and the route silently falls back to `index.html` with the home page's tags. Article files are written under the **raw** slug (`filePath`) while their tags keep the encoded URL.

**Freshness.** A newly published article has no static file until the site is rebuilt. The server POSTs to `NETLIFY_BUILD_HOOK_URL` whenever the published set changes (`services/siteRebuild.service.ts`). Fire-and-forget: a failed hook never fails the publish, and an unset variable is logged and skipped.

`client/scripts/generate-sitemap.mjs` runs before each build and adds the service pages and published articles to `sitemap.xml`.

## Lead generation

1. The visitor submits the contact form or completes the cost calculator.
2. **Calculator:** `/calculator` fetches `GET /api/calculator/config` for Shiran's rates, then posts answers to `POST /api/calculator/leads` (rate limited).
3. **The server computes the estimate** from the stored config with `calculateCost` from `@shirans/shared`. It never accepts one from the client.
4. The lead is saved, EmailJS notifies Shiran, and the result is handed to `/calculator/result` through `sessionStorage`.
5. **On a deploy preview** the lead is not saved and no email is sent. The client runs the same `calculateCost` against the same config and goes straight to the result page, so the page can still be reviewed.
