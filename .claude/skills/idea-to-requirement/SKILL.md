---
name: idea-to-requirement
description: Turns a rough idea into a structured requirement markdown file in docs/. Output is compatible with task-bootstrapper and tasks.md. Use when the user describes an idea, concept, or feature and wants it documented as a requirements file.
---

# Idea to Requirement

Turns a rough idea into a structured requirement document that feeds the task-bootstrapper and tasks.md workflow.

## When to Use

- User describes an idea and wants it written as a requirement doc
- User says "turn this into a requirement" or "create a feature doc from this"
- User has rough notes or bullets and wants a structured doc for implementation

---

## Workflow

0.  **Design Research (Optional)**: If the user asks for "ideas" or "inspiration", activate the **`ui-ux-designer`** skill first to generate a visual spec.
1.  **Input**: User provides idea (verbal, bullets, or notes).
2.  **Research**: Briefly check `client/src/components` and `shared/src` for reusable patterns.
3.  **Proposal (MANDATORY)**:
    *   Propose the **UI/UX Structure** (e.g., "A modal with 3 steps...").
    *   Propose the **Data Flow** (e.g., "React Query -> Service -> API").
    *   **STOP** and ask: *"Does this match your vision?"*
4.  **Write file**: Once approved, create the doc in `docs/` using the appropriate template.
5.  **Output tasks for tasks.md**: Include a "Tasks for tasks.md" section with ready-to-paste lines.

---

## Focus: Task-Creator Compatibility

The output file must work with the **task-bootstrapper** and **autonomous-task-runner**. Follow these rules.

### One Task Per Branch

- Per `.cursorrules`: one task per branch.
- Each `- [Pending]` line = one branch = one focused implementation unit.
- If the idea has 4 subtasks, output 4 separate tasks (or 4 branches in a plan).

### Task Description Format for tasks.md

```
- [Pending] Short actionable description — feature/branch-slug
```

- **Short**: 5–12 words. The agent uses this for context.
- **Actionable**: Start with a verb (Add, Fix, Implement, Refactor, Create).
- **Slug**: Lowercase, hyphens, no special chars. Used for `feature/[slug]` branch name.
- **One task per line**: No combined tasks.

### Implementation Detail in the Doc

When the agent picks a task from tasks.md, it reads the **requirement doc** for details. Each task section must include:

| Element | Purpose |
|---------|---------|
| **File paths** | Exact paths: `client/src/...`, `server/src/...`, `shared/src/...` |
| **UI/UX Spec** | Visual details (e.g. "Use `Grid` layout", "Follow `Card` component style"). |
| **Changes** | What to add/change/remove. Be specific (function names, props, behavior). |
| **New vs edit** | Mark `(new)` for new files; list edits for existing files. |
| **Verification** | Commands to run: `npm run lint`, `npm run type-check`, `npm run test:run`, manual checks. |

---

## Feature Doc Template

Use for a single feature or a small set of related tasks on one branch.

```markdown
# Feature: [Title]

**Branch:** `feature/[slug]`
**Date:** [YYYY-MM-DD]

## Overview

This feature implements [N] improvements:
1. **[Task 1 name]** – [one-line summary]
...

---

## UI/UX Specification

- **Layout**: [e.g. "2-column grid on desktop, stack on mobile"]
- **Components**: [e.g. "Reuse `Card` from `client/src/components/ui`"]
- **Interactions**: [e.g. "Hover state shows edit button"]

---

## Task 1: [Name]

### Changes

- **`path/to/file.ts`** (new)
  - [What to create]

- **`path/to/existing.ts`**
  - [What to change]

### Setup (if needed)

[Env vars, config, or setup steps]

### Verification

- `npm run lint` (or specific commands)
- Manual: [what to verify]

---

## Data Flow (if applicable)

[Bullet or ASCII flow]

---

## Error Keys

- `SHARED.MODULE.KEY` – [where used]

---

## Tasks for tasks.md

Copy the following into the Pending section of `tasks.md`:

```
- [Pending] [Task 1 short description] — feature/[slug-1]
- [Pending] [Task 2 short description] — feature/[slug-2]
```
```

---

## Plan Doc Template

Use for multi-branch, phased work.

```markdown
# Plan: [Title]

## Context

[2–4 sentences: current state, problem, goal]

## Strategy

Work is split into **[N] feature branches**. Each branch produces a working state.

---

## Branch 1: `feature/[slug-1]`

**Goal**: [One sentence]

### UI/UX Spec (Specific to this branch)
- [Details]

### 1.1 [Subtask name]

- **File**: `path/to/file.ts`
- [Specific changes, line numbers if helpful]

### Verification

- [Commands and checks]

---

## Branch 2: `feature/[slug-2]`

[Same structure]

---

## Implementation Order

```
Branch 1 → Branch 2 → Branch 3 → ...
```

---

## Tasks for tasks.md

Copy the following into the Pending section of `tasks.md`:

```
- [Pending] [Branch 1 goal as task] — feature/[slug-1]
- [Pending] [Branch 2 goal as task] — feature/[slug-2]
```
```

---

## After Writing

1. Save the file to `docs/feature-{slug}.md` or `docs/plan-{slug}.md`.
2. Show the user the "Tasks for tasks.md" section.
3. Offer to append those lines to `tasks.md` if the user wants.
