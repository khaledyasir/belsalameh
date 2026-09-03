# Balsalameh Platform — Roadmap

Living document. Phases 1–3 (admin console, public site, SQL Server database +
payment lifecycle) are built. Phase 3b (real MEPS + email) and Phases 4–5
(company content, visual polish) remain.

---

## Confirmed requirements (from the website specs)

- **English-only** interface; final copy supplied by the company later.
- **Fast, light** — must work on airport public Wi-Fi.
- **One product** only: the Balsalameh Membership.
- Checkout fields: **Full Name (as on passport), Email, Confirm Email**. **No phone field.**
- Two mandatory checkboxes before payment: (1) Terms & Conditions + Fair Usage
  Policy, (2) data-protection confirmation.
- **MEPS** payment gateway, integrated per the official MEPS manual; **webhooks /
  IPN** on success; no paid external licences or plugins.
- On success: automated email with welcome message, passport name, unique
  **Membership ID**, and **expiry as "Month YYYY"** (no day). **No barcode / QR**
  in the proof.
- Admin stores per subscriber **only**: full name, email, Membership ID, expiry
  month & year.
- Provide a high-resolution **QR code** linking to the website.

## Brand inputs (from the brand guidelines)

- Palette: `#2E3A6E` `#6D5FA3` `#B48DBF` `#F7A663` `#FADCA8` `#FFF3E0`
  (wired as tokens in `src/app/globals.css`).
- Type: "Crimson" serif for display; "Abd ElRady" for the Arabic logo lockup.
- Motif: gold airplane pattern; sunrise/cloud photography.
- Accessibility caveat: orange and mauve fail AA for body text on white — use
  indigo for text/links; reserve orange/mauve for large headings, fills, accents.

---

## Phase plan

### Phase 0 — Foundations ✅
Repo, TypeScript, Tailwind + design tokens, component primitives, Prisma schema,
auth stub + middleware, build pipeline.

### Phase 1 — Admin console ✅ (current deliverable)
Trimmed at the project's request to three sections, reading from placeholder data:

- **Dashboard** — KPI tiles (active / expiring / revenue / success rate /
  failed-pending) and a single **New members** chart with a selectable date
  range (7 / 30 / 90 days); recent members and recent transactions.
- **Members** — searchable/filterable list, detail (four stored fields separated
  from system-derived data), **Verify member** lookup for airport staff, CSV
  export route.
- **Transactions** — list, detail with payment timeline and raw-payload view,
  **Webhook / IPN log** with signature + idempotency status.
- **My profile** — admin name, email, and change password (confirms the current
  password before applying).
- **Auth** — one admin account, username + password; credentials in the
  `AdminUsers` table (see Phase 3). Phase 3b swaps in Auth.js + TOTP 2FA.

> Removed from the earlier draft: content management, versioned legal documents,
> FAQ, email templates, membership-product config, multi-user roles / permission
> matrix / audit log, and the settings + launch-readiness area. The Prisma schema
> still carries those models for when any of them come back.

### Phase 2 — Public website ✅ (built)
Route group `src/app/(site)`:

- **Landing page** — hero, "what's included" (placeholder benefits), the three
  spec "how it works" steps, FAQ teaser, final CTA. CSS-gradient hero, no images,
  to stay light on airport Wi-Fi.
- **Checkout form** — a **modal on the landing page**, opened by the header
  button, the hero / final CTAs, and a persistent floating "bubble". The page
  behind is greyed out; the modal is dismissed **only by its X button**
  (backdrop click and Escape do nothing, by request); focus is trapped and
  restored. `/join` is kept as a deep link that redirects to `/?join=1` and
  opens the modal. Fields: Full Name (as on passport), Email, Confirm Email;
  **no phone field**; the two mandatory consent checkboxes linking to the legal
  stubs. Shared zod schema ([lib/checkout.ts](../src/lib/checkout.ts)) validates
  on the client (inline errors + a focus-managed error summary) and again in the
  server action. On success it hands off to `/checkout/processing` (a
  placeholder standing in for the MEPS hosted page); `/checkout/success` shows an
  example Proof of Membership.
- **Legal stubs** (`/legal/terms`, `/legal/privacy`) and **FAQ** — all copy is
  placeholder from [lib/site-content.ts](../src/lib/site-content.ts); a preview
  ribbon and a site-wide noindex stay on until `PUBLIC_SITE_ENABLED=true`.

Remaining for Phase 5: visual polish, real imagery, richer FAQ accordion, SEO
(sitemap, OpenGraph), and the marketing QR code deep-link.

### Phase 3 — Database + payment lifecycle ✅ (built)

- **Microsoft SQL Server** via Prisma (`provider = "sqlserver"`).
  `prisma/schema.prisma` + `db/mssql-schema.sql` (SSMS-runnable DDL). Tables:
  `AdminUsers`, `Members`, `Transactions`, `WebhookEvents`, `EmailLogs`,
  `AuditLogs`. SQL Server has no enum type, so "enum" columns are `NVARCHAR`
  + `CHECK`. Apply with `npm run db:push`; seed the admin with `npm run db:seed`.
- **Auth** moved to the DB: `AdminUsers` row, scrypt(salt, password) in
  `passwordHash` / `passwordSalt`; session cookie is `adminId` + HMAC. Login,
  profile edit and change-password all hit SQL Server.
- **Admin reads are live** — `src/lib/queries.ts` replaced the mock module
  (deleted). Dashboard KPIs, members, verification, transactions, webhook log
  all query the database.
- **Payment lifecycle** — `src/lib/payments.ts`:
  - `createPendingTransaction()` — checkout writes a `PENDING` row with the
    consent flags + `consentVersion`.
  - `capturePayment(reference)` — **idempotent**: marks `CAPTURED`, creates the
    `Member` (Membership ID + `Month YYYY` expiry), queues an `EmailLog` row,
    writes an `AuditLog` row. Re-running returns the existing membership.
  - `POST /api/webhooks/meps` is wired to this (dedupe via `WebhookEvents`), and
    returns `501` until `MEPS_MODE` is set.
  - While `PAYMENTS_LIVE` is false, `/checkout/processing` shows a **"Record
    successful payment"** button calling the same `capturePayment()`.

Verified end-to-end against a local SQL Server: checkout → PENDING row →
confirm → Member + EmailLog + AuditLog, idempotent on repeat, visible in admin.

### Phase 3b — Real MEPS + email (needs external inputs)
1. Replace the `/checkout/processing` hand-off with a **signed request to the
   MEPS hosted payment page** (keeps us at PCI **SAQ-A**), per the MEPS manual.
2. Implement `verifyMepsSignature()` in `src/app/api/webhooks/meps/route.ts`;
   check amount + currency + order reference before `capturePayment()`.
3. Send the Proof of Membership email via the chosen provider; update the
   `EmailLog` row status; retry on failure; "resend" action in the admin.
4. Reconciliation job for stuck `PENDING` transactions.
5. Swap the session cookie for **Auth.js** + TOTP 2FA (the `getSession()` surface
   is unchanged, so pages don't move).
6. Refunds in the admin (if in business scope).

### Phase 4 — Content replacement
Real copy into the CMS; finalize & publish legal documents; set price / currency /
tax / duration; lock the Membership ID format; real imagery; regenerate the QR
for the production domain; drive Launch readiness to green.

### Phase 5 — Visual refinement & branding
Crimson typography rollout, motion polish, optional dark mode, social templates,
constrained-network load testing, cross-browser + accessibility QA, launch.

---

## Open questions

### Business (needed for content, not to start build)
1. What does the membership include? (public copy only)
2. Price, currency, VAT/tax handling, receipt/invoice requirements.
3. One-time or renewable? Renewal flow, grace period, expiry basis (rolling term
   vs. fixed calendar date).
4. Preferred Membership ID format (prefix, length, checksum).
5. Are refunds/cancellations supported, and who can issue them?
6. Multiple purchases per email — allowed? De-dupe rule? Family/group memberships?
7. Who are the admin users and what roles do they need?
8. Legal entity name, jurisdiction, registered address, support email.
9. Final text for Terms & Conditions, Fair Usage Policy, Privacy Policy.
10. Data-residency requirement — must data stay in Jordan?
11. Confirm English-only for the public site despite the Arabic logo.

### Technical
1. **Official MEPS Integration Manual / API docs** + TEST and LIVE credentials:
   acquiring bank, hosted-page vs. direct API, request-signing hash algorithm,
   IPN/webhook schema, return-URL config, 3-D Secure behaviour, currency,
   min/max amounts, settlement/reporting API, refund API.
2. Transactional email provider (Resend / Postmark / SES) + DNS access for
   SPF/DKIM/DMARC on the sending domain.
3. Hosting platform and region; production domain and DNS control; SSL.
4. Proof of Membership: HTML body only, or also a PDF attachment?
5. Analytics/consent expectations; cookie banner needed?
6. Brand assets: vector logo, licensed font files (Crimson, Abd ElRady), pattern
   asset, photography library.
7. Number of environments (dev/staging/prod) and go-live approver.
8. Browser-support matrix; confirm WCAG 2.2 AA as the target.
9. Backup and data-retention policy numbers (raw payload purge window, member
   data retention).

## Decisions already taken (revisit if needed)

| Decision | Choice |
|---|---|
| Framework + hosting | Next.js 15 App Router; hosting region TBD (see Q3) |
| Database + ORM | **Microsoft SQL Server + Prisma** (`sqlserver` provider) |
| Auth | Single admin, username + password, scrypt hash in `AdminUsers`. Phase 3b: Auth.js + TOTP 2FA (roles only if multi-user is reintroduced) |
| UI | Tailwind + hand-built primitives (Radix/shadcn optional later) |
| Content | Placeholder strings in `src/lib/site-content.ts`; a DB-backed mini-CMS only if the company needs to self-edit copy |
| Repo shape | Single Next.js app; extract packages only if a separate staff app is needed |
| Membership ID | `BSL-XXXX-XXXX`, Crockford-style alphabet, server-generated at capture — pending business confirmation |
