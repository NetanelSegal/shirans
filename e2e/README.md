# E2E Tests

End-to-end tests for the Shirans portfolio website using Playwright.

## Overview

E2E tests verify complete user flows from the browser perspective, testing the integration between frontend and backend.

## Running Tests

### Prerequisites
- Ensure both client and server dev servers can start successfully
- Install Playwright browsers: `npx playwright install`

### Commands

```bash
# Run all E2E tests (automatically starts dev servers)
npm run test:e2e

# Run with interactive UI mode
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

## Test Structure

- `example.spec.ts` - Homepage and basic navigation tests
- `auth.spec.ts` - Authentication flow tests
- `projects.spec.ts` - Projects page and filtering tests

## Writing New Tests

1. Create a new `.spec.ts` file in the `e2e/` directory
2. Use descriptive test names that explain what user flow is being tested
3. Prefer `data-testid` attributes for selectors (more stable than CSS classes)
4. Use proper waits (`waitForLoadState`, `waitFor`) instead of fixed delays
5. Test across different viewports (mobile, tablet, desktop)

## Best Practices

- **Test user flows, not implementation**: Focus on what users see and do
- **Keep tests independent**: Each test should work in isolation
- **Use data-testid**: Add `data-testid` attributes to key elements for stable selectors
- **Wait properly**: Use `page.waitForLoadState('networkidle')` after navigation
- **Clean up**: Use `test.beforeEach`/`test.afterEach` for setup/teardown
- **Avoid flakiness**: Don't use `sleep()` - use proper waits instead

## Configuration

See `playwright.config.ts` for:
- Base URL configuration
- Browser configurations (Chromium, Firefox, WebKit)
- Mobile viewport tests
- Web server setup (auto-starts dev servers)
