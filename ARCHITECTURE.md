# Frontend architecture and ownership

## Technology baseline

- Next.js 14 Pages Router
- React 18
- TypeScript application source (`.ts` / `.tsx`)
- Tailwind CSS 3 with DestinyOne theme tokens
- Preserved feature CSS for pixel-stable migration of the approved UI
- Static export for independent CDN hosting

## Layer rules

### Pages

Pages compose feature components and provide route-level metadata. They must not contain persistence, network or database logic.

### Components

Components own presentation, validation feedback, keyboard/touch behavior and short-lived UI state. They consume domain-shaped frontend repositories rather than endpoint paths.

### Data

`frontendRepository.js` is a browser-only preview fixture. Its methods are named around product actions (`saveProposal`, `saveDecision`, `send`) rather than HTTP verbs. This prevents REST and database details from leaking into UI components.

### Services

Services in this handoff are pure calculations or browser-only helpers. Gift totals, delivery validation, local place recommendations and consented preview analytics belong here. Network clients do not.

### Future integration boundary

The future integration layer will be developed separately after UI acceptance. It may implement REST clients behind the same product actions, but must not expose SQL tables, provider secrets, HTTP status handling or authentication tokens to page components.

## Deployment separation

| Service | Responsibility | Current folder |
|---|---|---|
| Frontend | Next.js static UI | This handoff |
| Backend API | Auth, matching, chat, orders, moderation | Not included |
| MySQL | Schema, migrations, indexes, data integrity | Not included |
| Realtime/calls | Socket gateway, presence, signaling | Not included |
| Workers | Notifications, gift fulfillment, webhooks | Not included |

The frontend can be deployed independently to a static/CDN host. Backend and database outages cannot break its build.
