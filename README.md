# DestinyOne — latest actual UI source

This branch contains the complete interactive Expo / React Native Web UI source as it existed at the end of **August 4, 2026**. It is the latest application code behind the approved preview—not the simplified migration shell on `main`.

## Included

- Complete `App.tsx` with every onboarding, match, discover, chat, date, gift, executive, profile, safety and internal preview state
- Complete `src/` UI, domain logic, hooks, demo/client adapters and frontend tests
- Original application assets and current gift product photography
- Shared gift catalog
- Standalone Expo, TypeScript and Vitest configuration

Backend servers, database schema/migrations, Supabase Edge Functions, deployment workflows, secrets, build output, nested handoff copies and dependency folders are intentionally excluded from this public branch.

## Run

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm web
```

## Snapshot identity

- `src/domain/giftExperience.ts`: 2026-08-04 23:51:46 America/Los_Angeles
- `App.tsx`: 2026-08-04 23:50:37 America/Los_Angeles
- `src/services/giftConciergeV2.ts`: 2026-08-04 23:42:21 America/Los_Angeles
- `src/services/gifts.ts`: 2026-08-04 23:41:50 America/Los_Angeles

The complete internal source suite contains 95 test files / 405 tests when run together with its private server and deployment contracts. This public UI-only branch runs the frontend-safe subset and omits tests that directly read excluded server files.

## Branch roles

- `main`: clean Next.js + TypeScript + Tailwind developer handoff
- `codex/latest-actual-ui-source-2026-08-04`: exact latest interactive UI reference

The developer should migrate the verified UI and behavior from this branch into the clean `main` architecture feature by feature. Do not merge the branch wholesale.
