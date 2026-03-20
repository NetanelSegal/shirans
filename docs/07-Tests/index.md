# 07 Tests - Quality Assurance

## Testing Philosophy
- **E2E First:** Focus on the critical user and admin journeys using Playwright.
- **Unit/Integration:** Test server logic and complex business rules with Vitest.
- **Type Safety:** Ensure the entire stack is strictly typed to catch errors early.

## Test Suites
- **E2E (Playwright):** Located in `e2e/`.
    - `admin-dashboard.spec.ts`: Tests all admin CRUD operations.
    - `auth.spec.ts`: Tests login, logout, and token refresh.
    - `projects.spec.ts`: Tests project filtering and details.
    - `calculator.spec.ts`: Tests calculator form and lead submission.
    - `data-state.spec.ts`: Tests data persistence.
    - `react-query-smoke.spec.ts`: Smoke tests for pages backed by TanStack Query (public and admin).
- **Unit/Integration (Vitest):** Located in `server/test/`.
    - `auth.test.ts`: Server-side auth logic.
    - `projects.test.ts`: Project management logic.

## Running Tests
- **E2E:** `npm run test:e2e` from the root.
- **Server:** `npm run test:run` from the root (runs `vitest` in `server`).
- **Lints:** `npm run lint` from the root.

## CI/CD Integration
- **GitHub Actions:** Automatically runs tests on push to `main` and all pull requests.
- **PR Checks:** All tests must pass before merging.
