# Shirans - Portfolio Project

Architecture/interior design portfolio. Monorepo with client (React + Vite + TypeScript) and server (Node.js + Express + TypeScript). Database: PostgreSQL via Prisma. Styling: Tailwind CSS. Shared package for constants used by both client and server.

## Project Structure

```
client/          # React + Vite frontend
server/          # Express backend
shared/          # Shared constants (HTTP_STATUS, ERROR_KEYS, types)
e2e/             # Playwright E2E tests
```

## Commands

```bash
# Client
cd client && npm run dev          # Dev server
cd client && npm run build        # Production build
cd client && npm run lint         # Lint

# Server
cd server && npm run dev          # Dev server
cd server && npm run build        # Production build
cd server && npm run test         # Unit/integration tests (Vitest)
cd server && npm run lint         # Lint

# E2E
npm run test:e2e                  # Run all Playwright tests
npm run test:e2e:ui               # Interactive UI mode
npm run test:e2e:headed           # Headed browser mode
```

## Git Workflow

- IMPORTANT: Create a **separate feature branch** for each task (`feature/task-name`)
- NEVER work on multiple tasks in the same branch
- Use conventional commits: `feat:`, `fix:`, `refactor:`, etc.
- Each commit must represent a working state (compiles, no errors)
- NEVER merge to main - push to feature branch, user handles merges
- Before pushing: verify no lint errors, build errors, or TypeScript errors

## Code Quality

### Single Source of Truth (SSOT)
- IMPORTANT: NEVER duplicate constants, URLs, or config values across files
- Check `constants/` directories, config files, and env vars before adding new constants
- Shared constants between client/server go in `shared/` package
- Base URLs, API endpoints, HTTP status codes, error messages must be centralized

### Error Management
- Use `HTTP_STATUS` constants from `server/src/constants/httpStatus.ts` - never magic numbers
- Use `ERROR_MESSAGES` from `server/src/constants/errorMessages.ts` - never hardcoded strings
- Use `HttpError` class from `server/src/middleware/errorHandler.ts`
- Handle Prisma errors: P2002 -> CONFLICT, P2025 -> NOT_FOUND, P2003 -> BAD_REQUEST
- See `.claude/rules/error-management.md` for full patterns

### Forms
- Use `react-hook-form` with Zod validation via `@hookform/resolvers`
- Shared Zod schemas go in `shared/` folder
- See `.claude/rules/form-management.md` for patterns

## Testing

- **Unit/Integration**: Vitest in `server/test/`
- **E2E**: Playwright in `e2e/` - test user flows, use `data-testid` selectors
- Use proper waits (`waitFor`, `waitForLoadState`) - never fixed `sleep()` calls
- Each test must be independent and isolated

## Task Workflow

1. Receive task -> ask clarifying questions if unclear
2. Get approval -> create feature branch
3. Work in progress -> make small logical commits
4. Task complete -> check for errors -> push to feature branch
5. Wait for review via GitHub - do NOT mark complete until user confirms

## Key Conventions

- TypeScript for all new code
- Check existing implementation before adding new code or features
- Large tasks must be broken down into smaller pieces before execution
- This project uses React + Vite, NOT Next.js - do not use Next.js-specific APIs
