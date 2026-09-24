# Deploying Belsalameh on Windows Server + IIS

This is **one Node process** (Next.js). It serves the pages and runs all the
server/database code — there is no separate API service. It is deployed as an
IIS site: IIS starts and supervises `node` and proxies the site to it, exactly
like a .NET app pool. No Docker, no Windows service to register.

SQL Server is **your existing instance** — the app just needs a database and a
login on it.

Two ways to deploy:

- **Option A — release bundle** (recommended): download a pre-built zip from
  GitHub Actions. No repo, no `npm`, no build on the server.
- **Option B — from source**: clone the repo and run `npm run setup` on the
  server.

---

## Prerequisites (once per server)

1. **Node.js 20.6+ LTS or 22 LTS** — https://nodejs.org (MSI). Confirm: `node -v`.
2. **HttpPlatformHandler** IIS module — https://www.iis.net/downloads/microsoft/httpplatformhandler
   (small MSI; often already present on servers that host Java/Node/Python).
3. **A database + login** on the existing SQL Server:
   ```sql
   CREATE DATABASE belsalameh;
   CREATE LOGIN bsl_app WITH PASSWORD = 'a-strong-password';
   USE belsalameh;
   CREATE USER bsl_app FOR LOGIN bsl_app;
   ALTER ROLE db_owner ADD MEMBER bsl_app;   -- Option B only; Option A needs just datareader + datawriter
   ```

---

## Option A — release bundle (no build on the server)

1. **Get the bundle.** Either:
   - the developer runs `npm run bundle` locally → produces `belsalameh-deploy.zip`, or
   - GitHub: Actions → **Deploy bundle** → Run workflow (or push a `v*` tag) →
     download **belsalameh-deploy.zip** from the run / Release.

2. **Unzip** on the server, e.g. to `C:\inetpub\belsalameh`.

3. **Create `.env`** in that folder (copy the included `.env.example`) — set at
   least:
   ```
   NEXT_PUBLIC_SITE_URL="https://the-real-domain"
   AUTH_SECRET="<48+ random chars>"
   DATABASE_URL="sqlserver://SQLHOST:1433;database=belsalameh;user=bsl_app;password=...;encrypt=true;trustServerCertificate=true"
   SENDGRID_API_KEY="<key>"
   EMAILS_ENABLED="true"
   PUBLIC_SITE_ENABLED="true"
   PAYMENTS_LIVE="false"
   ALLOW_SIMULATED_PAYMENT="false"
   ADMIN_USERNAME="admin"
   ADMIN_PASSWORD="<first admin password>"
   ADMIN_EMAIL="admin@belsalameh.com"
   ADMIN_NAME="Administrator"
   ```
   > `NEXT_PUBLIC_SITE_URL` is baked in at build time — if the real URL differs
   > from what the bundle was built with, rebuild the bundle with the right value.
   > Generate `AUTH_SECRET`: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`

4. **Create the schema** — a DBA runs `db\mssql-schema.sql` against the
   `belsalameh` database in SSMS (one file, creates every table).

5. **Create the admin** — once, from the bundle folder:
   ```
   node --env-file=.env scripts\create-admin.mjs
   ```

6. **Create the IIS site** (see *IIS site* below).

7. Browse the site, then `/login` with the admin credentials.

**Updating:** download the new zip, replace everything **except `.env` and
`logs\`**, re-run step 4/5 only if the schema changed, then **Recycle** the app
pool.

---

## Option B — from source

1. **Clone / copy** the repo to the server (skip `node_modules\` and `.next\`).
2. **Create `.env`** (copy `.env.example`, same keys as Option A step 3).
3. **One command:**
   ```
   npm ci
   npm run setup
   ```
   `setup` = build → schema (`prisma db push`) → admin (`prisma db seed`).
   Re-runnable any time.
4. **Create the IIS site** (below).
5. Browse, then `/login`.

**Updating:** `git pull` (or copy changed files) → `npm ci` → `npm run setup` →
Recycle the app pool.

---

## IIS site (both options)

- **Physical path:** the deploy folder (the one containing `web.config`).
- **Application pool:** **No Managed Code**, pipeline **Integrated**.
- **Binding:** **https** with the TLS certificate.
- Give the app pool identity (`IIS AppPool\<poolname>`) **Modify** on the
  `logs\` subfolder.
- Check `processPath` in `web.config` matches the Node path (`where node`).

---

## Optional: accurate client IPs for rate-limiting

HttpPlatformHandler does not add `X-Forwarded-For`, so the login/checkout rate
limits bucket all traffic under one IP (they still work, just coarsely). To fix:
in IIS **URL Rewrite → View Server Variables**, allow `HTTP_X_FORWARDED_FOR`,
then add an inbound rule that sets it to `{REMOTE_ADDR}`.

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| HTTP **502.3** / **500.19** | Node didn't start. Read `logs\node_*.log`. Usually `processPath` wrong, or `.env` missing a required value (`AUTH_SECRET` under 32 chars → the app refuses to boot in production). |
| Error mentioning Prisma **query engine** | `node_modules\.prisma` missing from the bundle. It's copied by `postbuild`; if you assembled by hand, copy `node_modules\.prisma` next to `server.js` under `node_modules\`. Also: the bundle must be built on Windows (the Actions workflow is). |
| Admin login fails right after setup | Site reached over plain HTTP — the session cookie is `Secure` and needs HTTPS. |
| Confirmation emails not sending | `EMAILS_ENABLED` not `true`, key missing, or the SendGrid sender/domain isn't verified. Outbound HTTPS 443 to `api.sendgrid.com` must be allowed. |
