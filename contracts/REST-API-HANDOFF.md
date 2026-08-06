# Future REST API handoff (documentation only)

This document describes future integration boundaries. It contains no executable client, authentication or database code.

## Contract principles

1. Backend owns authentication, authorization, validation and rate limits.
2. MySQL identifiers and table shapes never become frontend contracts.
3. Every mutation uses an idempotency key where duplicate submission is costly.
4. Private addresses, payment details and identity documents never return to unrelated UI sessions.
5. Responses use stable product DTOs and consistent error envelopes.

## Planned resources

- Session: current member, login, registration, logout and recovery.
- Profiles: member profile, settings, privacy, verification and completion.
- Matching: introductions, decisions, explanations, dealbreakers and density.
- Chat: conversations, messages, receipts, reactions, media metadata and preferences.
- Calls: signaling session creation and lifecycle events.
- Dates: proposals, venue search, status, reminders, cancellation and feedback.
- Gifts: catalog, quote, inventory reservation, recipient consent, payment authorization, fulfillment, reactions and support.
- Membership: products, entitlements, purchase status and restore.
- Safety: reports, blocks, unmatch, account export and deletion.
- Notifications: preferences, devices and delivery history.
- Admin: moderation queue and role-scoped actions.

## Integration acceptance criteria

- OpenAPI specification reviewed before client generation.
- Authentication implemented outside presentation components.
- Contract tests run independently against the backend.
- Frontend demo repository remains available for Storybook/visual QA.
- Production provider credentials exist only in backend secret storage.
