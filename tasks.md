# Tasks

## Active

(No active task)

## Pending

- [Pending] Type the `buildErrorMessages` function in `errorMessages.ts` (currently uses `any`) — requires updating all consumers to handle `string | ((...args) => string)` union
- [Pending] Add `express-rate-limit` windowMs mock in integration tests (stderr warnings)

## History

### Monorepo Shared Package Fix
Renamed shared package to `@shirans/shared`, added workspace dependencies, and configured vitest alias. All 128 tests pass.
