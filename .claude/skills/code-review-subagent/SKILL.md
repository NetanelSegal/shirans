---
name: code-review-subagent
description: Launches a subagent to review changed files for architecture, security, accessibility, and style before marking a task [Complete]. Use after implementation and before security-accessibility-audit.
---

# Code Review via Subagent

Launch a subagent to perform an independent code review of your changes.

## Workflow

1.  **Gather changed files**: Run `git diff --name-only` (or `git diff main --name-only`) to get the list of modified files.
2.  **Launch subagent**: Use `mcp_task` with:
    - `subagent_type: "generalPurpose"`
    - `description`: "Code review of [N] files"
    - `prompt`: Detailed instructions including:
      - List of file paths
      - Project architecture (Repositories → Services → Controllers)
      - Rules: SSOT, Zod validation, isomorphic-dompurify, WCAG 2.1 AA
      - Output format: `file:line:severity:issue` (severity: critical|high|medium|low)
3.  **Incorporate feedback**: Address critical and high-severity issues before marking [Complete].
4.  **Report**: Summarize findings and fixes to the user.

## Code Review Prompt Template

When launching the subagent, include:

```
You are reviewing code changes for a monorepo (client, server, shared).

**Changed files:**
[list of paths]

**Review against these criteria:**
1. Architecture: Server: Repositories → Services → Controllers. Client: Component → Hook → Service.
2. SSOT: No duplicated Zod schemas or constants; shared logic in shared/src.
3. Security: Zod validation on all API inputs; isomorphic-dompurify for HTML; no hardcoded secrets.
4. Accessibility: WCAG 2.1 AA - semantic HTML, aria-label, alt text, keyboard focus.
5. Error handling: Use HTTP_STATUS and ERROR_MESSAGES constants; HttpError class; Prisma error mapping.

**Output format:** One line per finding: file:line:severity:description
- severity: critical | high | medium | low
- Only report actual issues, not style preferences.

Return the list of findings, or "No issues found" if clean.
```
