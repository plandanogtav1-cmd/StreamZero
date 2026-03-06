# 🎬 BathalaFlix

> **Free. No ads. Pure cinema.**

A dark/neon/tech cinematic streaming platform built with Next.js 14, Supabase, and Vidking Player — delivering a premium, ad-free movie and TV streaming experience.

![BathalaFlix](https://via.placeholder.com/1200x600/07090D/22D3EE?text=BathalaFlix+%E2%80%94+Free.+No+ads.+Pure+cinema.)

---

## ✨ Features

- 🎬 **Exclusive Vidking Player** — embedded for all movie & TV playback
- 📺 **TMDB Integration** — trending, top 10, genres, search, details (server-side only)
- 🔖 **Watchlist** — add/remove movies and shows
- ▶️ **Continue Watching** — progress saved automatically; resumes from where you left off
- 🔐 **Supabase Auth** — email/password login with protected routes
- 🌏 **Pinoy Spotlight** — Filipino content row
- 🎨 **Dark/Neon/Tech UI** — deep charcoal + neon cyan + neon violet palette
- 📱 **Fully Responsive** — mobile, tablet, desktop
- ♿ **WCAG AA Accessible** — keyboard navigation, focus rings, reduced motion

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui (Radix) |
| Database | Supabase (Postgres + RLS) |
| Auth | Supabase Auth |
| Video | Vidking Player (exclusive embed) |
| Metadata | TMDB API (server-side) |
| Fonts | Space Grotesk (headings) + Inter (body) |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/yourname/bathalaflix.git
cd bathalaflix
npm install
```

### 2. Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your keys:

```env
NEXT_PUBLIC_APP_NAME=BathalaFlix
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# TMDB — server-side only, never exposed to client
TMDB_API_KEY=your_tmdb_api_key_here

# Vidking
NEXT_PUBLIC_VIDKING_BASE=https://www.vidking.net
NEXT_PUBLIC_VIDKING_COLOR=22d3ee

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. This creates: `profiles`, `watchlist`, `watch_progress` tables with full RLS policies
4. Enable **Email Auth** under Authentication → Providers

### 4. Get your TMDB API Key

1. Register at [themoviedb.org](https://www.themoviedb.org/)
2. Go to Settings → API and request a key
3. Use the **API Read Access Token (v4)** as `TMDB_API_KEY`

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
bathalaflix/
├── app/
│   ├── layout.tsx                # Root layout with Header + Toaster
│   ├── page.tsx                  # Homepage (hero + carousels)
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── search/page.tsx
│   ├── movie/[id]/page.tsx
│   ├── tv/[id]/page.tsx
│   ├── tv/[id]/season/[s]/episode/[e]/page.tsx
│   ├── watch/
│   │   ├── movie/[id]/           # Movie watch page + Vidking
│   │   └── tv/[id]/season/[s]/episode/[e]/  # TV watch page + Vidking
│   ├── watchlist/page.tsx
│   ├── continue-watching/page.tsx
│   ├── profile/page.tsx
│   └── api/tmdb/                 # All TMDB calls (server-side)
│       ├── trending/route.ts
│       ├── top10/route.ts
│       ├── genres/route.ts
│       ├── discover/route.ts
│       ├── search/route.ts
│       ├── movie/[id]/route.ts
│       └── tv/[id]/season/[s]/route.ts
├── components/
│   ├── Header.tsx                # Sticky nav with search + user menu
│   ├── HeroBanner.tsx            # Full-bleed hero with gradient
│   ├── MediaCard.tsx             # Hover card with play/watchlist
│   ├── CarouselRow.tsx           # Horizontal scroll carousel
│   ├── PlayerFrame.tsx           # Vidking iframe wrapper
│   ├── SearchBar.tsx             # Debounced search
│   ├── EmptyState.tsx
│   ├── Toaster.tsx
│   └── Skeletons/
│       └── CardSkeleton.tsx
├── hooks/
│   ├── useDebounce.ts
│   ├── usePlayerProgress.ts      # postMessage listener → Supabase upsert
│   └── use-toast.ts
├── lib/
│   ├── tmdb.ts                   # Server-side TMDB helpers
│   ├── vidking.ts                # URL builders for movie & TV
│   ├── utils.ts
│   └── supabase/
│       ├── client.ts             # Browser client
│       └── server.ts             # Server client (cookies)
├── types/
│   └── media.ts                  # TypeScript interfaces
├── middleware.ts                  # Auth guard for protected routes
├── supabase/schema.sql           # Full DB schema + RLS
└── tailwind.config.ts            # Full theme config
```

---

## 🎥 Vidking Player Integration

BathalaFlix uses **Vidking** as its **exclusive video player**. No other player is used.

### URL Format

**Movies:**
```
https://www.vidking.net/embed/movie/{tmdbId}?color=22d3ee&autoPlay=true&progress=120
```

**TV Episodes:**
```
https://www.vidking.net/embed/tv/{tmdbId}/{season}/{episode}?color=22d3ee&autoPlay=true&nextEpisode=true&episodeSelector=true&progress=120
```

### Parameters

| Param | Description |
|-------|-------------|
| `color` | Hex color without `#` (default: `22d3ee`) |
| `autoPlay` | Auto-start playback |
| `nextEpisode` | Show next episode button (TV) |
| `episodeSelector` | Show episode selector UI (TV) |
| `progress` | Resume position in seconds |

### Progress Tracking

The watch pages listen to `window.message` events from the Vidking player:

```typescript
// Strict origin validation
if (event.origin !== 'https://www.vidking.net') return;

// Parse payload
const payload = JSON.parse(event.data);
if (payload.type !== 'PLAYER_EVENT') return;

// Upsert to Supabase on pause/timeupdate/ended
await supabase.from('watch_progress').upsert({ ... });
```

Progress is persisted in `watch_progress` table. On next visit, the saved `current_seconds` is passed as `?progress=` to the Vidking URL.

---

## 🗃 Supabase Schema

Run `supabase/schema.sql` in your Supabase SQL editor. It creates:

### Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profile (username, avatar) |
| `watchlist` | Saved movies/TV shows per user |
| `watch_progress` | Per-content playback position & percent |

### RLS

All tables have Row Level Security enabled. Users can only read/write their own rows.

---

## 🌐 TMDB Usage

All TMDB requests are made **server-side** via Next.js Route Handlers in `/app/api/tmdb/`. The `TMDB_API_KEY` environment variable is **never exposed to the browser**.

API responses are cached with `next: { revalidate: 3600 }` (1 hour).

> This product uses the TMDB API but is not endorsed or certified by TMDB.

---

## 🚢 Deployment on Vercel

1. Push your repo to GitHub
2. Import into [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy 🎉

For the `NEXT_PUBLIC_SITE_URL`, use your production URL (e.g., `https://bathalaflix.vercel.app`).

---

## ♿ Accessibility

- WCAG AA contrast ratios throughout
- Keyboard-navigable carousels with `Arrow` key support
- Visible focus rings (neon cyan)
- `aria-label` on all icon buttons
- `prefers-reduced-motion` respected — all animations disabled

---

## 🎨 Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#07090D` | Page background |
| `--surface` | `#0B0F14` | Elevated surfaces |
| `--card` | `#121826` | Cards |
| `--primary` | `#22D3EE` | Neon cyan — CTAs, highlights |
| `--secondary` | `#A78BFA` | Neon violet — accents |
| `--accent` | `#00FFB0` | Neon mint — sparingly |
| `--textPrimary` | `#E5E7EB` | Body text |
| `--textMuted` | `#9CA3AF` | Secondary text |

---

## 📝 License

MIT — see LICENSE file.

---

*Built with ❤️ by the BathalaFlix team. Free. No ads. Pure cinema.*
