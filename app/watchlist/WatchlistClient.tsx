'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Trash2, Bookmark } from 'lucide-react';
import { imageUrl } from '@/lib/tmdb';
import { createClient } from '@/lib/supabase/client';
import { EmptyState } from '@/components/EmptyState';
import { useToast } from '@/hooks/use-toast';

interface WatchlistItem {
  id: number;
  media_type: 'movie' | 'tv';
  tmdb_id: number;
  title: string;
  poster_path?: string;
  created_at: string;
}

export function WatchlistClient({ initialItems }: { initialItems: WatchlistItem[] }) {
  const [items, setItems] = useState(initialItems);
  const { toast } = useToast();

  const removeItem = async (itemId: number, title: string) => {
    const supabase = createClient();
    await supabase.from('watchlist').delete().eq('id', itemId);
    setItems(prev => prev.filter(i => i.id !== itemId));
    toast({ title: `Removed "${title}" from watchlist` });
  };

  if (items.length === 0) {
    return (
      <div className="pt-20">
        <EmptyState
          icon={<Bookmark />}
          title="Your watchlist is empty"
          description="Add movies and TV shows to keep track of what you want to watch."
          action={{ label: 'Browse Content', href: '/' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark className="w-6 h-6 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-textPrimary">
          My Watchlist
        </h1>
        <span className="text-sm text-textMuted">({items.length})</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item) => {
          const watchHref = item.media_type === 'movie'
            ? `/watch/movie/${item.tmdb_id}`
            : `/watch/tv/${item.tmdb_id}/season/1/episode/1`;

          return (
            <div key={item.id} className="group relative">
              <Link href={`/${item.media_type}/${item.tmdb_id}`}>
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-surface border border-white/5 group-hover:border-primary/20 transition-all shadow-card group-hover:shadow-card-hover">
                  <Image
                    src={imageUrl(item.poster_path, 'w342')}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Link
                      href={watchHref}
                      onClick={e => e.stopPropagation()}
                      className="flex items-center justify-center w-10 h-10 bg-primary rounded-full text-bg hover:shadow-neon-cyan transition-all"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </Link>
                    <button
                      onClick={(e) => { e.preventDefault(); removeItem(item.id, item.title); }}
                      className="flex items-center justify-center w-10 h-10 bg-red-500/20 rounded-full text-red-400 hover:bg-red-500/30 transition-all border border-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
              <p className="mt-2 text-xs font-medium text-textPrimary line-clamp-2 px-0.5">
                {item.title}
              </p>
              <p className="text-[10px] text-textMuted capitalize px-0.5">{item.media_type}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
