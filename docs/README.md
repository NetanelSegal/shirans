# Shiran Gilad Portfolio - Documentation

This directory contains the system documentation, architectural designs, and development progress for the **Shiran Gilad Architecture & Interior Design** website.

## Folder Index

| Folder | Purpose | Key Contents |
| :--- | :--- | :--- |
| **00-Context** | Project Pulse | Task tracking, current progress, and historical logs. |
| **01-Discovery** | Brand & Vision | Portfolio goals, target audience, and brand philosophy. |
| **02-Frameworks** | Tech Stack | Monorepo setup, Prisma configuration, React/Tailwind specs. |
| **03-PRDs** | Requirements | Functional requirements for Project Management, Admin Panel, and Calculator. |
| **04-Architecture** | System Design | Prisma Schema, API Routes, Controller-Service-Repository pattern. |
| **05-Design** | UI/UX | RTL standards, Typography (Assistant font), and Project imagery guidelines. |
| **06-Development** | Workflow | Monorepo coordination, Git flow, deployment (Railway, Netlify), and manual database migrations. |
| **07-Tests** | Quality | Playwright E2E testing scenarios and Vitest integration tests. |
| **08-Feedback** | Iteration | Shiran's reviews and what was done with each item — read before changing something she has commented on. |
| **99-Archive** | History | Deprecated features or older project versions. |

## Access Rules

- **Daily Tasks:** Refer to `00-Context/tasks.md` for active work items.
- **System Design:** Refer to `04-Architecture/index.md` and `@server/prisma/schema.prisma`.
- **UI Modifications:** Refer to `05-Design/brand-guide.md` and the `client/src/components/ui/` library. The design tokens in `client/src/styles/tokens.css` are the source of truth.
- **Page copy & SEO:** Refer to `03-PRDs/seo-brief.md` before changing a URL, title, description or H1.
- **Deploying or migrating:** Refer to `06-Development/index.md` — migrations are manual, and the database is remote.
- **Incidents:** Open ones are listed under *Current Focus* in `00-Context/progress.md`.
- **Testing:** Always refer to `07-Tests/index.md` before running E2E suites.
