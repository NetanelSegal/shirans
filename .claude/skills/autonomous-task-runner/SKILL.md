---
name: autonomous-task-runner
description: Runs the full task lifecycle autonomously using the Mega-Agent Orchestrator. Bootstrap task, implement (split to subagents if applicable), run code-review subagent, run security-accessibility-audit, then pre-push-validator. Use when user says "complete the website", "work on features", "autonomous mode", or "go ahead and finish".
---

# Autonomous Task Runner

Execute the full development cycle without stopping for confirmation.

## Workflow

0.  **Pre-check**: Read `tasks.md`. If no `[Pending]` tasks exist, report "No pending tasks. Add tasks to tasks.md or run idea-to-requirement first." and exit.
1.  **Bootstrap**: Run `task-bootstrapper` in autonomous mode (proceed without confirmation).
2.  **Orchestrate (Mega-Agent)**: Activate `mega-agent-orchestrator` skill to manage the task execution.
    - **Pre-execution**: Ask targeted questions, propose subtasks, **wait for user approval** before any code.
    - **UI subtasks**: Activate `ui-ux-designer` skill, ask design questions, obtain design sign-off before implementation.
    - Create `.claude/active-task` manifest (after approval).
    - Break down subtasks (e.g., API vs UI).
    - Execute sequentially, updating manifest with contract changes.
    - Validate with `npm run type-check` at every step. **If type-check fails 3 times in a row**, stop the flow and report the error to the user; do not retry indefinitely.
3.  **Review**: Launch `code-review-subagent` on changed files.
4.  **Audit**: Run `security-accessibility-audit` on all changed files (from `git diff main --name-only`).
5.  **Commit**: Run `pre-push-validator`.
6.  **Update Docs**: Before reporting:
    - Move the task from `[Active]` to `## History` in `tasks.md` with a 1-sentence summary.
    - Add the completed task to `progress.md` under `## History` with a 1-sentence summary.
    - For UI tasks: include the visual proof (layout, components, interactions) in the `progress.md` History entry.
7.  **Report**: Summarize what was done and what branch/commit was created.

## Triggers

- "Complete the website"
- "Work on features"
- "Autonomous mode"
- "Go ahead and finish"
- "Finish the next task"
