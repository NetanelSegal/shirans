# AI-Assisted Testing Best Practices

> Guidelines for writing and maintaining tests when using AI coding assistants. Based on OWASP AI Testing Guide, Google Cloud, and Playwright documentation.

## Core Principles

1. **Tests as Specifications**: Use tests early and often—they give AI concrete targets that are harder to misinterpret than natural language requirements.
2. **Validate Over Speed**: AI can generate plausible-looking code that fails subtly. Prioritize comprehensive validation.
3. **Test User-Visible Behavior**: Focus on what end users see and interact with, not implementation details.

## E2E Testing (Playwright)

### Locator Priority (Prefer in Order)

1. `page.getByRole()` — accessibility attributes (button, link, heading)
2. `page.getByLabel()` — form controls by label
3. `page.getByText()` — text content (use for Hebrew/RTL)
4. `page.getByTestId()` — `data-testid` for stable selectors

Avoid: CSS classes, IDs that change frequently.

### Test Isolation

- Each test should run independently with its own storage, cookies, and data.
- Use `beforeEach` for setup; avoid shared mutable state.
- Prefer `request` API for API-level setup (e.g., register user) when possible.

### Assertions

- Use web-first assertions: `toBeVisible()`, `toHaveURL()`, `toHaveText()`.
- Avoid fixed delays (`page.waitForTimeout`); use `expect().toBeVisible({ timeout })` instead.
- Prefer `waitForLoadState('networkidle')` for SPA navigation.

### RTL and Hebrew

- Use `getByRole` with Hebrew text: `getByRole('heading', { name: 'סקירה כללית' })`.
- Use `getByText(/פרויקטים/)` for partial matches when needed.

## AI-Specific Risks

- **Modifying tests to pass**: AI may change tests instead of fixing code. Review test changes critically.
- **Superficial validations**: AI may add assertions that don't catch real bugs. Ensure tests cover edge cases.
- **Missing correctness**: AI can miss fundamental correctness issues. Run tests frequently and fix failures.

## When Adding New Tests

1. Run existing tests first to ensure baseline passes.
2. Add tests for new flows before or alongside implementation.
3. Use Page Object Model for complex pages to reduce duplication.
4. Document test credentials and setup in `e2e/` or `docs/`.

## References

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [OWASP AI Testing Guide](https://owasp.org/www-project-ai-testing-guide/)
- [Google: Five Best Practices for AI Coding Assistants](https://cloud.google.com/blog/topics/developers-practitioners/five-best-practices-for-using-ai-coding-assistants)
