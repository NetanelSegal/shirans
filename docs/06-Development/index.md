# 06 Development - Workflow

## Monorepo Coordination
- **Workspaces:** `client`, `server`, `shared`.
- **NPM Workspaces:** Managed via root `package.json`.

## Coding Standards
- **TypeScript:** Strict mode enabled across all packages.
- **ESLint:** Enforced via `eslint.config.js` (Flat Config).
- **Formatting:** Prettier (configured in `client/`).
- **Naming Conventions:** CamelCase for functions and variables, PascalCase for React components and types.
- **RTL-First:** All UI components must default to `dir="rtl"` (Hebrew).

## Git Flow (STRICT)

- **Branches:** `main` for production. Always work on feature branches: `feature/short-description` or `fix/short-description`.
- **Branch First:** Create the feature branch before any edits. Never commit directly to `main`.
- **Workflow:** `git checkout -b feature/xyz` → implement → run build/type-check → commit → push → open PR.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`) focusing on the "Why." Example: `feat(calculator): add public landing`.
- **Pre-Push:** Run `npm run build` and tests before pushing. Fix any failures.
- **PRs:** All changes must be reviewed before merging to `main`.

## Deployment

| Piece | Trigger |
|---|---|
| **Netlify (client)** | Every push to `main` deploys production. Every PR gets its own deploy preview. |
| **Railway (server)** | A push to `main` that touches `/server/**` (`watchPatterns`). Nothing else redeploys it. |
| **Database** | **Manual.** No build or start step runs migrations. |

**`shared/` does not redeploy the server.** The server compiles `@shirans/shared` into its build, but a PR that changes only `shared/` leaves Railway on the old code, because `watchPatterns` only watches `/server/**`. When a shared change matters to the API, either touch a server file in the same PR or redeploy by hand with `railway deployment redeploy` (CLI linked as below).

**Deploy previews share production.** A preview proxies `/api/*` to the production server and database (`client/public/_redirects`). Public form submissions are blocked there, but anything done in the admin on a preview — including publishing an article — is real. See [Architecture](../04-Architecture/index.md#hosting).

### Railway access

The server lives under the **`segal.netanel4@gmail.com`** Railway account: project `glorious-wholeness`, service `server`. The work account (`netanels@humi.co.il`) has no shirans project, and a Railway connector signed into it will not find one. The CLI on this machine is signed into the right account:

```bash
railway link --project glorious-wholeness   # once per checkout
railway status
```

### Database migrations

The database is a **remote Supabase instance**, and the local `server/.env` points at it — there is no separate development database. So:

- **Never run `npm run prisma:migrate`** (`prisma migrate dev`) against it. `migrate dev` can reset a database it considers out of sync and wants a shadow database.
- Write the migration SQL by hand under `server/prisma/migrations/<timestamp>_<name>/migration.sql`, matching the model, then apply it with:

  ```bash
  cd server
  npx prisma migrate status     # should list only your new migration as pending
  npx prisma migrate deploy     # applies pending migrations, never resets
  ```
- Apply the migration **before** merging code that depends on it. `20260923090000_add_articles` was applied this way ahead of PR #79.

### Server environment variables

Beyond `.env.example`:

- **`NETLIFY_BUILD_HOOK_URL`** — optional. When set, publishing, editing or deleting a published article triggers a Netlify rebuild, so the article gets its own static preview page for WhatsApp and Facebook. Create the hook in Netlify (*Site configuration → Build & deploy → Build hooks*) and set it on the Railway service. Unset, the server logs and skips it.

## Environment Variables
- **Shared:** Use `.env.example` as a template for local development.
- **Secrets:** Never commit `.env` files to version control.
