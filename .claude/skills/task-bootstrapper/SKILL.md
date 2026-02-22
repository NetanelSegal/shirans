---
name: task-bootstrapper
description: Reads `tasks.md`, picks the next approved task, creates the feature branch, and updates `progress.md`. Use when starting a new task or asked to "start next task".
---

# Task Bootstrapper

Pick and initialize the next task from `tasks.md`.

## Workflow

1.  **Select Task**: Read the root `tasks.md` and identify the next `[Pending]` task. If none exist, report "No [Pending] tasks in tasks.md." and exit.
2.  **Confirmation**: If user has not explicitly requested autonomous mode ("go ahead", "autonomous", "no confirmation"), confirm: "I am starting task: [Task Name]. Proceed?" Otherwise, proceed without asking.
3.  **Branch Slug**: Derive the branch name `feature/[slug]`:
    - If the task line includes `— feature/[slug]` (e.g. `— feature/add-contact-form`), use that slug.
    - Otherwise, derive a slug from the task description: lowercase, hyphens, 5–12 words max (e.g. "Add contact form with validation" → `add-contact-form-with-validation`).
4.  **Create progress.md if missing**: If `progress.md` does not exist at root, create it with:
    ```markdown
    # Progress

    ## History
    (Completed tasks go here)
    ```
5.  **Branch Creation**: Run `git checkout -b feature/[slug]` (using the slug from step 3).
6.  **Update tasks.md**: Change the task status from `[Pending]` to `[Active]`, and add the branch name: `[Active] Task name — feature/[slug]`.
7.  **Initialize progress.md**: Add a new entry:
    ```markdown
    ## [Task Name] - [Date] - [Status: WIP]
    ```

## Post-Completion

Ensure you're on the new branch before writing any code.
