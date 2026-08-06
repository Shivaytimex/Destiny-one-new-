# Note for the DestinyOne developer

This delivery is a clean frontend-only rebuild of the approved DestinyOne UI.
Open the repository root directly. The previous mixed tree is preserved on
`backup/original-mixed-2026-08-05` and is not required for frontend work.

## What is included

- One standalone Next.js 14 application using TypeScript and Tailwind CSS.
- 33 page source routes producing 37 static pages, including dynamic match samples.
- Home, onboarding, search, matching, chat, dates, gifts, profile, relationship,
  membership, safety, support and admin-preview experiences.
- Responsive UI components, CSS, static assets and browser-local interaction demos.
- A route catalog at `/preview`.
- Automated architecture-boundary, navigation and production-build checks.
- Documentation of future REST resources without executable backend code.

## What is deliberately not included

- Express/Node backend runtime.
- API route implementations or HTTP client calls.
- Authentication/session provider integration.
- MySQL schema, migrations, queries or ORM.
- Supabase, Socket.IO, payment, merchant, courier, email, SMS or push providers.
- Provider secrets or production environment configuration.

Those systems must be built and deployed as separate services. Current chat,
checkout, matching, notification and moderation behaviors are clearly bounded UI
previews so the frontend can be reviewed and stabilized independently.

## First review steps

1. Use Node.js 20+ and pnpm 9+.
2. Run `pnpm install`.
3. Run `pnpm verify`; boundary, route, TypeScript and build stages must pass.
4. Run `pnpm dev` and open `http://localhost:3000/preview`.
5. Review `ARCHITECTURE.md`, `FEATURE-STATUS.md`,
   `DEVELOPER-NAVIGATION-MAP.md` and `contracts/REST-API-HANDOFF.md`.

## Non-negotiable architecture rule

Keep frontend, backend and MySQL as separate deployable projects. Future API work
must not import server/database code into this frontend. Agree on OpenAPI DTOs and
error envelopes first, then add a small typed adapter layer in a separate integration
phase after the UI is accepted.

## TypeScript migration note

All application files under `src/` are `.ts` or `.tsx`, and `pnpm typecheck`
passes. The compatibility migration currently uses `strict: false` so the approved
UI behavior remains stable. The interaction-dense legacy Chat component has one
isolated `@ts-nocheck` annotation; repository/service boundaries are still checked.
The recommended next hardening task is to split that component into typed message,
media, call and preferences modules, then enable strict mode incrementally. This is
explicitly documented so it cannot be mistaken for finished strict-mode coverage.
