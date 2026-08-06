# Frontend feature status

| Area | UI delivered | Interactive preview | Production backend included |
|---|---:|---:|---:|
| Home and Discover | Yes | Yes | No |
| Onboarding and verification | Yes | Device-local | No |
| Matches and profile detail | Yes | Yes | No |
| Profile/settings/Blueprint/Journey | Yes | Device-local | No |
| Chat, attachments, receipts, games, GIF UI | Yes | Simulated locally | No |
| Audio/video call controls | Yes | Browser preview | No signaling backend |
| Date marketplace/planner | Yes | Local recommendations | No provider API |
| Gift catalog/checkout/recipient response | Yes | Preview order only | No merchant/payment/courier API |
| Membership/billing | Yes | Selection only | No charging/store integration |
| Safety/moderation/admin | Yes | Device-local preview | No moderation backend |
| Notifications | Yes | Browser permission preview | No push provider |

Production behavior must not be inferred from preview simulation. The separate backend phase will implement security, persistence and provider integrations.
