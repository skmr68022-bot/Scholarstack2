# ScholarStack

India's comprehensive educational platform — a notes marketplace + video reels + AI tutor + scholar creator economy, fully connected to Supabase for real authentication, database, and file storage.

## Run & Operate

- `pnpm --filter @workspace/scholarstack run dev` — run the ScholarStack frontend (port 22379)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite 7 + Tailwind CSS v4
- Routing: Wouter v3
- Auth + Database + Storage: Supabase
- UI: Custom dark-theme components + Radix UI primitives

## Where things live

```
artifacts/scholarstack/src/
├── App.tsx                  — root router (Wouter) + RequireAuth guards
├── context/AppContext.tsx   — Supabase-backed state (auth, purchases, bookmarks, uploads, admin)
├── lib/
│   ├── supabase.ts          — Supabase client
│   ├── database.types.ts    — TypeScript types for all DB tables
│   ├── db.ts                — all DB operations (profiles, notes, purchases, bookmarks, admin)
│   └── storage.ts           — file upload helpers (PDF, video, thumbnail, profile)
├── data/constants.ts        — exam tags, university tags, board tags (static reference)
├── layouts/
│   ├── StudentLayout.tsx    — sidebar nav for student section
│   └── ScholarLayout.tsx    — sidebar nav for scholar section
├── pages/
│   ├── Splash.tsx           — loading screen, checks auth → redirects to right section
│   ├── RoleSelect.tsx       — choose Student / Scholar / Admin
│   ├── Auth.tsx             — async email auth (Supabase signUp/signInWithPassword) + OTP demo flow
│   ├── Admin.tsx            — admin panel: users, scholar queue, content approval (live Supabase data)
│   ├── student/
│   │   ├── Home.tsx         — exam countdowns, category browse, quick access
│   │   ├── Notes.tsx        — competitive notes from Supabase (category=competitive, status=live)
│   │   ├── NoteDetail.tsx   — note detail + real purchase flow → supabase purchases table
│   │   ├── UniversityNotes.tsx — university notes from Supabase
│   │   ├── BoardNotes.tsx   — board notes from Supabase (CBSE/CISCE/State)
│   │   ├── Reels.tsx        — video reels feed
│   │   ├── Library.tsx      — purchased + bookmarked notes (from Supabase)
│   │   ├── AiTutor.tsx      — AI chat tutor
│   │   ├── Orders.tsx       — purchase history from Supabase
│   │   └── Profile.tsx      — Supabase profile update + logout
│   └── scholar/
│       ├── Overview.tsx     — creator dashboard with real earnings from uploads context
│       ├── Upload.tsx       — upload PDF/video to Supabase Storage + insert to notes table
│       ├── Content.tsx      — scholar's own notes filtered by scholarId
│       ├── Earnings.tsx     — earnings breakdown from real upload data
│       └── Analytics.tsx   — views/sales chart + top performing content
└── index.css                — dark theme CSS variables
```

## Supabase Setup (REQUIRED)

1. Go to your Supabase project → SQL Editor
2. Run the full schema in `artifacts/scholarstack/supabase-schema.sql`
3. Go to Authentication → Providers → Email → **disable "Confirm email"**
4. Environment variables are already set in `.env`:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon/public key
5. Storage buckets needed: `notes`, `videos`, `thumbnails`, `profiles`
   (Create in Storage → New bucket, set to public)

## Admin Setup

1. Sign up via the app using the Scholar or Student flow
2. In Supabase SQL editor run:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```
3. Log in again — you'll be routed to the Admin panel

## Routes

- `/` → Splash (auto-advances, redirects logged-in users to their section)
- `/role` → Role select
- `/auth/:role` → Auth screen (student/scholar/admin)
- `/student/*` → Student section (requires student auth)
- `/scholar/*` → Scholar section (requires scholar auth)
- `/admin` → Admin panel (requires admin auth)

## Architecture

- **Auth**: Supabase Auth (email/password). Session persisted with `persistSession: true`. Splash screen waits for auth resolution before redirecting.
- **Profiles**: Auto-created via Supabase trigger on `auth.users` insert. Role stored in `profiles.role`.
- **Notes**: Stored in `notes` table with `status` (review/live/rejected), `category` (competitive/university/board), `board_type`.
- **Purchases**: Written to `purchases` table on buy; loaded into context as a `Set<number>` for O(1) lookup.
- **Bookmarks**: Written to `bookmarks` table; toggled via `toggleBookmarkDB`.
- **Uploads**: Scholar uploads go to Supabase Storage (PDF/video) then insert into `notes` table with `status=review`. Admin approves → sets `status=live`.
- **Admin flow**: Admin sees all uploads from context. Approve = sets status to `live`. Reject = sets status to `rejected`.
- **RLS**: All tables protected by Row Level Security policies (see schema file).

## Product

- **Student flow**: Browse notes by exam/university/board, buy/download PDFs, watch learning reels, use AI chat tutor, track exam countdowns
- **Scholar flow**: Upload content (PDF/video/bundle), track earnings & payouts, view creator analytics
- **Admin flow**: User management, scholar approval queue, content moderation (approve/reject → immediate effect on student browse)

## User preferences

- Supabase for all auth, data, and storage — no dummy/in-memory data
- Dark theme throughout, no emojis in navigation
- Role-based auth guards on all protected routes

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- All DB operations are in `src/lib/db.ts` — add new queries there
- Storage helpers in `src/lib/storage.ts`
- AppContext is the single source of truth for runtime state — Supabase data is loaded into React state on auth
