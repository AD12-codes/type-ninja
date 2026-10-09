# ad-stack

A modern full-stack TypeScript monorepo built with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack). Features social authentication, PostgreSQL with Drizzle ORM, Redis caching, and a React frontend with file-based routing.

---

## ⚡ First Step After Cloning

This is a **template repository**. Before doing anything else, run the rename script to replace every occurrence of `ad-stack` (package names, imports, config files) with your own project name and reinstall dependencies:

```bash
bash scripts/rename-project.sh
```

The script will:

1. Ask you for a project name (lowercase letters, numbers, hyphens — e.g. `my-app`)
2. Replace `ad-stack` everywhere across the entire monorepo — `package.json` files, TypeScript source, config files, and more
3. Delete the stale `bun.lock` and run `bun install` so all `@your-name/*` workspace packages resolve correctly

> You only need to run this **once**, right after cloning. After that, every Turborepo command (`bun dev`, `bun run db:push`, etc.) will use your project name automatically.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | [Bun](https://bun.sh) |
| **Server** | [Hono](https://hono.dev) |
| **Frontend** | React 19, [TanStack Router](https://tanstack.com/router) (file-based), [TanStack Query](https://tanstack.com/query), [Zustand](https://zustand-demo.pmnd.rs) |
| **Database** | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team) |
| **Cache** | [Redis](https://redis.io) (ioredis) |
| **Auth** | [Better Auth](https://www.better-auth.com) (Google & GitHub OAuth) |
| **UI** | [Tailwind CSS](https://tailwindcss.com) v4, [shadcn/ui](https://ui.shadcn.com) (base-lyra style), [Tabler Icons](https://tabler.io/icons) |
| **Monorepo** | [Turborepo](https://turbo.build), Bun workspaces |
| **Linting** | [Biome](https://biomejs.dev), ultracite |
| **Git hooks** | [Husky](https://typicode.github.io/husky) + lint-staged |

## Project Structure

```
ad-stack/
├── apps/
│   ├── server/                    # Hono API server (Bun runtime)
│   │   └── src/
│   │       ├── app.ts             # Hono app (middleware, CORS, auth handler)
│   │       ├── index.ts           # Bootstrap (DB, Redis, Auth init + graceful shutdown)
│   │       └── routes/
│   │           ├── index.ts       # Route mounting (/api/v1)
│   │           └── health.ts      # GET /api/v1/health
│   │
│   └── web/                       # React SPA (Vite + TanStack Router)
│       └── src/
│           ├── components/
│           │   ├── auth/          # Auth components (auth-card, social-login-button)
│           │   ├── dashboard/     # Dashboard components (header, user-profile-card)
│           │   └── ui/            # shadcn/ui primitives (button, card, avatar, etc.)
│           ├── lib/
│           │   ├── auth-client.ts # Better Auth React client
│           │   ├── query-client.ts# TanStack Query client config
│           │   └── utils.ts       # cn() utility
│           ├── routes/
│           │   ├── __root.tsx     # Root layout
│           │   ├── index.tsx      # / → redirects to /dashboard or /login
│           │   ├── login.tsx      # Login page (Google + GitHub)
│           │   ├── signup.tsx     # Signup page (Google + GitHub)
│           │   └── dashboard.tsx  # Protected dashboard (user profile)
│           ├── store/
│           │   ├── app-store.ts   # Zustand store
│           │   ├── selectors.ts   # Store selectors
│           │   └── slices/        # Store slices (ui-slice)
│           ├── index.css          # Tailwind + theme variables
│           └── main.tsx           # App entry point
│
├── packages/
│   ├── auth/                      # Better Auth config (OAuth, Polar, plugins)
│   ├── config/                    # Shared TypeScript config (tsconfig.base.json)
│   ├── core/                      # Shared utilities (pino logger)
│   ├── db/                        # Database layer (Postgres pool, Drizzle, Redis, schema, migrations)
│   ├── env/                       # Environment validation (t3-env for server + web)
│   └── health/                    # Health check service (DB + Redis checks)
│
├── biome.json                     # Biome config
├── turbo.json                     # Turborepo pipeline config
└── package.json                   # Workspace root
```

## Packages

### `@ad-stack/auth`

Better Auth setup with lazy initialization. Supports **Google** and **GitHub** OAuth social sign-in. Includes Polar integration (checkout, portal, webhooks), admin plugin, and OpenAPI plugin. Uses Drizzle adapter for PostgreSQL and Redis for session secondary storage.

### `@ad-stack/db`

Database layer with PostgreSQL (via `pg` pool) and Drizzle ORM. Provides `createPool()` / `getPool()` for connection management and `getDB()` for the Drizzle instance. Includes Redis client (ioredis) for caching and session storage. Schema defined in `src/schema/auth.ts` with users, accounts, and verifications tables.

### `@ad-stack/env`

Type-safe environment variable validation using `@t3-oss/env-core` and Zod. Separate configs for server (`server.ts`) and web (`web.ts` with `VITE_` prefix).

### `@ad-stack/core`

Shared utilities. Exports a pino logger (`@ad-stack/core/logger`).

### `@ad-stack/health`

Health check service that runs DB and Redis checks in parallel. Returns status (`ok` or `degraded`), per-service latency, and metadata (uptime, environment). Used by `GET /api/v1/health`.

### `@ad-stack/config`

Shared TypeScript base configuration (`tsconfig.base.json`) extended by all packages and apps.

## Authentication

Authentication is handled by [Better Auth](https://www.better-auth.com) with social providers only (no email/password).

**Supported providers:**

- Google (with account selection prompt)
- GitHub

**Flow:**

1. User clicks "Continue with Google/GitHub" on `/login` or `/signup`
2. `authClient.signIn.social({ provider })` redirects to the OAuth provider
3. On success, the user is redirected back to `/dashboard`
4. Session is stored in Redis (secondary storage) with secure cookie attributes
5. Route guards (`beforeLoad`) check session and redirect unauthenticated users to `/login`

**Server-side:** Auth requests are handled at `POST|GET /api/auth/*` via `getAuth().handler()`, initialized lazily after DB and Redis are connected.

**Client-side:** `better-auth/react` provides `createAuthClient` with `signIn.social()`, `signOut()`, and `getSession()`.

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Root status check (`{ status: "ok" }`) |
| `GET, POST` | `/api/auth/*` | Better Auth handler (OAuth, session, etc.) |
| `GET` | `/api/v1/health` | Health check (DB + Redis status and latency) |

The health endpoint returns `200` when all services are healthy and `503` when degraded.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3.4+
- [PostgreSQL](https://www.postgresql.org) database
- [Redis](https://redis.io) server
- GitHub OAuth app (client ID + secret)
- Google OAuth app (client ID + secret)

### Installation

```bash
bun install
```

### Environment Setup

**Server** (`apps/server/.env`):

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001

# Database
DATABASE_LOCAL_URL=postgresql://user:password@localhost:5432/grid_my_life

# Redis
REDIS_URL=redis://localhost:6379

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-here

# OAuth - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Polar
POLAR_ACCESS_TOKEN=your-polar-access-token
POLAR_WEBHOOK_SECRET=your-polar-webhook-secret
POLAR_PRO_M_PRODUCT_ID=...
POLAR_PRO_M_SLUG=...
POLAR_PRO_Y_PRODUCT_ID=...
POLAR_PRO_Y_SLUG=...
```

**Web** (`apps/web/.env`):

```env
VITE_SERVER_URL=http://localhost:3000
```

### Database Setup

Push the Drizzle schema to your PostgreSQL database:

```bash
bun run db:push
```

### Start Development

```bash
bun run dev
```

- Web app: [http://localhost:3001](http://localhost:3001)
- API server: [http://localhost:3000](http://localhost:3000)
- Health check: [http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health)

## Available Scripts

### Setup

| Command | Description |
|---------|-------------|
| `bash scripts/rename-project.sh` | **Run once after cloning** — rename the template to your project and reinstall deps |

### Root (Turborepo)

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps in development mode |
| `bun run build` | Build all apps |
| `bun run check-types` | Type-check all apps and packages |
| `bun run dev:web` | Start only the web app |
| `bun run dev:server` | Start only the server |
| `bun run db:push` | Push Drizzle schema to database |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Run database migrations |
| `bun run db:studio` | Open Drizzle Studio GUI |
| `bun run check` | Run Biome formatting and lint checks |
| `bun run fix` | Auto-fix Biome formatting and lint issues |
| `bun run prepare` | Initialize Husky git hooks |

### Server (`apps/server`)

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with hot reload |
| `bun run build` | Compile with tsdown |
| `bun run start` | Run compiled output |

### Web (`apps/web`)

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Vite dev server on port 3001 |
| `bun run build` | Production build |
| `bun run serve` | Preview production build |
| `bun run check-types` | Type-check with `tsc --noEmit` |

### Database (`packages/db`)

| Command | Description |
|---------|-------------|
| `bun run db:push` | Push schema directly to database |
| `bun run db:generate` | Generate SQL migration files |
| `bun run db:migrate` | Apply pending migrations |
| `bun run db:studio` | Open Drizzle Studio |

## Server Bootstrap Order

The server initializes services in a specific order to avoid dependency issues:

1. **Redis** connects (`redisService.connect()`)
2. **Database** pool is created and verified (`initializeDB()`)
3. **Auth** is initialized with DB and Redis references (`initializeAuth()`)
4. **Hono** server starts accepting requests

This ensures all dependencies are ready before the auth handler processes any requests.
