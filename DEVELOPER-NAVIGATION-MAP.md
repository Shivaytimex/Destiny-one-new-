# DestinyOne developer navigation map

This document describes only this standalone Next.js frontend. There is no hidden
legacy/Expo app, backend runtime, API implementation or database in this handoff.
The `/preview` catalog uses an iframe only to display this package's own Next.js
routes side by side; every displayed page is also directly navigable.

Start at `/preview` to open every delivered route from one catalog.

## Route ownership

| Product area | Route | Primary UI ownership |
| --- | --- | --- |
| Home | `/` | `components/home/*`, `components/layout/*` |
| Login | `/login` | `components/auth/AuthForm.tsx` |
| Registration | `/register` | `components/auth/AuthForm.tsx` |
| Onboarding | `/onboarding` | onboarding page and auth components |
| Verification | `/verification` | verification page |
| Discover/search | `/search` | `components/search/*` |
| Discovery controls | `/discovery` | discovery page |
| Matches | `/matches` | match cards and local repository |
| Match detail | `/match/[id]` | dynamic match detail route |
| Mutual match | `/mutual` | mutual-match page |
| Icebreaker | `/icebreaker` | icebreaker page |
| Chat | `/messages` | `components/chat/RealtimeChatExperience.tsx`, `ChatMediaPicker.tsx`, `CoupleGamesPanel.tsx` |
| Dates | `/dates` | `components/dates/*` |
| Gifts | `/gifts` | `components/common/GiftMarketplaceExperience.tsx` |
| Gift response | `/gifts/respond` | recipient accept/decline preview |
| Coach | `/coach` | coach page |
| Profile | `/profile` | `components/profile/ProfileSummary.tsx` |
| Profile settings | `/profile/settings` | `components/profile/ProfileSettingsExperience.tsx` |
| Marriage Blueprint | `/blueprint` | `components/profile/MarriageBlueprintExperience.tsx` |
| Journey / Family Room | `/journey` | `components/profile/RelationshipMilestonesFamilyRoom.tsx` |
| Couple mode | `/couple` | couple page |
| Community/density | `/community` | city-density UI |
| Trusted Circle | `/trusted-circle` | trusted-circle page |
| Executive | `/executive` | `components/common/ExecutiveOverview.tsx` |
| Membership | `/membership` | membership page |
| Likes | `/likes` | likes page |
| Notifications | `/notifications` | notification settings page |
| Safety | `/safety` | `components/safety/SafetyReportForm.tsx` |
| Support | `/support` | support page |
| Readiness/feedback | `/readiness` | post-date feedback UI |
| Admin | `/admin` | frontend moderation preview |
| About | `/about` | about page |

## Internal UI versus separate pages

Sheets, dialogs, filters, attachment menus, message actions, gift cart steps,
profile edit controls and consent panels are components inside their owning route.
They are intentionally not separate page files. A new route is appropriate only
when the user should be able to navigate to or refresh that state independently.

## State and data behavior

- `src/data/frontendRepository.ts` provides device-local preview actions.
- `src/data/giftCatalog.ts` is the single static gift catalog for this UI build.
- `src/data/chatMediaCatalog.ts` owns the 1,000 GIF records and custom stickers.
- `src/data/coupleGamePrompts.ts` owns the 100 Truth/Dare prompts.
- `src/services/*` contains calculations and browser-only helpers, never transport.
- Reload-persistent demo values use browser storage and are not user accounts.
- Chat delivery/read states, calls, checkout, notifications and moderation are UI
  simulations. They never claim a real provider action succeeded.

## Backend integration rule

Do not put API URLs, SQL, authentication tokens, provider SDKs or Express code in
pages/components. When the separate backend is ready, implement a typed adapter
behind product actions described in `contracts/REST-API-HANDOFF.md`. The UI should
continue to consume product-shaped methods, not endpoint paths or database rows.

## Automated verification

Run `pnpm verify`. It checks forbidden backend/network patterns, validates all
internal route links, and creates a production Next.js build.
