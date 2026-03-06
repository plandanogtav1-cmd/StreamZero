'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, LogOut, Bookmark, Clock, Home, Menu, X
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { SearchBar } from './SearchBar';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';

export function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-bg/95 backdrop-blur-xl border-b border-white/5 shadow-lg'
          : 'bg-gradient-to-b from-bg/80 to-transparent backdrop-blur-sm'
      )}
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <span
              className="font-heading font-black text-xl md:text-2xl tracking-tight"
              style={{
                background: 'linear-gradient(90deg, #22D3EE, #A78BFA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              StreamZero
            </span>
            <span
              className="absolute -right-2 -top-1 text-[8px] font-bold text-accent opacity-80"
              aria-hidden
            >
              ★
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-textMuted hover:text-textPrimary transition-colors">
            Home
          </Link>
          <Link href="/browse" className="text-sm text-textMuted hover:text-textPrimary transition-colors">
            Browse
          </Link>
          <Link href="/watchlist" className="text-sm text-textMuted hover:text-textPrimary transition-colors">
            Watchlist
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <SearchBar />

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-textMuted hover:text-textPrimary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* User Menu */}
          {user ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-grad-cta text-bg font-bold text-sm transition-all hover:shadow-neon-cyan focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="User menu"
                >
                  {user.email?.[0]?.toUpperCase() ?? 'U'}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="glass rounded-xl p-1 w-52 shadow-xl border border-white/10 z-50 animate-fade-in-scale"
                  sideOffset={8}
                  align="end"
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs text-textMuted truncate">{user.email}</p>
                  </div>
                  <DropdownMenu.Item asChild>
                    <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-textPrimary hover:bg-white/5 cursor-pointer outline-none transition-colors">
                      <User className="w-4 h-4 text-textMuted" />
                      Profile
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/watchlist" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-textPrimary hover:bg-white/5 cursor-pointer outline-none transition-colors">
                      <Bookmark className="w-4 h-4 text-textMuted" />
                      Watchlist
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-white/10 my-1" />
                  <DropdownMenu.Item
                    onSelect={signOut}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 cursor-pointer outline-none transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm text-textMuted hover:text-textPrimary transition-colors px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold px-4 py-1.5 rounded-lg"
                style={{ background: 'linear-gradient(90deg, #22D3EE, #A78BFA)', color: '#07090D' }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-4 space-y-2 animate-fade-in">
          <Link href="/" className="flex items-center gap-3 py-2 text-sm text-textPrimary" onClick={() => setMobileOpen(false)}>
            <Home className="w-4 h-4 text-primary" />
            Home
          </Link>
          <Link href="/browse" className="flex items-center gap-3 py-2 text-sm text-textPrimary" onClick={() => setMobileOpen(false)}>
            <Menu className="w-4 h-4 text-primary" />
            Browse
          </Link>
          <Link href="/watchlist" className="flex items-center gap-3 py-2 text-sm text-textPrimary" onClick={() => setMobileOpen(false)}>
            <Bookmark className="w-4 h-4 text-primary" />
            Watchlist
          </Link>
          {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-3 py-2 text-sm text-textPrimary" onClick={() => setMobileOpen(false)}>
                <User className="w-4 h-4 text-primary" />
                Profile
              </Link>
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex items-center gap-3 py-2 text-sm text-red-400 w-full">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1 text-center py-2 text-sm border border-white/20 rounded-lg text-textPrimary" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
              <Link href="/signup" className="flex-1 text-center py-2 text-sm rounded-lg font-semibold text-bg" style={{ background: 'linear-gradient(90deg, #22D3EE, #A78BFA)' }} onClick={() => setMobileOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
