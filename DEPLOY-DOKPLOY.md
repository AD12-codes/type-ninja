# Deploying typeninja with Dokploy

This guide deploys typeninja to a VPS (for example Hostinger) that runs
[Dokploy](https://dokploy.com). The app ships as a single Docker image: the Bun
API serves the built web app, runs database migrations and seeds the algorithm
content on every boot, so the only other service you need is Postgres.

## What gets deployed

| Piece | Where it comes from |
| --- | --- |
| `app` container | `Dockerfile` at the repo root (web build + API, port 3000) |
| `db` container | `postgres:17-alpine` with a named volume |
| Content | Seeded automatically from `packages/algorithms/content` on boot |

The `docker-compose.yml` in the repo wires both together and reads its values
from environment variables (see `.env.docker.example`).

## 1. Prerequisites

- A VPS with Dokploy installed (`curl -sSL https://dokploy.com/install.sh | sh`).
- A domain pointing at the VPS, e.g. `typeninja.ad12-codes.work` (an `A` record
  to the server IP).
- The repository pushed to GitHub/GitLab (Dokploy pulls from git).

## 2. Create the project

1. In Dokploy open **Projects → Create Project**, name it `typeninja`.
2. Inside the project click **Create Service → Compose**.
3. Under **Provider** choose your git provider, select the repository and the
   `main` branch. Set **Compose Path** to `./docker-compose.yml`.

## 3. Environment variables

Open the service's **Environment** tab and paste the contents of
`.env.docker.example`, filling in the values:

```env
PUBLIC_URL=https://typeninja.ad12-codes.work
BETTER_AUTH_SECRET=<output of: openssl rand -base64 32>
POSTGRES_DB=typeninja
POSTGRES_USER=typeninja
POSTGRES_PASSWORD=<a long random password>
APP_PORT=3000
```

Notes:

- `PUBLIC_URL` must be the exact public origin (scheme + host, no trailing
  slash). It is used for auth callbacks and secure cookies.
- Leave the `GITHUB_*`, `GOOGLE_*` and `SMTP_*` variables empty unless you want
  social login or password reset emails. The login page hides providers that
  are not configured, and reset links are written to the container logs when
  SMTP is not set.

## 4. Domain and HTTPS

1. Open the **Domains** tab of the compose service and click **Add Domain**.
2. Host: `typeninja.ad12-codes.work`, Service name: `app`, Container port: `3000`.
3. Enable **HTTPS** with the Let's Encrypt certificate provider.

Dokploy's Traefik instance will route the domain to the container, so you do
not need to publish `APP_PORT` on the host. If you prefer to keep the host port
mapping anyway, make sure nothing else uses it.

## 5. Deploy

Click **Deploy**. The first build takes a few minutes (it installs
dependencies and builds the web app). Watch the **Logs** tab; a healthy boot
ends with:

```
running migrations
migrations complete
content seeded  languages=12 algorithms=31 snippets=372 explanations=31
server started  port=3000
```

Open `https://typeninja.ad12-codes.work` and you should land directly on the
typing test. `https://typeninja.ad12-codes.work/api/v1/health` returns the
health check used by the container's `HEALTHCHECK`.

## 6. Updating

Push to `main` and click **Deploy** again (or enable **Auto Deploy** in the
service's General tab so Dokploy redeploys on every push via webhook).
Migrations and content seeding are idempotent, so redeploys are safe: new or
changed snippets and explanations are upserted, nothing user-related is touched.

## 7. Social login (optional)

Create OAuth apps and add the credentials to the environment:

- **GitHub** → Settings → Developer settings → OAuth Apps. Callback URL:
  `https://typeninja.ad12-codes.work/api/auth/callback/github`
- **Google** → Google Cloud Console → Credentials → OAuth client (Web).
  Authorised redirect URI:
  `https://typeninja.ad12-codes.work/api/auth/callback/google`

Redeploy after changing environment variables.

## 8. Password reset emails (optional)

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and `SMTP_FROM`.
Hostinger email hosting works with `smtp.hostinger.com` on port `465`; any
other SMTP provider (Resend, Brevo, Mailgun...) works the same way.

## 9. Backups

The database lives in the `typeninja-db` Docker volume. Use Dokploy's
**Backups** feature on the compose service (S3-compatible destination) or run a
manual dump from the server:

```bash
docker exec $(docker ps -qf name=typeninja.*db) pg_dump -U typeninja typeninja > typeninja-$(date +%F).sql
```

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Login works but you are signed out on refresh | `PUBLIC_URL` does not match the domain, or the site is served over plain HTTP (cookies are `secure` in production). |
| `set BETTER_AUTH_SECRET in .env` during deploy | A required variable is missing in the Environment tab. |
| Snippets fail to load with "No snippet matches" | Seeding did not run. Check the logs for `content seeded`; make sure `SEED_ON_START=true`. |
| Social login button missing | The provider's client id/secret are empty. |
| Password reset "sent" but no email | SMTP is not configured; the link is in the container logs. |

## Running without Dokploy

The same compose file works on any Docker host:

```bash
cp .env.docker.example .env   # fill in the values
docker compose up -d --build
```
