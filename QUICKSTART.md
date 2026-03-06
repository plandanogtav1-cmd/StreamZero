# 🚀 BathalaFlix - Quick Start Guide

Get BathalaFlix running on your local machine in under 10 minutes!

## Prerequisites

Before you begin, make sure you have:

- **Node.js** 18.17 or later ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- A **TMDB account** (free)
- A **Supabase account** (free)
- A code editor (VS Code recommended)

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourname/bathalaflix.git
cd bathalaflix
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (~2-3 minutes).

## Step 3: Get Your API Keys

### 3.1 TMDB API Key

1. Go to [themoviedb.org](https://www.themoviedb.org/)
2. Create a free account
3. Go to **Settings** → **API**
4. Request an API key (choose "Developer" option)
5. Copy your **API Read Access Token (v4)**

### 3.2 Supabase Credentials

1. Go to [supabase.com](https://supabase.com/)
2. Create a free account
3. Click **"New Project"**
4. Fill in:
   - Project name: `bathalaflix`
   - Database password: (choose a strong password)
   - Region: (closest to you)
5. Wait for project to be created (~2 minutes)
6. Go to **Project Settings** → **API**
7. Copy:
   - `Project URL` → This is your `SUPABASE_URL`
   - `anon public` key → This is your `SUPABASE_ANON_KEY`
   - `service_role` key → This is your `SUPABASE_SERVICE_ROLE_KEY`

## Step 4: Set Up Environment Variables

1. Copy the example file:

```bash
cp .env.example .env.local
```

2. Open `.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_APP_NAME=BathalaFlix
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Paste your TMDB API key here
TMDB_API_KEY=your_actual_tmdb_api_key_here

# Vidking (no changes needed)
NEXT_PUBLIC_VIDKING_BASE=https://www.vidking.net
NEXT_PUBLIC_VIDKING_COLOR=22d3ee

# Paste your Supabase credentials here
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

## Step 5: Set Up the Database

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Open `supabase/schema.sql` from your project folder
5. Copy the entire contents
6. Paste into the Supabase SQL Editor
7. Click **"Run"** (bottom right)
8. You should see: "Success. No rows returned"

This creates three tables:
- `profiles` - User profiles
- `watchlist` - Saved movies/shows
- `watch_progress` - Playback positions

## Step 6: Enable Email Authentication

1. In Supabase, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Scroll down to **Email Templates** (optional)
4. Customize the confirmation email if desired

## Step 7: Run the Development Server

```bash
npm run dev
```

You should see:

```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in X.Xs
```

## Step 8: Open the App

1. Open your browser
2. Go to [http://localhost:3000](http://localhost:3000)
3. You should see the BathalaFlix homepage! 🎉

## Step 9: Create an Account

1. Click **"Sign Up"** in the top right
2. Enter your email and password
3. Click **"Create Account"**
4. Check your email for confirmation (if enabled)
5. Log in with your credentials

## Step 10: Start Watching!

- Browse trending movies and shows
- Search for your favorites
- Add items to your watchlist
- Click "Play" to start watching

---

## Common Issues & Solutions

### ❌ "Failed to fetch" errors

**Problem**: TMDB API key is invalid or missing

**Solution**: 
- Double-check your `TMDB_API_KEY` in `.env.local`
- Make sure you copied the **API Read Access Token (v4)**, not the API Key (v3)
- Restart the dev server after changing `.env.local`

### ❌ "Supabase client error"

**Problem**: Supabase credentials are incorrect

**Solution**:
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Make sure there are no extra spaces or quotes
- Restart the dev server

### ❌ "Table does not exist" error

**Problem**: Database schema wasn't created

**Solution**:
- Go back to Step 5 and run the SQL schema
- Make sure you ran the entire `schema.sql` file
- Check for any SQL errors in Supabase

### ❌ Port 3000 already in use

**Problem**: Another app is using port 3000

**Solution**:
```bash
# Use a different port
npm run dev -- -p 3001
```

Then open [http://localhost:3001](http://localhost:3001)

### ❌ Videos won't play

**Problem**: Vidking player issue or content not available

**Solution**:
- Check your internet connection
- Try a different movie/show
- Some content may not be available in your region
- Check browser console for errors

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

---

## Project Structure Quick Reference

```
bathalaflix/
├── app/                    # Pages and routes
│   ├── page.tsx           # Homepage
│   ├── login/             # Login page
│   ├── movie/[id]/        # Movie details
│   ├── watch/             # Video player pages
│   └── api/tmdb/          # API routes
├── components/            # React components
├── lib/                   # Utilities
├── hooks/                 # Custom hooks
├── types/                 # TypeScript types
└── supabase/             # Database schema
```

---

## Next Steps

Now that you have BathalaFlix running:

1. **Explore the code** - Check out the components and pages
2. **Customize the theme** - Edit `tailwind.config.ts`
3. **Add features** - Build on top of the existing codebase
4. **Deploy** - See `README.md` for deployment instructions

---

## Need Help?

- 📖 Read the full [README.md](./README.md)
- 📋 Check [OVERVIEW.md](./OVERVIEW.md) for architecture details
- 🐛 Check the Code Issues Panel for security recommendations
- 💬 Open an issue on GitHub

---

**Happy streaming! 🎬🍿**
