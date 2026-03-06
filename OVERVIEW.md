# 🎬 BathalaFlix - Project Overview

## What is BathalaFlix?

BathalaFlix is a **free, ad-free streaming platform** that provides a premium movie and TV show watching experience. Think Netflix, but completely free with no advertisements.

## Key Features

### 🎥 Core Functionality
- **Stream Movies & TV Shows** - Watch thousands of titles using the Vidking player
- **Search & Discover** - Find content by title, browse by genre, or explore trending content
- **Watchlist** - Save your favorite movies and shows for later
- **Continue Watching** - Automatically resume from where you left off
- **Pinoy Content** - Dedicated section for Filipino movies and shows

### 🔐 User Features
- **Account System** - Sign up with email/password via Supabase Auth
- **Personal Profile** - Manage your account and preferences
- **Progress Tracking** - Your watch progress is saved automatically across devices

### 🎨 Design
- **Dark/Neon Theme** - Sleek dark interface with neon cyan and violet accents
- **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- **Accessible** - WCAG AA compliant with keyboard navigation support

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components built on Radix

### Backend & Services
- **Supabase** - PostgreSQL database + authentication + real-time features
- **TMDB API** - Movie/TV metadata (titles, posters, descriptions, etc.)
- **Vidking Player** - Embedded video player for streaming

### Key Libraries
- **Lucide React** - Icon library
- **Space Grotesk & Inter** - Custom fonts
- **React Hook Form** - Form handling

## How It Works

### 1. Content Discovery
- TMDB API provides all movie/TV metadata (titles, posters, descriptions, ratings)
- Server-side API routes fetch data securely without exposing API keys
- Content is organized into carousels: Trending, Top 10, Genres, etc.

### 2. Video Playback
- Vidking player handles all video streaming
- URLs are constructed with TMDB IDs: `/embed/movie/{tmdbId}` or `/embed/tv/{tmdbId}/{season}/{episode}`
- Player supports autoplay, episode selection, and progress tracking

### 3. User Data
- **Supabase Auth** manages user accounts
- **PostgreSQL tables** store:
  - User profiles (username, avatar)
  - Watchlist (saved movies/shows)
  - Watch progress (playback position for each title)
- **Row Level Security (RLS)** ensures users only access their own data

### 4. Progress Tracking
- Vidking player sends `postMessage` events with playback time
- Watch pages listen for these events and save progress to Supabase
- On next visit, saved progress is passed to player via `?progress=` parameter

## Project Structure

```
bathalaflix/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage with hero + carousels
│   ├── login/                    # Authentication pages
│   ├── signup/
│   ├── search/                   # Search results
│   ├── movie/[id]/               # Movie details
│   ├── tv/[id]/                  # TV show details
│   ├── watch/                    # Video player pages
│   │   ├── movie/[id]/
│   │   └── tv/[id]/season/[s]/episode/[e]/
│   ├── watchlist/                # User's saved content
│   ├── continue-watching/        # Resume watching
│   ├── profile/                  # User profile
│   └── api/tmdb/                 # Server-side TMDB API routes
│
├── components/                   # React components
│   ├── Header.tsx                # Navigation bar
│   ├── HeroBanner.tsx            # Homepage hero section
│   ├── MediaCard.tsx             # Movie/TV card with hover effects
│   ├── CarouselRow.tsx           # Horizontal scrolling carousel
│   ├── PlayerFrame.tsx           # Vidking iframe wrapper
│   └── SearchBar.tsx             # Search input with debounce
│
├── hooks/                        # Custom React hooks
│   ├── useDebounce.ts            # Debounce search input
│   ├── usePlayerProgress.ts      # Track video progress
│   └── use-toast.ts              # Toast notifications
│
├── lib/                          # Utility functions
│   ├── tmdb.ts                   # TMDB API helpers
│   ├── vidking.ts                # Vidking URL builders
│   ├── utils.ts                  # General utilities
│   └── supabase/                 # Supabase clients
│       ├── client.ts             # Browser client
│       └── server.ts             # Server client
│
├── types/                        # TypeScript types
│   └── media.ts                  # Media interfaces
│
├── supabase/                     # Database schema
│   └── schema.sql                # Tables + RLS policies
│
├── middleware.ts                 # Auth protection
└── tailwind.config.ts            # Theme configuration
```

## Database Schema

### Tables

**profiles**
- `id` (UUID, references auth.users)
- `username` (text)
- `avatar_url` (text)
- `created_at` (timestamp)

**watchlist**
- `id` (UUID)
- `user_id` (UUID, references profiles)
- `media_type` ('movie' | 'tv')
- `media_id` (integer, TMDB ID)
- `title` (text)
- `poster_path` (text)
- `added_at` (timestamp)

**watch_progress**
- `id` (UUID)
- `user_id` (UUID, references profiles)
- `media_type` ('movie' | 'tv')
- `media_id` (integer, TMDB ID)
- `season_number` (integer, nullable)
- `episode_number` (integer, nullable)
- `current_seconds` (integer)
- `total_seconds` (integer)
- `percent_watched` (numeric)
- `last_watched_at` (timestamp)

All tables have **Row Level Security (RLS)** enabled - users can only access their own data.

## Security Features

- ✅ TMDB API key never exposed to browser (server-side only)
- ✅ Supabase RLS prevents unauthorized data access
- ✅ Protected routes require authentication (via middleware)
- ✅ Environment variables for all sensitive data
- ⚠️ **Note**: Security scan found SSRF vulnerabilities - see Code Issues Panel

## Performance Optimizations

- **Server-side rendering** for fast initial page loads
- **API response caching** (1 hour revalidation)
- **Image optimization** via Next.js Image component
- **Lazy loading** for carousels and images
- **Debounced search** to reduce API calls

## Accessibility

- ♿ WCAG AA contrast ratios
- ⌨️ Full keyboard navigation
- 🎯 Visible focus indicators
- 🏷️ Proper ARIA labels
- 🎬 Reduced motion support

## Deployment

- **Recommended**: Vercel (optimized for Next.js)
- **Alternative**: Any Node.js hosting platform
- **Database**: Supabase (free tier available)
- **CDN**: Automatic via Vercel Edge Network

## Environment Variables

Required for the app to function:

```env
# App Config
NEXT_PUBLIC_APP_NAME=BathalaFlix
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# TMDB (get from themoviedb.org)
TMDB_API_KEY=your_api_key

# Vidking Player
NEXT_PUBLIC_VIDKING_BASE=https://www.vidking.net
NEXT_PUBLIC_VIDKING_COLOR=22d3ee

# Supabase (get from supabase.com)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Limitations & Considerations

- **Content Availability**: Depends on Vidking's catalog
- **TMDB API**: Rate limited (check TMDB docs)
- **Supabase Free Tier**: 500MB database, 2GB bandwidth/month
- **Legal**: Ensure compliance with content licensing in your region

## Future Enhancements

Potential features to add:
- User reviews and ratings
- Social features (share watchlists, follow friends)
- Download for offline viewing
- Multiple profiles per account
- Parental controls
- Subtitle support
- Multiple language support
- Recommendation algorithm

## License

MIT License - Free to use, modify, and distribute.

---

**Built with ❤️ for movie lovers everywhere. Free. No ads. Pure cinema.**
