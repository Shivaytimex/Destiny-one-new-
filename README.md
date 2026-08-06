# DestinyOne Frontend

This repository is the single, clean frontend codebase for DestinyOne. It is based
on the product work completed through **August 4, 2026 at 11:51 PM Pacific Time**.

## Start here

```bash
pnpm install
pnpm verify
pnpm dev
```

Open `http://localhost:3000/preview` to see every page, or
`http://localhost:3000` to start from Home.

## Stack

- Next.js 14 Pages Router
- React 18
- TypeScript
- Tailwind CSS plus approved feature CSS
- Browser-local demo state only

## Folder map

```text
public/                 Images and icons
src/
├── pages/              URL routes; compose features only
├── components/
│   ├── auth/           Login, registration and onboarding UI
│   ├── chat/           Messages, calls, media, games and composer
│   ├── common/         Shared product experiences such as Gifts/Executive
│   ├── dates/          Date marketplace and planner
│   ├── home/           Home sections
│   ├── layout/         Shared navigation and shell
│   ├── profile/        Profile, Blueprint, milestones and Family Room
│   ├── safety/         Report/block safety UI
│   └── search/         Discovery, city density and post-date learning
├── data/               Static/demo catalogs and browser-local repository
├── hooks/              Reusable browser interaction hooks
├── services/           Pure calculations and browser-only helpers
├── styles/             Global and feature styles
└── utils/              Navigation/presentation utilities
contracts/              Documentation for the future separate REST backend
docs/                   Architecture, feature map and developer handoff
scripts/                Automated boundary, feature and route checks
```

## Important boundary

This repository intentionally contains **no backend, API implementation,
authentication provider, Express, MySQL, Supabase, payment provider, Socket.IO
server or secrets**. UI previews simulate these states locally. The future backend
and database must live in separate services and integrate through documented REST
contracts.

## Where to change something

- Change a page URL/composition: `src/pages/`
- Change chat, GIF, sticker or games UI: `src/components/chat/`
- Change the 1,000-GIF catalog: `src/data/chatMediaCatalog.ts`
- Change the 100 Truth/Dare prompts: `src/data/coupleGamePrompts.ts`
- Change gift checkout UI: `src/components/common/GiftMarketplaceExperience.tsx`
- Change gift prices/calculation: `src/data/giftCatalog.ts` and `src/services/gifts.ts`
- Change date logic: `src/components/dates/` and `src/services/places.ts`
- Change colors/fonts: `tailwind.config.ts` and `src/styles/`

Read [docs/FRESHER-START-HERE.md](docs/FRESHER-START-HERE.md) before editing and
[DEVELOPER-NAVIGATION-MAP.md](DEVELOPER-NAVIGATION-MAP.md) for every route.

## Verification

`pnpm verify` must pass before any push. It checks:

1. required frontend structure;
2. absence of backend/database/API coupling;
3. every internal route;
4. the agreed feature/source markers;
5. TypeScript; and
6. the optimized production build.
