# Fresher developer: start here

## 1. Confirm the project is healthy

Run `pnpm install`, then `pnpm verify`. Do not start feature work if verification
fails. `pnpm dev` starts the app at `http://localhost:3000`.

## 2. Find the feature

Open `/preview` in the browser. Every visible page links to its real route. Then use
the [developer navigation map](../DEVELOPER-NAVIGATION-MAP.md) to find the owning file.

The dependency direction is:

```text
page -> component -> data/service/helper
```

Never reverse it. A service must not import a component, and a component must not
know SQL tables or provider credentials.

## 3. Make a small change

1. Edit the owning component or helper only.
2. Keep route files small.
3. Use existing colors and spacing from `tailwind.config.ts` or `src/styles`.
4. Preserve accessible labels, keyboard focus and 44px touch targets.
5. Run `pnpm verify` again.

## 4. Frontend-only rule

Do not add Express, MySQL, Supabase, backend SDKs, authentication secrets, payment
keys, webhook code or direct API calls here. Future live integration should implement
the product actions documented in `contracts/REST-API-HANDOFF.md` from a separate
backend repository.

## 5. Demo data

Anika, Maya, Riya, sample addresses and seeded messages are deliberate preview data.
They are centralized in `src/data` or their owning feature component, not real users.
