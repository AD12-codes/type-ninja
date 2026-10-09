# typeninja

A minimalistic, monkeytype-style typing test for programmers. Instead of English
words you type real algorithm implementations (bubble sort, dijkstra, binary
search...) in the language of your choice, and every algorithm comes with a
plain-English explanation and a flow diagram.

- No timer: a test ends when you finish the snippet; speed is measured from the
  first to the last key press.
- 31 algorithms × 12 languages (Python, JavaScript, TypeScript, Go, Rust, Java,
  C#, C++, C, Lua, Ruby, Kotlin), all stored in the database. No AI at runtime.
- Accounts are optional. Sign in only to save results, track progress and join
  the leaderboards.
- ~190 colour themes ported from monkeytype (`bushido` by default), a command
  line (`esc` / `ctrl+shift+p`), and the familiar settings page.

## Tech stack

| Layer | Technology |
| --- | --- |
| Runtime | [Bun](https://bun.sh) |
| API | [Hono](https://hono.dev), [Drizzle ORM](https://orm.drizzle.team), PostgreSQL |
| Auth | [Better Auth](https://www.better-auth.com) (email + password, username, optional GitHub/Google) |
| Web | React 19, [TanStack Router](https://tanstack.com/router) / Query / Table / Form, [Zustand](https://zustand-demo.pmnd.rs), Tailwind v4, [shadcn/ui](https://ui.shadcn.com) |
| Diagrams & charts | [mermaid](https://mermaid.js.org), [recharts](https://recharts.org) |
| Monorepo | [Turborepo](https://turbo.build), Bun workspaces, Biome via [ultracite](https://www.ultracite.ai) |

## Project structure

```
type-ninja/
├── apps/
│   ├── server/                 # Hono API (serves the web build in production)
│   │   └── src/
│   │       ├── app.ts          # middleware, auth handler, static serving, error handling
│   │       ├── index.ts        # bootstrap: db → migrations → seed → auth → listen
│   │       ├── lib/            # auth middleware, result validation, DTOs
│   │       └── routes/         # content, results, users, leaderboards, health
│   └── web/                    # React SPA
│       └── src/
│           ├── routes/         # file-based routes (test, settings, account, login, ...)
│           ├── components/     # test UI, settings, command palette, explanation renderer, shadcn ui
│           ├── hooks/          # useTypingTest, config sync, appearance
│           ├── store/          # zustand stores (config, test, ui)
│           ├── lib/            # api client, queries, settings definitions, theme engine
│           └── themes/         # monkeytype theme palette
├── packages/
│   ├── algorithms/             # catalog + content (snippets, explanations) + validator tests
│   ├── typing-engine/          # pure typing state machine + stats (wpm, acc, consistency)
│   ├── shared/                 # zod contracts: user config, API request/response types
│   ├── db/                     # drizzle schema, migrations, migrator, seeder
│   ├── auth/                   # better-auth config + SMTP mailer
│   ├── env/                    # validated env (server + web)
│   ├── core/                   # pino logger
│   ├── health/                 # health check service
│   └── config/                 # shared tsconfig
├── Dockerfile                  # single image: web build + API
├── docker-compose.yml          # app + postgres (Dokploy ready)
└── DEPLOY-DOKPLOY.md           # step-by-step VPS deployment guide
```

## How a test works

1. The web app asks the API for a random snippet matching the selected
   language, category and algorithm.
2. `@type-ninja/typing-engine` turns the snippet into lines. Enter submits a
   line; with **auto indent** on, leading whitespace is pre-filled and never
   counted toward speed.
3. Stats follow monkeytype's conventions: `wpm = correct chars (incl. newlines) / 5 / minutes`,
   raw counts every typed character, accuracy is per key press, consistency is
   monkeytype's `kogasa` score over per-second raw speed.
4. Signed-in users' results are re-validated on the server (the speed must match
   the submitted character counts) before being saved and ranked.

## Adding algorithms or languages

Content lives in `packages/algorithms` and is validated by `bun test`:

1. Add metadata to `src/catalog.ts` (or a language to `src/languages.ts`).
2. Add `content/snippets/<language>/<slug>.<ext>` for every language.
3. Add `content/explanations/<slug>.md` with the required sections and a
   `mermaid` flowchart.
4. Run `bun run test` in the package, then restart the server: the seeder
   upserts everything on boot.

See [`packages/algorithms/CONTENT.md`](packages/algorithms/CONTENT.md) for the
exact rules.

## Development

### Prerequisites

- Bun 1.3+
- PostgreSQL

### Setup

```bash
bun install
cp apps/server/.env.example apps/server/.env   # set DATABASE_URL + BETTER_AUTH_SECRET
cp apps/web/.env.example apps/web/.env
createdb typeninja
bun run dev
```

- Web: http://localhost:9898
- API: http://localhost:9797 (migrations + content seeding run on boot)

Social login and SMTP are optional; the login page hides providers that are
not configured and password-reset links are logged when SMTP is empty.

### Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start web + API in watch mode |
| `bun run build` | Build everything |
| `bun run test` | Run all tests (engine, content validator, shared, server, web) |
| `bun run check-types` | Type-check all workspaces |
| `bun run check` / `bun run fix` | Biome lint & format via ultracite |
| `bun run db:generate` | Generate a SQL migration after changing the schema |
| `bun run db:migrate` | Apply migrations with drizzle-kit |
| `bun run db:seed` | Seed content without starting the server |
| `bun run db:studio` | Open Drizzle Studio |

Server route tests run against the database in `DATABASE_URL` and are skipped
when it is not set.

## API

All endpoints are under `/api/v1`. Auth endpoints are under `/api/auth/*`.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/languages` | | Supported languages |
| GET | `/algorithms` | | Algorithm catalog with per-language availability |
| GET | `/algorithms/:slug` | | Algorithm metadata + explanation markdown |
| GET | `/snippets/random?language&category&algorithm&exclude` | | A snippet to type |
| GET | `/snippets/:id` | | A specific snippet |
| POST | `/results` | ✓ | Submit a completed test (validated server-side) |
| GET | `/results` | ✓ | Own results, paginated |
| DELETE | `/results` | ✓ | Reset account (results, bests, stats) |
| GET | `/users/me` | ✓ | Own profile, stats, personal bests, ranks |
| PATCH | `/users/me` | ✓ | Update username / bio / keyboard |
| GET/PUT | `/users/me/config` | ✓ | Settings sync |
| DELETE | `/users/me/personal-bests` | ✓ | Reset personal bests |
| GET | `/users/me/activity` | ✓ | Tests per day (last year) |
| GET | `/users/:username` | | Public profile |
| GET | `/leaderboards?language&period&algorithm&page` | | All-time or daily leaderboard |
| GET | `/health` | | Health check |
| GET | `/meta` | | Enabled social providers, version |

## Deployment

See [DEPLOY-DOKPLOY.md](DEPLOY-DOKPLOY.md). In short: one Docker image, one
Postgres, and a handful of environment variables.

```bash
cp .env.docker.example .env
docker compose up -d --build
```

## Credits

Inspired by [monkeytype](https://monkeytype.com). Theme palettes are ported from
the monkeytype project (GPL-3.0).
