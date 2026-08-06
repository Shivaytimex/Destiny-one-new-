# Source baseline

This clean frontend represents the product work completed in the reviewed source
through **August 4, 2026 at 11:51:46 PM Pacific Time**.

The final reviewed timestamps were:

- UI composition: `App.tsx` — 11:50:37 PM
- Gift experience domain logic — 11:51:46 PM
- Gift Concierge v2 — 11:42:21 PM
- Gift service flow — 11:41:50 PM

The mixed Expo/backend/database repository is not copied into this frontend. Its
approved browser-visible behavior is organized into Next.js pages, reusable feature
components, browser-only data and pure calculation helpers. That architectural
separation is intentional and prevents the duplication and coupling reported by the
developer.

Feature coverage is enforced by `pnpm test:features`; frontend boundaries are
enforced separately by `pnpm test:boundaries`.

