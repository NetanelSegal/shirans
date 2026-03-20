# 04 Architecture - System Design

## System Overview
The Shiran Gilad website is a monorepo-based application consisting of three main packages: `client`, `server`, and `shared`. It uses a shared logic layer for type safety and validation across the stack.

## Data Layer & Prisma
The application uses PostgreSQL as the primary database, managed through Prisma ORM.

- **Schema:** Defined in `server/prisma/schema.prisma`.
- **Validation:** Shared Zod schemas in `@shirans/shared` are used in both the frontend (forms) and backend (validators).

## Backend Architecture
- **Framework:** Node.js + Express.
- **Pattern:** Controller-Service-Repository pattern.
    - **Controllers:** Handle HTTP requests and responses.
    - **Services:** Orchestrate business logic and database operations.
    - **Repositories:** Interact with the Prisma client directly.
- **Authentication:** JWT (JSON Web Tokens) with refresh tokens and `cookie-parser`.

## Frontend Architecture
- **Framework:** React 18 + Vite.
- **Routing:** Centralized React Router configuration in `client/src/App.tsx`. Public routes (Home, Process, Projects, `/calculator`) use main Layout (Navbar + Footer); admin routes under `/admin` use Dashboard layout.
- **State Management:** TanStack Query for cacheable API data (projects, categories, testimonials, calculator config, admin data). Custom React Contexts (Auth, Projects, Categories, Screen) wrap `useQuery` where shared.
- **Styling:** Tailwind CSS with RTL (Hebrew) focus.
- **Components:** Custom UI library in `client/src/components/ui/`.

## Deployment & Environments
- **Render:** Hosts the Node.js/Express server and PostgreSQL database.
- **Netlify:** Hosts the React/Vite frontend.
- **CORS:** Configured in `server/src/app.ts` to allow requests from Netlify domains.
- **Environment Variables:** Managed via `.env` files and `server/src/utils/env.ts`.

## Data Flow (Lead Generation)
1. User completes the Contact Form or Cost Calculator on the client.
2. **Calculator:** Public landing at `/calculator` fetches `GET /api/calculator/config` for pricing; admin calculator at `/admin/calculator` uses the same config. Both submit to `POST /api/calculator/leads` (rate limited).
3. The client validates the data using Zod and sends a POST request to the server.
4. The server's validator middleware confirms the data shape using the same Zod schema from `@shirans/shared`.
5. The controller calls the service, which creates a `ContactSubmission` or `CalculatorLead` record in PostgreSQL via Prisma.
6. The admin is notified (optional) and can review the lead in the Admin Dashboard.
