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
- **Unit/Integration (Vitest):** `server/src/**/*.test.ts` and `server/test/**`.
    - `src/utils/article.test.ts`: article slugs (Hebrew, de-duplication), reading time, and HTML sanitisation — script tags, `javascript:` URLs, event handlers, iframes and forms stripped; legitimate markup kept.
    - `test/integration/swagger-sync.test.ts`: fails if a mounted route is undocumented in Swagger, or if the route count drifts. **Adding a route means adding its Swagger path and updating the counts.**
    - `test/integration/calculator.routes.test.ts`: ⚠️ five tests fail on `main` as well as on the redesign branch (they expect a config body and get an empty one). Pre-existing and unrelated to recent work; tracked separately.

## Running Tests
- **E2E:** `npm run test:e2e` from the root.
- **Server:** `npm run test:run` from the root (runs `vitest` in `server`).
- **Lints:** `npm run lint` from the root.

## CI/CD Integration
- **GitHub Actions:** Automatically runs tests on push to `main` and all pull requests.
- **PR Checks:** All tests must pass before merging.
