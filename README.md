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
| 1 | **Admin console** — dashboard, members, verification, transactions, content & legal, users & roles, settings, launch-readiness | ✅ this deliverable |
| 2 | Public website design & build (checkout UI only) | ⬜ not started |
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
| Auth | **Phase 0 stub** in `src/lib/auth.ts` → Auth.js + TOTP 2FA in Phase 3 | Stub keeps the console reviewable; the `getSession()` surface stays identical |
| Charts | Inline SVG, single-hue, hover tooltips | Follows the `dataviz` conventions; light payload |

### Why the admin runs without a database

Phase 1 reads every screen from **`src/lib/mock-data.ts`** — realistic, invented
placeholder data. This lets the whole console be reviewed with no infrastructure.
Phase 3 swaps those functions for Prisma queries; call sites keep the same names
and shapes.

---

## Running locally

```bash
npm install
cp .env.example .env
npm run dev            # http://localhost:3000
```

Open `/login` and pick a role (Owner / Admin / Finance / Support / Viewer) to
explore the console with that permission set. There is no password in Phase 1 —
see the auth note above.

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
    (auth)/login         role picker sign-in (stub)
    admin/               the console — one folder per IA section
      layout.tsx         shell (sidebar + topbar + env badge)
      page.tsx           dashboard
      members/           list · detail · verify · CSV export route
      transactions/      list · detail · webhook (IPN) log
      content/           pages · legal (versioned) · FAQ · email templates
      membership/        product config (price, duration, ID format)
      users/             admin users · roles matrix · activity log
      settings/          general · branding · payment gateway · email · launch readiness
  components/
    ui/                  primitives (button, card, table, field, badge, …)
    admin/               shell (sidebar, topbar, account menu, page header)
    dashboard/           stat tiles, trend chart
  lib/
    rbac.ts              roles, permissions, permission matrix
    nav.ts               admin navigation model
    auth.ts / guard.ts   session + server-side permission gate
    mock-data.ts         PLACEHOLDER data source (Phase 1)
    format.ts            money / date / expiry ("Month YYYY") formatting
    membership-id.ts     Membership ID generator (BSL-XXXX-XXXX)
```

---

## Things that are deliberately placeholder

Everything company-specific is stubbed and flagged. `Settings › Launch readiness`
lists every item and blocks a "Go live" toggle until all are resolved:

- All marketing copy and FAQ (`src/lib/mock-data.ts`, later the CMS records)
- Terms & Conditions, Fair Usage Policy, Privacy Policy — empty stubs, publish disabled
- Membership price, currency, tax treatment, duration, renewal behaviour
- Membership ID format (prefix / length / checksum)
- MEPS credentials and endpoints; email provider and sending domain
- Company legal name, address, support email
- Vector logo and licensed font files (Crimson, Abd ElRady)

Do not fill these in with guesses — they come from the company (Phase 4) or from
the MEPS manual (Phase 3).
