# Cursor Guidelines & Task Management

This directory contains guidelines, best practices, and task management for the project.

## Structure

### Guidelines
- `react-best-practices/` - React and Next.js performance optimization guidelines
- `web-design-guidelines/` - Web interface design and accessibility guidelines

### Task Management Files
- `README.md` (this file) - **How to work**: Git workflow, process guidelines, and task management flow
- `tasks.md` - **What to do**: Actual tasks and subtasks organized by category
- `progress.md` - **What's happening**: Current work status and progress updates

---

## Workflow: How to Handle Tasks

### When Receiving a Task:
1. **Clarify**: If anything is unclear, ask at least **three clarifying questions** before proceeding
2. **Break Down**: If the task is large (cannot be described in two sentences), break it into smaller, manageable subtasks
3. **Document**: Add the original task and its breakdown to "Pending Approval" section in `tasks.md`
4. **Wait**: Wait for approval before proceeding
5. **Execute**: Once approved, move subtasks to "Active Tasks" and begin work
6. **Update Progress**: Update `progress.md` with current work status
7. **Submit for Review**: When task is complete:
   - **Check for errors**: Always verify no linting errors, build errors, or TypeScript errors
   - **Test**: Ensure code compiles and runs without errors
   - **Commit and push**: `git add .`, `git commit`, `git push` to feature branch (do NOT merge to main)
8. **Wait for Review**: Wait for review approval via GitHub
9. **Complete**: Only after review approval, mark task as complete (user handles merge to main)

### Clarification Requirements:
- **If anything is unclear, ask at least 3 clarifying questions**
- Questions should cover: scope, requirements, constraints, expected outcomes, or technical details
- Do not proceed with breakdown or execution until clarifications are received
- Only continue after receiving answers to all questions

### Task Breakdown Guidelines:
- Each subtask should be clear and actionable
- Subtasks should be independent enough to be worked on separately
- Complex tasks should be broken into logical steps
- Always wait for approval before starting work

---

## Git Workflow

### Feature Branch Strategy
- **Create a feature branch for each task** (e.g., `feature/replace-testimonials`, `feature/fix-image-modal`)
- Work on the task in its dedicated branch
- Make **small, logical commits** as work progresses (at meaningful checkpoints, not necessarily every subtask)
- This allows:
  - Easy navigation between tasks (`git checkout <branch-name>`)
  - Testing different approaches without affecting main branch
  - Easy rollback if issues arise (`git reset --hard <commit-hash>` or `git revert`)
  - Clean history with descriptive commit messages

### Commit Guidelines
- Commit messages should be clear and descriptive
- Commit when a logical unit of work is complete
- Use conventional commit format when possible: `feat:`, `fix:`, `refactor:`, etc.
- Each commit should represent a working state (code compiles, no obvious errors)

### Branch Management
- Keep feature branches focused on a single task
- When task is complete: commit and push to feature branch, then wait for review
- **Never merge to main** - user handles all merges after review
- User will delete feature branch after successful merge

---

## Task Management Flow

### Task Lifecycle
1. **Task Received** → Add to `tasks.md` under "Pending Approval" with breakdown
2. **Approval Given** → Move to "Active Tasks" in `tasks.md`, create feature branch, update `progress.md`
3. **Work In Progress** → Update `progress.md` with current status and what you're working on
4. **Subtask Complete** → Make Git commit, update `progress.md`
5. **Task Complete** → Check for errors (linting, build, TypeScript) → `git add .`, `git commit`, `git push` to feature branch
6. **Await Review** → Wait for review approval via GitHub
7. **Review Approved** → User will merge branch to main, then move to "Completed Tasks" in `tasks.md`, update `progress.md`

### Important: Review Process
- **You do NOT decide when a task is complete** - tasks require review before completion
- **You NEVER merge to main** - only push to feature branch, user handles merges
- **Always check for errors before pushing**: Verify no linting errors, build errors, or TypeScript errors
- When you finish a task: Check for errors → `git add .`, `git commit`, `git push` to the feature branch
- Review happens via GitHub - wait for approval
- Only mark tasks as "Completed" after review approval and user confirms merge

### File Responsibilities
- **`tasks.md`**: Contains all tasks (Pending Approval, Active, Completed) and subtasks
- **`progress.md`**: Contains current work status, what's being worked on right now, and progress log
- **`README.md`** (this file): Contains the process, workflow, and Git guidelines

---

## Task Categories

- **Tasks**: Active development tasks and features
- **Technologies**: Technology adoption and setup
- **Tips**: Helpful tips and optimizations
- **Best Practices**: Best practices to implement

---

## Notes

- **Critical**: If anything is unclear, ask at least **3 clarifying questions** before proceeding
- **Important**: Large tasks must be broken down into smaller pieces before execution
- Approval is required before starting work on any task
- Tasks assigned to Auto (AI agent) should be executable independently
- Each task should include sufficient context for completion
- Progress should be updated regularly in `progress.md`
