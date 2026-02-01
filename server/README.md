# Shirans Backend Server

Backend server for the Shirans portfolio website built with Node.js, Express, TypeScript, and Prisma ORM.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript (Strict Mode)
- **ORM:** Prisma (PostgreSQL)
- **Logging:** Winston
- **Architecture:** Controller-Service-Repository pattern

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required environment variables:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production/test)
- `DATABASE_URL` - PostgreSQL connection string
- `CORS_ORIGIN` - Frontend origin (default: http://localhost:5174)

### 3. Database Setup

Generate Prisma client:
```bash
npm run prisma:generate
```

Run migrations (when models are added):
```bash
npm run prisma:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server (requires build first)
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types without building
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio GUI

## Project Structure

```
server/
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   ├── repositories/    # Data access layer
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration files
│   ├── app.ts           # Express app setup
│   └── index.ts         # Server entry point
├── prisma/
│   └── schema.prisma    # Prisma schema
└── dist/                 # Compiled JavaScript (generated)
```

## API Endpoints

### Health Check
- `GET /api/health` - Returns server status and timestamp

## Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make changes following the project's TypeScript and code style guidelines
3. Run `npm run lint` and `npm run type-check` before committing
4. Commit with conventional commits: `feat:`, `fix:`, `refactor:`, etc.
5. Push to feature branch and wait for review

## Code Quality

Before committing, ensure:
- ✅ `npm run lint` passes with no errors
- ✅ `npm run build` succeeds
- ✅ `npm run type-check` passes
- ✅ All functions have explicit return types
- ✅ No `any` types (use `unknown` when needed)
- ✅ Interfaces used instead of types for object shapes

## Environment Variables

All environment variables are validated on startup. Missing required variables will cause the server to fail with descriptive error messages.

## Logging

Logging is handled by Winston:
- **Development:** Pretty console output with colors
- **Production:** JSON format for structured logging
- Request logging middleware logs all HTTP requests

## Error Handling

Global error handling middleware catches all errors and returns consistent error responses. In development, stack traces are included. In production, error details are hidden for security.

## Database

Prisma ORM is used for database access. The Prisma client is configured as a singleton to prevent connection pool exhaustion.

## License

ISC
