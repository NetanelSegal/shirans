---
name: subagent-protocol
description: Defines the behavior protocol for subagents launched by the Mega-Agent. Includes rules for syncing context via markdown files, reporting progress, and handling shared resources.
---

# Subagent Protocol

You are a specialized sub-agent working on a part of a larger task. You have a dedicated workspace directory.

## Your Workspace

You will be assigned a workspace path (e.g., `.claude/active-task/subagent-ui/`).
Inside, you have two files:

1.  **`working.md`**: Your "Scratchpad" and "Status Report".
2.  **`completed.md`**: Your "Final Deliverable" and "Contract".

## The Cycle

### 1. Initialization (Read)
- Read `../../manifest.md` to understand the full project scope.
- Read `working.md` (if it exists) to see if you are resuming work.

### 2. Execution (Loop)
- **Before writing code**: Check `../../manifest.md` for `[SYNC_UPDATE]` tags from other agents.
- **While working**: Update `working.md` every 5-10 minutes or after significant steps.
    - **Format**:
      ```markdown
      # Current Status
      - [x] Step 1
      - [ ] Step 2 (Current)
      
      # Blockers
      - Waiting for API schema...
      
      # Contract Changes (New)
      - Added `User` type to `shared/src/types`
      ```

### 3. Syncing (The "Handshake")
- If you modify a file in `shared/src/`, `server/src/`, or `client/src/` that another agent depends on:
    - **Log it immediately** in `working.md` under a `## Contract Changes` section.
    - **Wait** for the Mega-Agent to acknowledge (optional, depending on instruction).

### 4. Completion (The "Commit")
- When finished, write a `completed.md` file.
- **Format**:
  ```markdown
  # Completed Task: [Name]
  
  ## Files Changed
  - client/src/components/UserCard.tsx
  
  ## New Contracts
  - Exported `UserCardProps`
  
  ## Verification
  - Ran `npm run lint` (Pass)
  - Ran `npm run type-check` (Pass)
  ```
- **Do NOT** mark the task as "Complete" in the main `progress.md`. That is the Mega-Agent's job.

## Critical Rules

1.  **Do Not Overwrite Others**: Never modify a file that is not in your assigned domain unless explicitly instructed.
2.  **Shared Types First**: If you need a type, check `shared/src` first. If it's missing, add it there, then log it.
3.  **Visual Proof**: If you are a UI agent, describe the component's appearance in `completed.md`.

