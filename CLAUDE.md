# Shiran Gilad — Architecture & Interior Design site

Hebrew (RTL) portfolio site. Monorepo: `client/` (React + Vite + Tailwind), `server/` (Express + Prisma + PostgreSQL), `shared/` (Zod schemas and types, the single source of truth).

The project rules were written for Cursor. They apply here too, and are loaded below.

## Project rules

@.cursorrules
@.cursor/rules/01-workflow.mdc
@.cursor/rules/02-frontend.mdc
@.cursor/rules/03-backend.mdc
@.cursor/rules/04-shared.mdc
@.cursor/rules/05-email.mdc

## Design

@docs/05-Design/brand-guide.md

## Workflow

@docs/PROJECT_WORKFLOW_GUIDE.md
@docs/06-Development/git-and-pull-requests.md

- Every change goes on its own branch and ends in a pull request to `main`, using `.github/pull_request_template.md`. Never commit or push to `main` directly, and never merge your own pull request.
- Run `npm run lint` before committing a change in `client/` or `server/`.

## Read when relevant

- Architecture: `docs/04-Architecture/index.md`
- Development, deploys and hosting (Netlify client, Railway server): `docs/06-Development/index.md`
- Task board and progress: `docs/00-Context/tasks.md`, `docs/00-Context/progress.md`
- Project skills for copywriting and showreel videos: `.cursor/skills/copy-writing/SKILL.md`, `.cursor/skills/video-creator/SKILL.md`
