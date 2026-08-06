# Delivery manifest

## Scope

- Deliverable: standalone Next.js + TypeScript + Tailwind CSS frontend source.
- Source pages: 33.
- Generated static pages: 37, including sample dynamic match routes.
- Feature component files: 27.
- Preview catalog: `/preview`.
- Production backend/database: not included by design.

## Required checks

Run from the repository root:

1. `pnpm test:boundaries` — rejects network/backend/database code in `src/`.
2. `pnpm test:routes` — verifies internal links resolve to delivered Next.js pages.
3. `pnpm typecheck` — validates TypeScript application boundaries.
4. `pnpm build` — creates the optimized static production build.
5. `pnpm verify` — runs all checks in sequence.

## Feature coverage

The UI includes Home, Login, Register, Onboarding, Verification, Discover, Search,
Matches, Match Detail, Mutual Match, Icebreaker, Chat, Dates, Gifts, Recipient Gift
Response, Coach, Profile, Profile Settings, Marriage Blueprint, Journey/Family Room,
Couple Mode, Community Density, Trusted Circle, Executive, Membership, Likes,
Notifications, Safety, Support, Readiness/Post-Date Feedback, Admin Preview and About.

## Separation guarantee

The frontend source does not contain executable Express, MySQL, Supabase, API client,
Socket.IO or serverless-function code. It does not contain provider credentials.
Device-local repositories and static catalogs support UI review only. The original
mixed repository is preserved on the recovery branch
`backup/original-mixed-2026-08-05`; it is not part of the clean `main` tree.

## Integration ownership

The backend team owns authentication, authorization, persistence, matching jobs,
realtime delivery, calls, moderation, billing, gift fulfillment, notifications,
provider webhooks and MySQL. Before integration, agree on OpenAPI contracts and keep
the frontend DTO adapter separate from page/component presentation.
