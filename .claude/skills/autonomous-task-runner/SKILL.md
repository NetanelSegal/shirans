---
name: autonomous-task-runner
description: Runs the full task lifecycle autonomously: bootstrap task, implement, split subtasks to subagents if applicable, run code-review subagent, run security-accessibility-audit, then pre-push-validator. Use when user says "complete the website", "work on features", "autonomous mode", or "go ahead and finish".
---

# Autonomous Task Runner

Execute the full development cycle without stopping for confirmation.

## Workflow

1.  **Bootstrap**: Run task-bootstrapper in autonomous mode (proceed without confirmation).
2.  **Analyze task**: If the task has 2+ independent subtasks (e.g., frontend + backend, API + UI), list them and launch subagents in parallel for each.
3.  **Implement**: If subtasks were delegated, wait for subagent results, then integrate. Otherwise, implement directly.
4.  **Review**: Launch code-review-subagent on changed files.
5.  **Audit**: Run security-accessibility-audit on changed files.
6.  **Commit**: Run pre-push-validator.
7.  **Report**: Summarize what was done and what branch/commit was created.

## Triggers

- "Complete the website"
- "Work on features"
- "Autonomous mode"
- "Go ahead and finish"
- "Finish the next task"
