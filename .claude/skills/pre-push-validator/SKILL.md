---
name: pre-push-validator
description: Runs lint/type-check/test scripts, fixes auto-fixable errors, and generates a Conventional Commit message based on the Git diff. Use when "ready to commit" or "ready to push".
---

# Pre-Push Validator & Committer

Validate code quality and automate the commit process. Aligns with `.cursorrules` verification requirements.

## Workflow

1.  **Run Validation Scripts** (in order):
    - `npm run lint` (root)
    - `npm run type-check` (root)
    - `npm run test:run` (root)
2.  **Auto-Fix**: If linting fails, run `eslint . --fix` in the affected workspace (e.g. `npm run lint -w client` then `cd client && npx eslint . --fix`, or `cd server && npx eslint . --ext .ts --fix`). Re-run `npm run lint` to verify.
3.  **Manual Intervention**: If type-check or tests fail, fix errors and re-run. If build is needed, run `npm run build`. Report logs and ask the user for direction if unfixable.
4.  **Staging**: If all checks pass, stage only intended files. Prefer `git add <paths>` for specific changed files. If using `git add .`, first run `git status` and `git diff` to verify no `.env`, lockfiles, or build artifacts are included. NEVER stage protected paths (see `.cursorrules`).
5.  **Verify Staged**: Run `git diff --cached` and confirm no sensitive or unintended files.
6.  **Commit Message**: Generate a Conventional Commit message (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`) based on the staged diff.
7.  **Commit**: Run `git commit -m "[Generated Message]"`.

## Target Scripts

- Root: `npm run lint`, `npm run type-check`, `npm run test:run`
- Workspace lint fix: `npx eslint . --fix` (client) or `npx eslint . --ext .ts --fix` (server)
