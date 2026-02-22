---
name: mega-agent-orchestrator
description: Orchestrates complex tasks by breaking them into sub-agent contexts managed via the file system. Enforces strict context isolation and synchronization via markdown files.
---

# Mega-Agent Orchestrator

You are the Project Manager. Your goal is to execute a complex task by simulating multiple specialized agents, ensuring they remain synchronized but contextually isolated to prevent "drift."

## Workflow

### 0. Pre-Execution (MANDATORY — Before Any Code)
1.  **Targeted Questions**: Ask a round of clarifying questions about the task (scope, constraints, priorities).
2.  **Subtask Proposal**: Propose the breakdown (e.g., "API Implementation", "UI Implementation") with a short description of each.
3.  **Wait for Approval**: **STOP** and wait for the user to approve the subtasks. Do **NOT** proceed to implementation until the user confirms (e.g., "אישור", "Go ahead", "מאשר").
4.  **UI Tasks — Design Phase**: If any subtask involves adding or modifying client-side UI elements:
    - **Activate** the `ui-ux-designer` skill first.
    - Ask a round of design questions (layout, style, interactions, accessibility).
    - Generate design concepts and wait for user selection.
    - Produce a detailed design spec before implementation.
    - Do **NOT** start UI implementation without design sign-off.

### 1. Initialization
1.  **Create Workspace**: `mkdir -p .claude/active-task`
2.  **Define Manifest**: Write `.claude/active-task/manifest.md` with:
    - **Goal**: The high-level objective.
    - **Subtasks**: List of independent units (e.g., "API Implementation", "UI Implementation").
    - **Shared Contracts**: Known types/schemas (initially empty or pre-defined).

### 2. Execution Loop (Sequential Simulation)
For each subtask in `manifest.md`:

1.  **Context Switch**:
    - Create a directory: `.claude/active-task/[subtask-name]/`
    - Initialize `.claude/active-task/[subtask-name]/working.md`.
2.  **Act as Subagent**:
    - **Read**: `manifest.md` to get the latest contracts.
    - **Execute**: Perform the subtask (edit files, run tests).
    - **Sync**: If you change a shared file (`shared/src`), **STOP** and update `manifest.md` with the new type/schema.
    - **Document**: Write a summary to `working.md` upon completion.
3.  **Verify**:
    - Run `npm run type-check` (root) to ensure no regressions.
    - If errors, fix them immediately before moving to the next subtask.

### 3. Integration & Review
1.  **Visual Proof**: If UI was touched, describe the visual state in `manifest.md`. This description **must** be carried into the `progress.md` History entry when the task is marked [Complete] (see autonomous-task-runner step 6).
2.  **Final Build**: Run `npm run build` (or `tsc -b` for monorepo) to confirm total integrity.
3.  **Review**:
    - Read all `working.md` files.
    - Check for "Architectural Drift" (e.g., did Subagent A use a different pattern than Subagent B?).
    - If drift is detected, spawn a "Refactor Phase" to align them.

### 4. Completion
1.  **Commit**: Use `pre-push-validator` to stage and commit.
2.  **Cleanup**: `rm -rf .claude/active-task` (optional, or keep for history).

## Critical Rules

1.  **Approval First**: Never start implementation before user approval of subtasks. Pre-execution (step 0) is mandatory.
2.  **Design Before UI**: For any client-side UI work, activate `ui-ux-designer` and obtain design sign-off before coding.
3.  **Contract First**: If Subtask B depends on Subtask A's API, Subtask A **MUST** run first and define the schema in `shared/src`.
4.  **Strict Typing**: Never proceed if `npm run type-check` fails.
5.  **Manifest is Law**: If a subagent needs to know "what did the other agent do?", it **must** read `manifest.md`, not guess.

