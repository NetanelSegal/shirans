---
name: agent-best-practices
description: A set of guidelines for an AI agent, covering Git workflow, task management, code quality, and testing.
license: MIT
metadata:
  author: Shiran
  version: "1.0.0"
---

# Agent Best Practices

This document outlines the best practices for the AI agent, covering Git workflow, task management, code quality, and testing.

## Git Workflow

### Feature Branch Strategy
- **CRITICAL: Create a separate feature branch for EACH task/feature** (e.g., `feature/replace-testimonials`, `feature/fix-image-modal`)
- **NEVER work on multiple tasks in the same branch** - each task/feature must have its own dedicated branch
- Work on the task in its dedicated branch
- Make **small, logical commits** as work progresses (at meaningful checkpoints, not necessarily every subtask)
- This allows:
  - Easy navigation between tasks (`git checkout <branch-name>`)
  - Testing different approaches without affecting main branch
  - Easy rollback if issues arise (`git reset --hard <commit-hash>` or `git revert`)
  - Clean history with descriptive commit messages
  - Independent review and merge of each feature

### Commit Guidelines
- Commit messages should be clear and descriptive
- Commit when a logical unit of work is complete
- Use conventional commit format when possible: `feat:`, `fix:`, `refactor:`, etc.
- Each commit should represent a working state (code compiles, no obvious errors)

### Branch Management
- Keep feature branches focused on a single task
- When task is complete: commit and push to feature branch, then wait for review
- **CRITICAL**: Commit and push every standalone feature separately from others for easier review.
- **Never merge to main** - user handles all merges after review
- User will delete feature branch after successful merge

---

## Task Management Flow

### Task Lifecycle
1. **Task Received** → Add to `tasks.md` under "Pending Approval" with breakdown
2. **Approval Given** → Move to "Active Tasks" in `tasks.md`, **create a separate feature branch for THIS task only**, update `progress.md`
3. **Work In Progress** → Update `progress.md` with current status and what you're working on
4. **Subtask Complete** → Make Git commit, update `progress.md`
5. **Task Complete** → Check for errors (linting, build, TypeScript) → `git add .`, `git commit`, `git push` to feature branch
6. **Await Review** → Wait for review approval via GitHub
7. **Review Approved** → User will merge branch to main, then move to "Completed Tasks" in `tasks.md`, update `progress.md`
8. **Documentation**: When moving task to "Completed Tasks", keep only a **brief summary** - do NOT copy all subtasks and detailed breakdown. Include only:
   - What was accomplished (high-level)
   - Key changes made
   - Branch name
   - Completion date

### Important: Review Process
- **You do NOT decide when a task is complete** - tasks require review before completion
- **You NEVER merge to main** - only push to feature branch, user handles merges
- **Always check for errors before pushing**: Verify no linting errors, build errors, or TypeScript errors
- **Before every push**: Run linting, ensure the app compiles, and builds successfully.
- When you finish a task: Check for errors → `git add .`, `git commit`, `git push` to the feature branch
- Review happens via GitHub - wait for approval
- Only mark tasks as "Completed" after review approval and user confirms merge

### File Responsibilities
- **`tasks.md`**: Contains all tasks (Pending Approval, Active, Completed) and subtasks
- **`progress.md`**: Contains current work status, what's being worked on right now, and progress log
- **`README.md`** (this file): Contains the process, workflow, and Git guidelines

---

## Task Categories

- **Tasks**: Active development tasks and features
- **Technologies**: Technology adoption and setup
- **Tips**: Helpful tips and optimizations
- **Best Practices**: Best practices to implement

---

## Code Quality Guidelines

### Single Source of Truth (SSOT)
- **ALWAYS check for existing constants/config files before creating new ones**
- **NEVER duplicate constants, URLs, or configuration values across multiple files**
- If a value is used in multiple places, it MUST be defined in a single location (e.g., `constants/urls.js`)
- Before adding a constant, check if it already exists in:
  - `constants/` directory
  - Configuration files
  - Environment variables
- Examples of values that should be SSOT:
  - Base URLs, API endpoints
  - Configuration values
  - Magic numbers/strings used in multiple places
  - Default values

## Testing Guidelines

### Test Types
- **Unit Tests**: Test individual functions/components in isolation (server: `server/test/`, client: component tests)
- **Integration Tests**: Test API routes and service layer interactions (server: `server/test/integration/`)
- **E2E Tests**: Test full user flows from browser perspective (root: `e2e/`)

### E2E Testing with Playwright

#### Setup
- E2E tests are located in the `e2e/` directory at the root level
- Playwright configuration: `playwright.config.ts`
- Tests use TypeScript and follow Playwright best practices

#### Running E2E Tests
```bash
# Run all E2E tests (starts dev servers automatically)
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

#### E2E Test Guidelines
- **Test user flows, not implementation details**: Focus on what users see and do
- **Use data-testid attributes**: Prefer `data-testid` over CSS classes for selectors (more stable)
- **Wait for network idle**: Use `page.waitForLoadState('networkidle')` after navigation
- **Test across browsers**: Playwright runs tests on Chromium, Firefox, and WebKit by default
- **Mobile testing**: Include mobile viewport tests for responsive features
- **Isolation**: Each test should be independent and not rely on other tests
- **Clean up**: Use `test.beforeEach` and `test.afterEach` for setup/teardown
- **Avoid flakiness**: Use proper waits (`waitFor`, `waitForLoadState`) instead of fixed `sleep()` calls
- **Test critical paths**: Focus on authentication, core user flows, and critical features

#### E2E Test Structure
```
e2e/
├── example.spec.ts      # Example/homepage tests
├── auth.spec.ts         # Authentication flow tests
├── projects.spec.ts     # Projects page tests
└── [feature].spec.ts    # Other feature-specific tests
```

#### Writing E2E Tests
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path');
    await page.waitForLoadState('networkidle');
    
    // Use data-testid when possible
    const element = page.locator('[data-testid="my-element"]');
    await expect(element).toBeVisible();
  });
});
```

#### CI/CD Integration
- E2E tests run automatically in CI environments
- Use `PLAYWRIGHT_BASE_URL` environment variable to override base URL
- Set `CI=true` for CI-specific configurations (retries, workers)

## Notes

- **Critical**: If anything is unclear, ask at least **3 clarifying questions** before proceeding
- **Critical**: **ALWAYS check for current implementation of stuff before adding new code or features**
- **Critical**: **Each task/feature MUST have its own separate feature branch** - never work on multiple tasks in the same branch
- **Critical**: **Always check for Single Source of Truth** - never duplicate constants or configuration values
- **Important**: Large tasks must be broken down into smaller pieces before execution
- **Important**: When documenting completed tasks, keep only a **brief summary** - do NOT include all subtasks and detailed breakdown
- **Important**: Write E2E tests for new features that involve user interactions
- Approval is required before starting work on any task
- Tasks assigned to Auto (AI agent) should be executable independently
- Each task should include sufficient context for completion
- Progress should be updated regularly in `progress.md`
