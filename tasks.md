# Monorepo Shared Package Fix

## Root Cause

The shared package had `"name": "shared"` in `package.json`, but all imports use
`@shirans/shared`. TypeScript and Vite worked via path aliases, but Node.js runtime
(vitest) could not resolve `@shirans/shared` because npm workspaces never registered
that package name. This caused 6 test suites to fail with:

```
Error: Cannot find package '@shirans/shared'
imported from server/src/constants/httpStatus.ts
```

## Changes Made

### 1. Rename shared package to `@shirans/shared`
- [x] `shared/package.json`: `"name": "shared"` → `"name": "@shirans/shared"`

### 2. Add workspace dependency in server and client
- [x] `server/package.json`: added `"@shirans/shared": "*"` to dependencies
- [x] `client/package.json`: added `"@shirans/shared": "*"` to dependencies
- [x] `npm install` from root creates workspace symlinks

### 3. Add `@shirans/shared` alias to vitest.config.ts
- [x] Mapped `@shirans/shared` → `../shared/src/index.ts` so tests resolve to
  source directly (no need to build shared before running tests)

## Verification Results
- [x] `npm install` — workspace symlinks created
- [x] `cd server && npm run test:run` — **10/10 test files, 128/128 tests pass**
- [x] `cd client && npm run build` — builds successfully
- [x] `cd server && npx tsc --noEmit` — zero errors

## Future Improvements (separate PRs)
- [ ] Type the `buildErrorMessages` function in `errorMessages.ts` (currently uses `any`)
  — requires updating all consumers to handle `string | ((...args) => string)` union
- [ ] Add `express-rate-limit` windowMs mock in integration tests (stderr warnings)
