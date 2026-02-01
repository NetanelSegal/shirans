# Shirans Portfolio - Monorepo

Portfolio website for architecture/interior design professional (Shiran Gilad).

## Project Structure

```
shirans/
├── client/          # React + TypeScript frontend (Vite)
├── server/          # Node.js + Express backend (TypeScript, Prisma)
└── package.json     # Root workspace configuration
```

## Tech Stack

### Frontend (Client)
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend (Server)
- Node.js + Express
- TypeScript (Strict Mode)
- Prisma ORM (PostgreSQL)
- Winston (Logging)

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL database

### Installation

Install all dependencies (client + server):
```bash
npm install
```

Or install individually:
```bash
npm install --workspace=client
npm install --workspace=server
```

### Development

Run both client and server concurrently from root:
```bash
npm run dev
```

Run individually:
```bash
# Client only (port 5174)
npm run dev:client

# Server only (port 3000)
npm run dev:server
```

### Server Setup

1. Copy environment variables:
   ```bash
   cp server/.env.example server/.env
   ```

2. Fill in `.env` with your database credentials

3. Generate Prisma client:
   ```bash
   npm run prisma:generate --workspace=server
   ```

### Build

Build both client and server:
```bash
npm run build
```

Build individually:
```bash
npm run build:client
npm run build:server
```

### Linting

Lint all workspaces:
```bash
npm run lint
```

Lint individually:
```bash
npm run lint:client
npm run lint:server
```

## Workspace Scripts

### Client (`client/`)
- `dev` - Start Vite dev server
- `build` - Build for production
- `lint` - Run ESLint
- `preview` - Preview production build

### Server (`server/`)
- `dev` - Start Express dev server with nodemon
- `build` - Compile TypeScript
- `start` - Run production server
- `lint` - Run ESLint
- `type-check` - TypeScript type checking
- `prisma:generate` - Generate Prisma client
- `prisma:migrate` - Run database migrations
- `prisma:studio` - Open Prisma Studio

## API Endpoints

- `GET /api/health` - Health check endpoint

## Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Run linting and type checks before committing
4. Commit with conventional commits
5. Push to feature branch for review

## License

ISC