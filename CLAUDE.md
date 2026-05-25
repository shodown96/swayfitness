@AGENTS.md

# SwayFitness — Claude Code Guidelines

## Comment style

**Never** use em dash or box-drawing characters as decorative padding in comments.

```ts
// BAD — do not write these:
// ── Auth: admin only ──────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
{/* ── Hero section ──────────────────────────────────────────────────────── */}

// GOOD — plain, minimal:
// Auth: admin only
// Hero section
{/* Hero section */}
```

The same rule applies to block separators like `// ============` and `// ------------`. Use a single short comment line instead.

## Code style

- TypeScript throughout — no `any` unless strictly necessary
- Prefer `const` / arrow functions for utilities; named `function` declarations for route handlers and page components
- Zod for all validation; always export both the schema (`...Schema`) and the inferred type (`...Type`)
- Prisma for all DB access — no raw SQL
- All API responses go through `constructResponse()` in `lib/response.ts`
- Auth checks happen at the **top** of every route handler, before any DB queries

## Project conventions

- Public routes live under `app/(main)/(public)/`
- Admin routes live under `app/admin/(main)/`
- Member dashboard lives under `app/(main)/dashboard/`
- API routes live under `app/api/`
- Client-side services live in `lib/services/*.service.ts`
- Zustand stores live in `lib/stores/`
- Path constants live in `lib/constants/paths.ts`; API endpoint constants in `lib/constants/api.ts`

## Payments

- Paystack amounts are always in **kobo** on the API side; the DB and UI use **naira**
- `PaystackService` handles the kobo conversion internally for `createPlan` and `createRefund`
- Always verify transactions server-side via `PaystackService.verifyTransaction()` — never trust client-supplied amounts

## Email

- All transactional emails go through `EmailService.sendHTML()` with an HTML template in `public/templates/`
- Template placeholders use `{{variableName}}` syntax
- In development (`DEBUG=true`) templates are read from disk; in production they are fetched from the origin URL
