---
name: security-accessibility-audit
description: Scans all changed files for common vulnerabilities and WCAG 2.1 Level AA accessibility standards before marking a task as complete. Use when asked to "audit this task" or before marking a task [Complete].
---

# Security & Accessibility Audit

Audit all changed files for security vulnerabilities and accessibility (WCAG 2.1 Level AA) compliance.

## Scope

- **Changed files**: Run `git diff main --name-only` (or `git diff --name-only` if on a feature branch) to get the list of modified files. Audit each file that falls under Focus Files below.
- If no changes (e.g. manual audit request), audit the current working file or specified paths.

## Workflow

1.  **Security Audit**:
    - Run `npm audit` in the root and workspace directories.
    - Manually check for hardcoded secrets or sensitive information in new files.
    - Verify that all new API routes apply Zod validation and proper sanitization with `isomorphic-dompurify`.
2.  **Accessibility (WCAG 2.1 Level AA) Audit**:
    - For React components, verify semantic HTML usage (`main`, `nav`, `section`, `article`, etc.).
    - Check for `aria-label` or `aria-labelledby` on interactive elements without visible labels.
    - Check for `alt` on all images.
    - Verify keyboard focus management for modals and custom controls.
3.  **Checklist Output**:
    - Present a [Passed/Failed] checklist to the user for each audit item.
    - If any fail, provide clear instructions for resolution before allowing the task to be marked `[Complete]`.

## Focus Files

- `shared/src/schemas/`: Ensure Zod validation is robust.
- `client/src/components/`: Check for accessibility best practices (WCAG 2.1 AA).
- `server/src/controllers/`: Check for proper input sanitization.
