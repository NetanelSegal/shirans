# Project Development Standards

> **Note:** `.cursorrules` is the canonical source for AI behavior. This file supplements it; conflicts resolve in favor of `.cursorrules`.

## Core Rules

1. **Pre-flight Check**: Before starting any task, read `tasks.md` and `progress.md`.
2. **SSOT (Single Source of Truth)**:
   - Shared logic, types, and schemas MUST live in the `shared/` package.
   - Do not duplicate constants between `client` and `server`.
3. **Layered Architecture**:
   - **Server**: Repository -> Service -> Controller.
   - **Client**: Component -> Hook -> Service.
4. **Validation**: Every API endpoint must have a Zod schema in `shared/src/schemas`.

## File Locations

- Shared Types/Schemas: `shared/src/`
- Server Repositories: `server/src/repositories/`
- Client Services: `client/src/services/`
- Tasks & Progress: `tasks.md`, `progress.md` (Root)

## Git Workflow

- **Branching**: `feature/description-slug`
- **Commits**: Conventional commits only (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`)
- **No Direct Merges**: Never merge directly to `main`. Use Pull Requests or task completion flows.

## UI & Styling

- Use **Tailwind CSS** with `tailwind-merge` for dynamic classes.
- Follow existing component patterns in `client/src/components/ui`.
- Use `lucide-react` for consistent iconography.

## Security

- Sanitize all HTML using `isomorphic-dompurify`.
- Ensure Zod validation is applied to all request bodies and parameters.
- No hardcoded secrets; use environment variables from `.env`.
