# ScholarStack

India's comprehensive educational platform — a notes marketplace + video reels + AI tutor + scholar creator economy, built as a fully functional React mockup.

## Run & Operate

- `pnpm --filter @workspace/scholarstack run dev` — run the ScholarStack frontend (port 22379)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite 7 + Tailwind CSS v4
- Routing: Wouter v3
- State: React Context (in-memory, no backend)
- UI: Custom dark-theme components + Radix UI primitives

## Where things live

```
artifacts/scholarstack/src/
├── App.tsx                  — root router (Wouter)
├── context/AppContext.tsx   — shared state (purchases, bookmarks, uploads, users)
├── data/constants.ts        — all mock data (notes, scholars, reels, exam tags)
├── layouts/
│   ├── StudentLayout.tsx    — sidebar nav for student section
│   └── ScholarLayout.tsx   — sidebar nav for scholar section
├── pages/
│   ├── Splash.tsx           — loading screen (auto-advances to /role)
│   ├── RoleSelect.tsx       — choose Student / Scholar / Admin
│   ├── Auth.tsx             — email/OTP/Google auth for any role
│   ├── Admin.tsx            — full admin panel (users, scholar queue, content)
│   ├── student/
│   │   ├── Home.tsx         — exam countdowns, recommendations, scholars
│   │   ├── Notes.tsx        — browse & filter notes
│   │   ├── NoteDetail.tsx   — note detail + purchase flow
│   │   ├── Reels.tsx        — video reels feed
│   │   ├── Library.tsx      — purchased notes
│   │   ├── AiTutor.tsx      — AI chat tutor
│   │   ├── Orders.tsx       — purchase history
│   │   └── Profile.tsx      — student profile
│   └── scholar/
│       ├── Overview.tsx     — creator dashboard with revenue stats
│       ├── Upload.tsx       — upload PDF/video/bundle form
│       ├── Content.tsx      — content management table
│       ├── Earnings.tsx     — earnings & payout history
│       └── Analytics.tsx   — views, sales, audience insights
└── index.css                — dark theme CSS variables
```

## Routes

- `/` → Splash (auto-advances)
- `/role` → Role select
- `/auth/:role` → Auth screen
- `/student/*` → Student section
- `/scholar/*` → Scholar section
- `/admin` → Admin panel

## Architecture decisions

- All state is in-memory via React Context — no backend needed for this mockup
- Purchase flow: buying a note adds its ID to a `Set<number>` in context; Library/Orders filter notes by this set
- Scholar uploads add to the `uploads` array in context; new items appear in Content table immediately
- Admin scholar approvals remove from the `pendingScholars` array
- Dark theme is deep near-black (#0a0a0f) with violet accents for student flows, cyan for scholar flows, red/orange for admin

## Product

- **Student flow**: Browse notes by exam, buy/download PDFs, watch learning reels, use AI chat tutor, track exam countdowns
- **Scholar flow**: Upload content (PDF/video/bundle), track earnings & payouts, view creator analytics
- **Admin flow**: User management, scholar approval queue, content moderation, platform stats

## User preferences

- No backend — all in-memory state for this mockup
- Dark theme throughout, no emojis in navigation

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
