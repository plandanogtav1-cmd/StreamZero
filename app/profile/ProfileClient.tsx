'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, Save, Bookmark, Clock } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
}

interface ProfileClientProps {
  user: SupabaseUser;
  profile: Profile | null;
}

export function ProfileClient({ user, profile }: ProfileClientProps) {
  const [username, setUsername] = useState(profile?.username || '');
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const saveProfile = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, username });

    if (error) {
      toast({ title: 'Error saving profile', description: error.message });
    } else {
      toast({ title: 'Profile saved!' });
    }
    setSaving(false);
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const initials = (username || user.email || 'U')[0].toUpperCase();
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold font-heading text-textPrimary mb-8">
        Profile
      </h1>

      {/* Avatar + Info */}
      <div className="glass rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex items-center gap-5 mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-bg text-2xl font-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #22D3EE, #A78BFA)' }}
          >
            {initials}
          </div>
          <div>
            <p className="font-bold text-textPrimary text-lg">{username || 'User'}</p>
            <p className="text-textMuted text-sm">{user.email}</p>
            <p className="text-textMuted text-xs mt-1">Member since {joinDate}</p>
          </div>
        </div>

        {/* Edit username */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-textMuted mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-textPrimary text-sm outline-none focus:border-primary/50 transition-all"
              placeholder="your_username"
            />
          </div>
          <Button onClick={saveProfile} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="glass rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-4">
          My Library
        </h2>
        <div className="space-y-2">
          <Link
            href="/watchlist"
            className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-white/5 transition-colors group"
          >
            <Bookmark className="w-5 h-5 text-primary" />
            <span className="text-textPrimary text-sm font-medium">Watchlist</span>
            <span className="ml-auto text-xs text-textMuted group-hover:text-primary transition-colors">→</span>
          </Link>
          <Link
            href="/continue-watching"
            className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-white/5 transition-colors group"
          >
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-textPrimary text-sm font-medium">Continue Watching</span>
            <span className="ml-auto text-xs text-textMuted group-hover:text-primary transition-colors">→</span>
          </Link>
        </div>
      </div>

      {/* Danger zone */}
      <div className="glass rounded-2xl p-6 border border-red-500/10">
        <h2 className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-4">
          Account
        </h2>
        <button
          onClick={signOut}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
