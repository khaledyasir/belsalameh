# Balsalameh Platform

Web platform for the **Balsalameh Membership** — a single membership product sold
to travellers, paid through **MEPS**, with an automated Proof of Membership email.

This repository is being built in phases. The admin console, the public site,
and a **SQL Server database** wiring checkout → transaction → member → admin are
all in place. What's left is real MEPS payment confirmation, transactional email,
and the company's final text / logo / pattern.

---

## Status by phase

| Phase | Scope | State |
|------|-------|-------|
| 0 | Foundations: tooling, design tokens, component library, data model, auth | ✅ done |
| 1 | **Admin console** — dashboard, members (+ verification), transactions (+ webhook log), my profile; username/password login | ✅ done |
| 2 | **Public site** — brand-styled landing page; checkout form as an X-only modal (passport name + email + two consent checkboxes, no phone); legal/FAQ stubs | ✅ done |
| 3 | **Database + payment lifecycle** — SQL Server schema; checkout writes a PENDING transaction; `capturePayment()` creates the Member (idempotent); admin reads live data | ✅ done (manual confirm stand-in) |
| 3b | Real MEPS hosted-page + webhook signature verification; transactional email (Proof of Membership) | ⬜ needs the MEPS manual + an email provider |
| 4 | Replace placeholder content with company-supplied text / logo / pattern | ⬜ waiting on the company |
| 5 | Visual refinement & branding rollout | ⬜ |

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the detailed plan, open questions,
and decisions still required.

---

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | One codebase for fast SSG/SSR public pages and the server routes needed for the MEPS callback/IPN |
| Styling | **Tailwind CSS 3** with CSS-variable design tokens | Brand re-skin is a one-file change (`src/app/globals.css`) |
| UI | Hand-built primitives in `src/components/ui` | No heavy dependency; accessible patterns; swap for Radix/shadcn if the team prefers |
| Database | **Microsoft SQL Server** via **Prisma** (`prisma/schema.prisma`, provider `sqlserver`) | The team's database (SSMS). Prisma gives typed queries + a single migration source |
| Auth | One admin account, username + password ([auth.ts](src/lib/auth.ts) + [admin-store.ts](src/lib/admin-store.ts)); scrypt hash in `AdminUsers` → Auth.js + TOTP 2FA in Phase 3 | `getSession()` surface stays identical for the swap |
| Charts | Inline SVG, single-hue, hover tooltips | Follows the `dataviz` conventions; light payload |

---

## Running locally

PowerShell (run each line separately — `&&` is not supported):

```powershell
npm install                       # also runs `prisma generate`
Copy-Item .env.example .env        # then edit DATABASE_URL + ADMIN_* in .env
npm run db:push                    # create the tables in your SQL Server database
npm run db:seed                    # create the first admin from the ADMIN_* vars
npm run dev                        # http://localhost:3000
```

**`DATABASE_URL`** (SQL Server / Prisma), e.g.

```
sqlserver://localhost:1433;database=balsalameh;user=<login>;password=<pass>;encrypt=true;trustServerCertificate=true
```

The instance must accept **TCP/IP** connections (SQL Server Configuration Manager
→ Protocols → TCP/IP → Enabled, port 1433) and, for a SQL login, **mixed-mode
auth**. [`db/mssql-schema.sql`](db/mssql-schema.sql) is the hand-written
equivalent of `db:push` if you'd rather run DDL in SSMS.

Sign in at `/login` with the seeded credentials (defaults `admin` / `admin1234`);
name / email / password are then managed in **Admin › My profile**.

### Useful scripts

| Script | Purpose |
|---|---|
| `npm run dev` / `npm run build` | Dev server / production build + type-check |
| `npm run prisma:generate` | Regenerate the Prisma client after editing the schema |
| `npm run db:push` | Apply `schema.prisma` to the database (no migration history) |
| `npm run db:migrate` | Create a migration (use once schema stabilises) |
| `npm run db:seed` | Upsert the admin account from `.env` (idempotent) |

---

## Deploying to Vercel

The public site (`/`, `/faq`, `/legal/*`) deploys with **no env vars at all**.
Admin / login / checkout additionally need a **publicly reachable** SQL Server —
a local `localhost` instance is not reachable from Vercel; use Azure SQL Database
or another hosted MSSQL.

Set these in **Project → Settings → Environment Variables**, then **redeploy**
(env changes only apply to new deployments):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | your Vercel URL, e.g. `https://belsalameh.vercel.app` (inlined at build time) |
| `AUTH_SECRET` | a long random string |
| `PUBLIC_SITE_ENABLED` | `true` to drop the pre-launch noindex |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `ADMIN_NAME` / `ADMIN_EMAIL` | first admin (seed once, then manage in-app) |
| `DATABASE_URL` | `sqlserver://<host>:1433;database=<db>;user=<u>;password=<p>;encrypt=true` (only if wiring the admin) |

**Do not** add `NODE_ENV` — Vercel reserves it, and importing a `.env` that
contains it makes the whole import fail silently. Delete the `NODE_ENV`,
`localhost` `DATABASE_URL`, and `http://localhost:3000` lines from any `.env`
before importing.

After the DB is reachable: run `npm run db:push` and `npm run db:seed` against it
once (from your machine, pointed at the hosted `DATABASE_URL`).

---

## Project structure

```
db/
  mssql-schema.sql       hand-written DDL — the SSMS equivalent of `db:push`
prisma/
  schema.prisma          SQL Server data model (AdminUsers, Members, Transactions,
                         WebhookEvents, EmailLogs, AuditLogs)
  seed.ts                upserts the admin account from ADMIN_* env vars
src/
  middleware.ts          admin route protection (session cookie presence)
  app/
    (site)/              PUBLIC SITE
      layout.tsx         header + footer + preview ribbon + <JoinProvider>
      page.tsx           landing page (brand-styled)
      join/page.tsx      deep link → redirects to /?join=1 (opens the modal)
      checkout/          actions.ts (confirm stand-in) + processing + success
      legal/[slug]       Terms / Privacy stubs (linked from the consent checkboxes)
      faq/               FAQ (placeholder Q&A)
    api/webhooks/meps/   MEPS IPN endpoint — ready, disabled until MEPS_MODE is set
    (auth)/login         username + password sign-in
    (auth)/actions.ts    sign in/out, update profile, change password
    admin/               dashboard · members (list/detail/verify/export) ·
                         transactions (list/detail/webhook log) · account
  components/
    ui/                  primitives (button, card, table, field, badge, …)
    site/                header, footer, preview ribbon, airplane pattern,
                         join.tsx (modal), checkout-form.tsx, checkout-actions.ts
    admin/ · dashboard/  shell + stat tile + members trend chart
  lib/
    db.ts                Prisma client singleton (lazy) + dbConfigured()
    queries.ts           admin read layer (Members / Transactions / dashboard)
    payments.ts          createPendingTransaction() + capturePayment() (idempotent)
    admin-store.ts       AdminUsers access + scrypt password hashing
    auth.ts              signed session cookie (adminId + HMAC)
    guard.ts             per-page auth gate
    checkout.ts          shared zod schema (client form + server action)
    membership.ts        product config (price/currency/duration — placeholder)
    config.ts            GATEWAY_MODE, CONSENT_VERSION, PAYMENTS_LIVE
    site-content.ts      all public copy (placeholder) + PUBLIC_SITE_ENABLED
    membership-id.ts     Membership ID generator (BSL-XXXX-XXXX)
    format.ts            money / date / expiry ("Month YYYY")
    nav.ts               admin navigation (Dashboard, Members, Transactions)
```

### Payment lifecycle

1. Checkout form (modal) → server action `startCheckout` validates and calls
   `createPendingTransaction()` → a **PENDING** row in `Transactions`; redirect to
   `/checkout/processing?ref=…`.
2. **Phase 3b:** that redirect goes to the MEPS hosted payment page; MEPS then
   calls `POST /api/webhooks/meps`, which (after signature verification) calls
   `capturePayment(reference)`.
3. Until MEPS is wired, the processing page shows a **"Record successful
   payment"** button that calls the *same* `capturePayment()`.
4. `capturePayment()` is **idempotent**: marks the transaction **CAPTURED**,
   creates the **Member** (Membership ID + `Month YYYY` expiry), queues an
   `EmailLog` row, writes an `AuditLog` row. Re-running returns the existing
   membership.
5. The admin dashboard / members / transactions read this live from SQL Server.

---

## Things that are deliberately placeholder

Nothing company-specific is invented. Still to be supplied:

- Membership price, currency, tax treatment, duration, renewal behaviour
  (constants in [membership.ts](src/lib/membership.ts))
- Membership ID format — prefix / length / checksum ([membership-id.ts](src/lib/membership-id.ts))
- MEPS credentials + endpoints + IPN signature scheme; email provider + sending domain
- Company legal name, address, support email
- Terms & Conditions, Fair Usage Policy, Privacy Policy text ([site-content.ts](src/lib/site-content.ts))
- Vector logo, the gold airplane pattern asset, licensed font files (Crimson, Abd ElRady)
- All landing-page / FAQ copy ([site-content.ts](src/lib/site-content.ts))

These come from the company or the MEPS manual — see [docs/ROADMAP.md](docs/ROADMAP.md).
