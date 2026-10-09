# syntax=docker/dockerfile:1.7
#
# Single-image build: the Bun API server serves the built web app.
# Build:  docker build -t typeninja .
# Run:    docker run -p 3000:3000 --env-file apps/server/.env typeninja

FROM oven/bun:1.3-alpine AS base
WORKDIR /app

# ── Install dependencies (cached by lockfile) ───────────────────────────────
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/server/package.json apps/server/
COPY apps/web/package.json apps/web/
COPY packages/algorithms/package.json packages/algorithms/
COPY packages/auth/package.json packages/auth/
COPY packages/config/package.json packages/config/
COPY packages/core/package.json packages/core/
COPY packages/db/package.json packages/db/
COPY packages/env/package.json packages/env/
COPY packages/health/package.json packages/health/
COPY packages/shared/package.json packages/shared/
COPY packages/typing-engine/package.json packages/typing-engine/
RUN bun install --frozen-lockfile --ignore-scripts

# ── Build the web app ───────────────────────────────────────────────────────
FROM deps AS build
COPY . .
# The web app is served from the same origin as the API in production,
# so VITE_SERVER_URL is intentionally empty.
ENV VITE_SERVER_URL=""
RUN bun run --cwd apps/web build

# ── Runtime image ───────────────────────────────────────────────────────────
FROM base AS runtime
ENV NODE_ENV=production \
    PORT=3000 \
    WEB_DIST_DIR=/app/apps/web/dist \
    RUN_MIGRATIONS_ON_START=true \
    SEED_ON_START=true

# Production dependencies only (no vite, react, mermaid... in the runtime image)
COPY package.json bun.lock ./
COPY apps/server/package.json apps/server/
COPY apps/web/package.json apps/web/
COPY packages/algorithms/package.json packages/algorithms/
COPY packages/auth/package.json packages/auth/
COPY packages/config/package.json packages/config/
COPY packages/core/package.json packages/core/
COPY packages/db/package.json packages/db/
COPY packages/env/package.json packages/env/
COPY packages/health/package.json packages/health/
COPY packages/shared/package.json packages/shared/
COPY packages/typing-engine/package.json packages/typing-engine/
RUN bun install --frozen-lockfile --production --ignore-scripts \
    && rm -rf ~/.bun/install/cache

COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/server ./apps/server
COPY --from=build /app/apps/web/dist ./apps/web/dist

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/v1/health || exit 1

USER bun
CMD ["bun", "run", "apps/server/src/index.ts"]
