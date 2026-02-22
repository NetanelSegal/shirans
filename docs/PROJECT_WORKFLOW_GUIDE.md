# Shirans Project Workflow Guide

This guide explains all the ways you can work in this project with AI assistance, from manual step-by-step workflows to fully autonomous development.

---

## Table of Contents

1. [Quick Reference: What to Say](#quick-reference-what-to-say)
2. [Workflow Modes](#workflow-modes)
3. [Skills Reference](#skills-reference)
4. [Task Management](#task-management)
5. [Autonomous Development (Mega-Agent)](#autonomous-development-mega-agent)
6. [Subagent Usage](#subagent-usage)
7. [Pre-Commit Checklist](#pre-commit-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Quick Reference: What to Say

| You Want To… | Say This |
|--------------|----------|
| Start the next task | "Start next task" or "Pick next task" |
| Work autonomously on features | "Complete the website" or "Work on features" or "Go ahead" |
| Commit and push your changes | "Ready to commit" or "Ready to push" |
| Audit security and accessibility | "Audit this task" |
| Refactor code | "Refactor [X]" or "Improve architectural consistency" |
| Review UI/design | "Review my UI" or "Check accessibility" or "Audit design" |
| Run without confirmation | "Autonomous" or "No confirmation" or "Go ahead" |

---

## Workflow Modes

### 1. Manual Step-by-Step

You control each step. Best when you want to review before the AI proceeds.

**Flow:**
1. Say **"Start next task"** → AI picks a task, creates branch, asks for confirmation
2. You confirm → AI implements
3. Say **"Audit this task"** → AI runs security & accessibility checks
4. Say **"Ready to commit"** → AI runs lint/type-check/tests, then commits

### 2. Semi-Autonomous

AI proceeds without asking for confirmation on task selection.

**Flow:**
1. Say **"Start next task, go ahead"** or **"Pick next task, autonomous"**
2. AI bootstraps and implements without stopping
3. You can still say **"Audit this task"** and **"Ready to commit"** when done

### 3. Fully Autonomous (Mega-Agent)

AI runs the entire lifecycle via the **Mega-Agent Orchestrator**.

**Flow:**
1. Say **"Complete the website"** or **"Work on features"** or **"Go ahead and finish"**
2. AI activates the **Mega-Agent Orchestrator**:
   - **Pre-check**: Exits if no [Pending] tasks in `tasks.md`.
   - **Pre-execution (mandatory)**: Asks targeted questions, proposes subtasks, **waits for your approval** before any code.
   - **UI subtasks**: Activates `ui-ux-designer` skill, asks design questions, obtains design sign-off before implementation.
   - **Manifest**: Creates `.claude/active-task/manifest.md` to track state (after approval).
   - **Subtasks**: Breaks work into isolated contexts (e.g., API, UI).
   - **Sync**: Ensures shared types/contracts are updated in real-time.
   - **Validation**: Runs `npm run type-check` after every subtask (stops after 3 failures).
   - **Review**: Runs code review and security audits on all changed files.
   - **Commit**: Stages and commits if tests pass.
   - **Docs**: Updates `progress.md` and `tasks.md` with completion summary and visual proof (for UI tasks).

---

## Skills Reference

| Skill | Trigger | What It Does |
|-------|---------|--------------|
| **task-bootstrapper** | "Start next task", "Pick next task" | Reads `tasks.md`, picks next [Pending] task, creates branch, updates `progress.md` |
| **autonomous-task-runner** | "Complete the website", "Work on features", "Autonomous", "Go ahead" | Full lifecycle via Mega-Agent Orchestrator |
| **mega-agent-orchestrator** | Activated by autonomous runner | Manages subtask execution and context synchronization |
| **idea-to-requirement** | "Turn this into a requirement" | Creates strict requirement docs with **Mandatory Design Sign-off** |
| **pre-push-validator** | "Ready to commit", "Ready to push" | Runs lint, type-check, tests; stages files; generates Conventional Commit; commits |
| **security-accessibility-audit** | "Audit this task", before [Complete] | Security scan + WCAG 2.1 AA accessibility check |
| **code-review-subagent** | Before [Complete] (after implementation) | Launches subagent to review changed files |
| **context-refactor** | "Refactor [X]", "Improve architectural consistency" | SSOT analysis, dependency mapping, refactor with type-check |
| **web-design-review** | "Review my UI", "Check accessibility", "Audit design" | Fetches Vercel Web Interface Guidelines, checks files |
| **ui-ux-designer** | "Give me design ideas", "Search for inspiration", "Make it look good", **Before client UI (Mega-Agent)** | Web search for design trends, competitor analysis, visual specs; **mandatory before UI implementation** |

---

## Task Management

### Task Format in `tasks.md`

```markdown
## Active
- [Active] Task name — feature/branch-slug

## Pending
- [Pending] Task description
- [Pending] Another task

## History
### Task Name
One-sentence summary of what was done.
```

### Task Lifecycle

- **[Pending]** → Not started
- **[Active]** → Branch created, work in progress
- **[WIP]** → Shown in `progress.md` while implementing
- **[Complete]** → Moved to History with summary

### Adding a New Task

Add a line under `## Pending`:

```markdown
- [Pending] Add contact form with validation
```

The AI will create a branch like `feature/add-contact-form-with-validation` when it starts.

---

## Autonomous Development (Mega-Agent)

### When to Use

- You have a list of tasks and want the AI to work through them
- Tasks are well-defined and independent
- You trust the AI to follow project rules

### How It Works

1. **Task bootstrapping**: AI reads `tasks.md`, picks first [Pending], creates branch
2. **Pre-execution (mandatory)**: AI asks targeted questions, proposes subtasks, **waits for your approval** before any code
3. **UI design phase**: For client-side UI work, AI activates `ui-ux-designer`, asks design questions, obtains design sign-off
4. **Subtask splitting**: If a task has 2+ independent parts (e.g., API + UI), AI launches subagents in parallel (simulated via context switching)
5. **Implementation**: AI implements directly or integrates subagent results
6. **Code review**: AI launches a subagent to review changed files
7. **Audit**: Security & accessibility checks
8. **Commit**: Lint, type-check, tests, then Conventional Commit

### Example Prompt

```
Complete the website autonomously. Use the autonomous-task-runner skill.
Proceed without asking for confirmation.
```

---

## Subagent Usage

Subagents are separate AI instances that don't see your main conversation. Use them for:

### 1. Parallel Subtasks

When a task has independent parts:

- **Example**: "Add newsletter API" + "Add newsletter signup form"
- AI launches 2 subagents (one for API, one for UI)
- Integrates results when both finish

### 2. Code Review

After implementation, before marking [Complete]:

- AI runs `git diff --name-only` to get changed files
- Launches subagent with file list and review criteria
- Subagent returns findings as `file:line:severity:issue`
- AI fixes critical/high issues before finalizing

### 3. Codebase Exploration

When the AI needs to search broadly:

- Use `subagent_type: "explore"` with thoroughness "medium" or "very thorough"
- Example: "Find all API endpoints that need rate limiting"

---

## Pre-Commit Checklist

Before you (or the AI) commit, these must pass:

1. **`npm run lint`** — No lint errors
2. **`npm run type-check`** — No TypeScript errors
3. **`npm run test:run`** — All tests pass
4. **`git diff --cached`** — No `.env`, lockfiles, or build artifacts staged

### Protected Paths (Never Stage Without Explicit Approval)

- `.env`, `.env.*`, `*.local`
- `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`
- `prisma/schema.prisma` (use `prisma migrate` for schema changes)
- `server/dist/`, `client/dist/`, `shared/dist/`

---

## Troubleshooting

### "AI keeps asking for confirmation"

Say **"Go ahead"** or **"Autonomous"** or **"No confirmation"** when starting a task.

### "AI didn't run the audit before marking complete"

Remind it: "Before marking [Complete], run security-accessibility-audit and code-review-subagent."

### "Lint/type-check/tests fail"

The AI should fix these. If it doesn't:
- **Lint**: Run `npx eslint . --fix` in the affected workspace (client or server)
- **Type-check**: Fix type errors; avoid `any` or `@ts-ignore`
- **Tests**: Fix failing tests; don't skip without your approval

### "Subagent didn't return useful feedback"

Ensure the prompt includes:
- Full list of changed file paths
- Clear output format (`file:line:severity:issue`)
- Project rules (architecture, SSOT, security, a11y)

### "tasks.md format is wrong"

Use this structure:
- `## Active` — Current task with branch name
- `## Pending` — List of `- [Pending] Task description`
- `## History` — Completed tasks with 1-sentence summaries

---

## File Locations

| Purpose | Location |
|---------|----------|
| Tasks | `tasks.md` (root) |
| Progress | `progress.md` (root) |
| AI Rules | `.cursorrules` (root) |
| Project Standards | `.claude/rules/project-standards.md` |
| Error Handling | `.claude/rules/error-management.md` |
| Form Patterns | `.claude/rules/form-management.md` |
| React Performance | `.claude/rules/react-performance.md` |
| Skills | `.claude/skills/*/SKILL.md` |

---

## Summary

- **Manual**: "Start next task" → confirm → implement → "Audit this task" → "Ready to commit"
- **Semi-autonomous**: Add "go ahead" or "autonomous" to skip confirmation
- **Fully autonomous**: "Complete the website" or "Work on features" for end-to-end execution via **Mega-Agent**.
- **Subagents**: Used automatically for parallel subtasks and code review.
- **Always**: Lint, type-check, and tests must pass before commit.
