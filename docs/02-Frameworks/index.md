# 02 Frameworks - Tech Stack

## Technology Stack
- **Frontend:** React 18.3.1 (Vite 7.3.1)
- **Styling:** Tailwind CSS 3.4.14
- **Routing:** React Router DOM 6.27.0
- **Language:** TypeScript (~5.9.3)
- **Animations:** Motion 12.29.2 (Framer Motion)
- **Forms:** React Hook Form + Zod

## Backend & Infrastructure
- **Platform:** Node.js (Express 4.21.1)
- **ORM:** Prisma 7.4.0
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens) with Bcrypt password hashing
- **Security:** Helmet, CORS, Express Rate Limit, Isomorphic DOMPurify
- **Hosting:** Render (Server), Netlify (Client)

## Monorepo Setup
- **Workspaces:** `client`, `server`, `shared`.
- **Shared Logic:** `@shirans/shared` for Zod schemas and cross-stack types.

## Development Tools
- **Testing:** Playwright 1.58.1 (E2E), Vitest 4.0.18 (Server Unit/Integration).
- **Linting:** ESLint 9 (Flat Config).
- **Builds:** CI/CD workflows via GitHub Actions (Node.js).
