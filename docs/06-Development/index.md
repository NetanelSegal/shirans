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
- **Render (Server):** Automatic deployments on push to `main`.
- **Netlify (Client):** Automatic deployments on push to `main`.
- **Database:** Prisma migrations run automatically during deployment.

## Environment Variables
- **Shared:** Use `.env.example` as a template for local development.
- **Secrets:** Never commit `.env` files to version control.
