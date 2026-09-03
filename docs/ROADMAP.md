# Balsalameh Platform — Roadmap

Living document. Phase 1 (admin console) is built; everything below it is planned.

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
Information architecture and every screen, reading from placeholder data:

- **Dashboard** — KPI tiles, sign-up & revenue trends, recent members /
  transactions, system-health panel.
- **Members** — searchable/filterable list, detail (four stored fields separated
  from system-derived data), **Verify member** lookup for airport staff, CSV
  export route.
- **Transactions** — list, detail with payment timeline and raw-payload view,
  **Webhook / IPN log** with signature + idempotency status.
- **Content** — pages & blocks, **versioned legal documents** (publish disabled
  while placeholder), FAQ, email templates.
- **Membership product** — price, currency, tax, duration, expiry basis, ID
  format.
- **Users & roles** — admin accounts, **permission matrix**, activity/audit log.
- **Settings** — general, branding, payment gateway, email, and a **Launch
  readiness** checklist that blocks go-live until every placeholder is resolved.
- **RBAC** — `OWNER / ADMIN / FINANCE / SUPPORT / VIEWER`, enforced server-side
  in `src/lib/guard.ts` (UI hiding is convenience only).

### Phase 2 — Public website
Pages: Home, How it works, FAQ, Contact, Legal (Terms, Fair Usage, Privacy),
Checkout, Payment processing, Success, Failure/retry. Content pulled from the
Phase 1 CMS records. Mobile-first, brand-aligned, WCAG 2.2 AA pass. Checkout
**UI** built here (the 3 fields + 2 checkboxes + price summary), but no live
charge yet. SEO + sitemap; the marketing QR code deep-links here.

### Phase 3 — Payment integration & Proof of Membership
1. Checkout submit → server validates (emails match, both checkboxes, record the
   agreed legal-document versions) → create `Transaction(PENDING)` → sign the
   MEPS request per the manual → redirect to the **hosted payment page** (keeps us
   at PCI **SAQ-A**).
2. Return URL shows a "processing" page and polls our status endpoint.
3. **IPN / webhook** is the source of truth: verify signature/hash, check amount +
   currency + order reference, **dedupe** by provider reference, mark
   `CAPTURED`.
4. On first capture: create `Member` (generate Membership ID, compute
   `Month YYYY` expiry from the configured duration), enqueue the Proof of
   Membership email, write an audit entry.
5. Email via the chosen provider; log to `EmailLog`; retry on failure; admin can
   resend.
6. Reconciliation job polls the gateway for stuck `PENDING` transactions.
7. Swap the auth stub for **Auth.js** (email + password with Argon2id, mandatory
   TOTP 2FA, signed session cookie, idle + absolute lifetime, step-up re-auth for
   settings / gateway / refunds / role changes).
8. Swap `src/lib/mock-data.ts` call sites for Prisma queries.
9. TEST → LIVE cutover checklist (see `Settings › Payment gateway`).

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
| Database + ORM | PostgreSQL + Prisma |
| Auth | Auth.js + mandatory TOTP 2FA; roles OWNER/ADMIN/FINANCE/SUPPORT/VIEWER |
| UI | Tailwind + hand-built primitives (Radix/shadcn optional later) |
| Content model | DB-backed mini-CMS with versioned legal documents |
| Repo shape | Single Next.js app; extract packages only if a separate staff app is needed |
| Membership ID | `BSL-XXXX-XXXX`, Crockford-style alphabet, server-generated at capture — pending business confirmation |
