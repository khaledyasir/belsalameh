# Balsalameh Platform

Web platform for the **Balsalameh Membership** — a single membership product sold
to travellers, paid through **MEPS**, with an automated Proof of Membership email.

This repository is being built in phases. **Phase 1 (the admin console) is what
exists today.** The public website and payment integration come later; the
foundation here is shaped so they plug in without rework.

---

## Status by phase

| Phase | Scope | State |
|------|-------|-------|
| 0 | Foundations: tooling, design tokens, component library, data model, auth skeleton | ✅ done |
| 1 | **Admin console** — dashboard, members (+ verification), transactions (+ webhook log), my profile; username/password login | ✅ done |
| 2 | **Public site** — friendly brand-styled landing page; checkout form as an X-only modal (passport name + email + two consent checkboxes, no phone); legal/FAQ stubs; payment hand-off placeholder | ✅ built; more polish in Phase 5 |
| 3 | MEPS payment integration + Proof of Membership email | ⬜ not started |
| 4 | Replace placeholder content with company-supplied information | ⬜ not started |
| 5 | Visual refinement & branding rollout | ⬜ not started |

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the detailed plan, open questions,
and decisions still required.

---

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | One codebase for fast SSG/SSR public pages and the server routes needed for the MEPS callback/IPN |
| Styling | **Tailwind CSS 3** with CSS-variable design tokens | Brand re-skin is a one-file change (`src/app/globals.css`) |
| UI | Hand-built primitives in `src/components/ui` | No heavy dependency; accessible patterns; swap for Radix/shadcn if the team prefers |
| Data model | **Prisma + PostgreSQL** (`prisma/schema.prisma`) | Small relational model; transactional member/transaction creation |
| Auth | **Phase 1 stub** — one admin account, username + password ([auth.ts](src/lib/auth.ts) + [admin-store.ts](src/lib/admin-store.ts)) → Auth.js + TOTP 2FA in Phase 3 | Real login now; the `getSession()` surface stays identical for the swap |
| Charts | Inline SVG, single-hue, hover tooltips | Follows the `dataviz` conventions; light payload |

### Why the admin runs without a database

Phase 1 reads every screen from **`src/lib/mock-data.ts`** — realistic, invented
placeholder data. This lets the whole console be reviewed with no infrastructure.
Phase 3 swaps those functions for Prisma queries; call sites keep the same names
and shapes.

---

## Running locally

PowerShell (run each line separately — `&&` is not supported):

```powershell
npm install
Copy-Item .env.example .env
npm run dev            # http://localhost:3000
```

Open `/login` and sign in with the credentials from `.env`
(defaults: username `admin`, password `admin1234`). On first run these seed
`.data/admin.json`; after that, name / email / password are managed from
**Admin › My profile**. There are no other roles in Phase 1 — a single admin.

### Useful scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build + type-check |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run prisma:generate` | Generate the Prisma client (needs `DATABASE_URL`) |
| `npm run prisma:migrate` | Create/apply migrations (Phase 3) |
| `npm run db:seed` | Seed settings, owner user, legal stubs, email template (Phase 3) |

---

## Project structure

```
prisma/
  schema.prisma          data model (target for Phase 3)
  seed.ts                structural + placeholder seed
src/
  middleware.ts          admin route protection (stub → Auth.js in Phase 3)
  app/
    (site)/              PUBLIC SITE
      layout.tsx         header + footer + preview ribbon + <JoinProvider>
      page.tsx           landing page (brand-styled)
      join/page.tsx      deep link → redirects to /?join=1 (opens the modal)
      checkout/          processing (payment hand-off) + success placeholders
      legal/[slug]       Terms / Privacy stubs (linked from the consent checkboxes)
      faq/               FAQ (placeholder Q&A)
    (auth)/login         username + password sign-in
    (auth)/actions.ts    sign in/out, update profile, change password
    admin/
      layout.tsx         shell (sidebar + topbar + gateway-mode badge)
      page.tsx           dashboard (KPIs + range-selectable New members chart)
      members/           list · detail · verify · CSV export route
      transactions/      list · detail · webhook (IPN) log
      account/           my profile — name, email, change password
  components/
    ui/                  primitives (button, card, table, field, badge, …)
    site/                header, footer, preview ribbon, airplane pattern,
                         join.tsx (modal provider + trigger + bubble + dialog),
                         checkout-form.tsx, checkout-actions.ts
    admin/               shell (sidebar, topbar, account menu, page header)
    dashboard/           stat tile, members trend chart
  lib/
    membership.ts        single product config (price/currency/duration — placeholder)
    checkout.ts          shared zod schema for the checkout form + server action
    site-content.ts      all public copy (placeholder) + PUBLIC_SITE_ENABLED flag
    nav.ts               admin navigation model (Dashboard, Members, Transactions)
    auth.ts              session cookie (sign/verify)
    admin-store.ts       file-based single-admin credential store
    guard.ts             per-page auth gate
    mock-data.ts         PLACEHOLDER data source (Phase 1)
    format.ts            money / date / expiry ("Month YYYY") formatting
    membership-id.ts     Membership ID generator (BSL-XXXX-XXXX)
```

> **Scope note:** the admin was trimmed at the project's request to
> Dashboard · Members · Transactions only. Content management, membership-product
> config, multi-user roles, and the settings/launch-readiness area were removed;
> the Prisma schema still carries those models for when they return.

---

## Things that are deliberately placeholder

Nothing company-specific is invented. Still to be supplied:

- Membership price, currency, tax treatment, duration, renewal behaviour
  (placeholder constants in [mock-data.ts](src/lib/mock-data.ts))
- Membership ID format — prefix / length / checksum ([membership-id.ts](src/lib/membership-id.ts))
- MEPS credentials and endpoints; email provider and sending domain
- Company legal name, address, support email
- Terms & Conditions, Fair Usage Policy, Privacy Policy text
- Vector logo and licensed font files (Crimson, Abd ElRady)

These come from the company (Phase 4) or the MEPS manual (Phase 3) — see
[docs/ROADMAP.md](docs/ROADMAP.md).
