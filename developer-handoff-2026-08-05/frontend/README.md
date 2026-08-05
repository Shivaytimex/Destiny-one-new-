# DestinyOne frontend-only handoff

This folder is the clean Next.js 14 + TypeScript + Tailwind CSS UI delivery. It is
intentionally independent from every backend runtime.

## Guaranteed boundaries

- No Express, Node API, MySQL, Supabase, serverless function or database code.
- No REST calls, `fetch`, Axios, Socket.IO or backend environment variables.
- No production authentication or payment implementation.
- Login, registration, checkout, chat receipts, calls, notifications and order states are frontend demonstrations only.
- Device-local preview state is isolated in `src/data/frontendRepository.js` and can be replaced later without redesigning components.
- The original mixed project is not required to build or run this folder.
- Application source uses `.ts` and `.tsx`; JavaScript remains only in standard
  tool configuration/scripts where the runtime expects it.
- Tailwind theme tokens are configured in `tailwind.config.ts`. Existing approved
  feature CSS is retained to prevent visual drift during the architecture migration.

## Start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000/preview` for the complete route catalog.

Read `DEVELOPER-HANDOFF-NOTE.md` first. It states exactly what is included,
what is intentionally excluded and how the future backend should integrate.

## Validate

```bash
pnpm verify
```

The verification command runs boundary checks, route integrity, TypeScript checking
and the optimized Next.js production build.

## Architecture

```text
src/
├── pages/          Next.js routes only
├── components/     UI grouped by product area
├── data/           Static catalog and device-local preview repository
├── hooks/          Frontend interaction hooks
├── services/       Pure frontend calculations and browser-only helpers
├── styles/         Global and feature styles
└── utils/          Navigation and presentation utilities
```

Future backend work belongs in a separate repository/service. The intended REST boundaries are documented in `contracts/REST-API-HANDOFF.md`; they are documentation, not executable frontend code.

## Important preview behavior

- Forms save only to browser storage.
- Messaging simulates typing and receipt transitions locally.
- Audio/video call controls use browser media capabilities; they do not create a real remote call.
- Gift checkout creates a preview order and never charges a payment method.
- Safety reports stay on the device and are not submitted to moderation.

## Developer rule

Do not add backend SDKs or database clients to this project. When integration begins, create a small typed adapter package in a separate integration phase and keep UI components unaware of transport, credentials and database details.
