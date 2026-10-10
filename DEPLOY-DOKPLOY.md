# Deploying typeninja with Dokploy

This guide deploys typeninja to a VPS (for example Hostinger) that runs
[Dokploy](https://dokploy.com). The app ships as a single Docker image: the Bun
API serves the built web app, runs database migrations and seeds the algorithm
content on every boot. The only other thing it needs is a Postgres database.

There are two ways to run it. **Option A** (recommended) uses a Dokploy-managed
Postgres service plus a Dokploy Application built from the `Dockerfile`; you
get Dokploy's database backups and the two pieces can be restarted
independently. **Option B** runs app + Postgres together from
`docker-compose.yml`.

Important: Dokploy's own dashboard listens on port `3000` on the host. Never
publish the app on a host port; Traefik routes the domain straight to the
container. (If you see `Bind for 0.0.0.0:3000 failed: port is already
allocated`, that is what happened.)

## Prerequisites

- A VPS with Dokploy installed (`curl -sSL https://dokploy.com/install.sh | sh`).
- A domain pointing at the VPS, e.g. `typeninja.ad12-codes.work` (an `A` record
  to the server IP).
- The repository pushed to GitHub/GitLab (Dokploy pulls from git).

---

## Option A (recommended): separate Postgres + Application

### A1. Create the project

**Projects → Create Project**, name it `typeninja`.

### A2. Create the database

1. Inside the project: **Create Service → Database → PostgreSQL**.
2. Name: `typeninja-db`, database name `typeninja`, user `typeninja`, and a long
   random password. Keep the Postgres version at 16 or 17.
3. Click **Deploy**, then open the **General** tab and copy the **Internal
   Connection URL**. It looks like
   `postgresql://typeninja:<password>@typeninja-db-xxxx:5432/typeninja`.
   Do not enable external access; the app reaches it over Dokploy's internal
   network.

### A3. Create the application

1. **Create Service → Application**, name it `typeninja`.
2. **Provider**: your git provider, repository `AD12-codes/type-ninja`, branch
   `main`.
3. **Build Type**: `Dockerfile`, Dockerfile path `Dockerfile`, build context `.`.

### A4. Environment variables

Open the application's **Environment** tab and add:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<internal connection URL from A2>
BETTER_AUTH_SECRET=<output of: openssl rand -base64 32>
BETTER_AUTH_URL=https://typeninja.ad12-codes.work
WEB_DIST_DIR=/app/apps/web/dist
RUN_MIGRATIONS_ON_START=true
SEED_ON_START=true
TRUST_PROXY=true

# optional
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=typeninja <no-reply@ad12-codes.work>
```

`BETTER_AUTH_URL` must be the exact public origin (scheme + host, no trailing
slash). It is used for auth callbacks and secure cookies.

### A5. Domain and HTTPS

**Domains → Add Domain**: host `typeninja.ad12-codes.work`, container port
`3000`, HTTPS on with Let's Encrypt. Leave the **Ports** section of the
application empty.

### A6. Deploy

Click **Deploy**. The first build takes a few minutes. A healthy boot ends with:

```
running migrations
migrations complete
content seeded  languages=12 algorithms=31 snippets=372 explanations=31
server started  port=3000
```

Open `https://typeninja.ad12-codes.work`; you should land on the typing test.
`/api/v1/health` returns the health check used by the container's
`HEALTHCHECK`.

### A7. Backups

Open the `typeninja-db` service → **Backups**, add an S3-compatible
destination and a schedule (daily is plenty). Dokploy restores from the same
tab.

---

## Option B: everything from docker-compose.yml

1. **Create Service → Compose**, provider = your git repo, branch `main`,
   **Compose Path** `./docker-compose.yml`.
2. **Environment** tab: paste `.env.docker.example` and fill in `PUBLIC_URL`,
   `BETTER_AUTH_SECRET` and `POSTGRES_PASSWORD`.
3. **Domains → Add Domain**: host `typeninja.ad12-codes.work`, service `app`,
   container port `3000`, HTTPS on.
4. **Deploy**.

The compose file joins Dokploy's `dokploy-network` and publishes no host port,
so it cannot collide with the dashboard. The Postgres data lives in the
`typeninja-db` volume; back it up with a manual dump:

```bash
docker exec $(docker ps -qf name=typeninja.*db) pg_dump -U typeninja typeninja > typeninja-$(date +%F).sql
```

---

## Updating

Push to `main` and click **Deploy** (or enable **Auto Deploy** in the service's
General tab so Dokploy redeploys on every push via webhook). Migrations and
content seeding are idempotent: new or changed snippets and explanations are
upserted and user data is never touched.

## Social login (optional)

Create OAuth apps and add the credentials to the environment, then redeploy:

- **GitHub** → Settings → Developer settings → OAuth Apps. Callback URL:
  `https://typeninja.ad12-codes.work/api/auth/callback/github`
- **Google** → Google Cloud Console → Credentials → OAuth client (Web).
  Authorised redirect URI:
  `https://typeninja.ad12-codes.work/api/auth/callback/google`,
  authorised JavaScript origin `https://typeninja.ad12-codes.work`.

The login page only shows providers that are configured.

## Password reset emails (optional)

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and `SMTP_FROM`. Brevo's
free SMTP relay (`smtp-relay.brevo.com`, port `587`, your Brevo login as user
and an SMTP key as password) or Hostinger's mailbox SMTP
(`smtp.hostinger.com`, port `465`) both work. Until SMTP is set, reset links
are written to the application logs instead of sent.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Bind for 0.0.0.0:3000 failed: port is already allocated` | Something publishes host port 3000 (Dokploy's dashboard). Remove any port mapping; use the Domains tab instead. |
| Login works but you are signed out on refresh | `BETTER_AUTH_URL` does not match the domain, or the site is served over plain HTTP (cookies are `secure` in production). |
| `ECONNREFUSED` / `getaddrinfo` for the database | Wrong `DATABASE_URL`. Use the **internal** URL from the Postgres service, not the external one. |
| Snippets fail to load with "No snippet matches" | Seeding did not run. Check the logs for `content seeded`; make sure `SEED_ON_START=true`. |
| Social login button missing | The provider's client id/secret are empty. |
| Password reset "sent" but no email | SMTP is not configured; the link is in the application logs. |
| `429 Too Many Requests` while testing | Rate limiting (30 auth calls per 15 min per IP). Wait, or test from another IP. |

## Running without Dokploy

On a plain Docker host there is no Traefik, so publish a port with the
standalone override:

```bash
cp .env.docker.example .env            # fill in the values
docker network create dokploy-network  # once; satisfies the external network
docker compose -f docker-compose.yml -f docker-compose.standalone.yml up -d --build
```

The app is then available on `http://<host>:8080` (change `APP_PORT` in `.env`).
