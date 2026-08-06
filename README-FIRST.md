# DestinyOne clean developer handoff

Open this repository root as the application workspace. It is a Next.js 14
frontend written in TypeScript and styled with Tailwind CSS plus preserved
feature-layer CSS. This delivery follows the agreed frontend-first architecture
and contains no backend, API, authentication or MySQL implementation.

## Folder layout

```text
Destiny-one-new-/
├── README-FIRST.md
├── DELIVERY-MANIFEST.md
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── pages/
│   ├── components/
│   │   ├── layout/
│   │   ├── home/
│   │   ├── auth/
│   │   ├── profile/
│   │   ├── search/
│   │   ├── chat/
│   │   ├── dates/
│   │   ├── safety/
│   │   └── common/
│   ├── data/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   └── styles/
├── contracts/
├── scripts/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## Run and verify

```bash
pnpm install
pnpm verify
pnpm dev
```

Open `http://localhost:3000/preview` to review every page. Read
`DEVELOPER-HANDOFF-NOTE.md` before integrating anything.

## Why there is no backend folder

The developer explicitly requested that the stable frontend be delivered first and
remain independent from server/database code. Backend, REST API and MySQL work is
phase two and must be a separate service/repository. The future resource boundaries
are documentation-only in `contracts/REST-API-HANDOFF.md`.
