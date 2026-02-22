---
name: context-refactor
description: Analyzes SSOT, checks architectural impact across the codebase, and applies refactoring strictly adhering to project style. Use when asked to "refactor [symbol/file]" or "improve architectural consistency".
---

# Deep Context Refactor

Perform large-scale refactors while maintaining SSOT and architectural integrity.

## Workflow

1.  **SSOT Analysis**: Search `shared/` to ensure no existing logic is being duplicated.
2.  **Dependency Mapping**: Grep usage of the target symbol/file across `client/` and `server/` to understand the impact.
3.  **Refactor**: Apply the requested changes while strictly adhering to the "Clean Architecture" pattern (Repositories -> Services -> Controllers).
4.  **Verify**: Run `npm run type-check --workspaces` to ensure all imports and types are still valid.
5.  **Style Check**: Ensure the refactored code follows the project's Tailwind and React standards.

## Focus Areas

- Moving logic from Client/Server to `@shirans/shared`.
- Consolidating redundant utility functions into `shared/src/utils`.
- Updating layered patterns to match the existing codebase.
