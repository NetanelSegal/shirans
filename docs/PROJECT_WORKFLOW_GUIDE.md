# Project Workflow Guide

## Git & Branching (STRICT)

1. **Branch first** — Create a feature branch before any edits. Never commit directly to `main`.
2. **Naming** — Use `feature/short-description` or `fix/short-description` (e.g. `feature/calculator-landing`).
3. **Workflow**:
   ```bash
   git checkout -b feature/your-feature
   # ... implement ...
   npm run build
   npm run type-check  # or lint
   git add -A
   git commit -m "feat(scope): description"
   git push -u origin feature/your-feature
   ```
4. **Conventional Commits** — Use `feat:`, `fix:`, `chore:`, `refactor:` focusing on the "Why."
5. **Pre-push** — Run build and tests. Fix any failures before pushing.
6. **Merge** — Merge to `main` via PR only after review.

## Client Code Structure

- **Hooks** (`client/src/hooks/`): Reusable logic — data fetching, form state, API calls.
- **Components** (`client/src/components/`): Reusable UI. Extract subcomponents to separate files when they grow or are reused.
- **Pages** (`client/src/pages/`): Thin orchestrators — compose components + hooks. No business logic inline.
- **Constants** — Extract option arrays, config to `constants.ts` within the feature folder.
- **Utils** — Pure functions in `client/src/utils/` or a local `utils.ts` in the feature folder.
