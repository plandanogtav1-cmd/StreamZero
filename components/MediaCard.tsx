'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Plus, Check, Info, Star } from 'lucide-react';
import { imageUrl } from '@/lib/tmdb';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';

interface MediaCardProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  rating?: number;
  year?: string;
  overview?: string;
  inWatchlist?: boolean;
  className?: string;
  rank?: number;
  showRank?: boolean;
}

export function MediaCard({
  tmdbId,
  mediaType,
  title,
  posterPath,
  rating,
  year,
  overview,
  inWatchlist: initialInWatchlist = false,
  className,
  rank,
  showRank = false,
}: MediaCardProps) {
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { toast } = useToast();

  const detailHref = `/${mediaType}/${tmdbId}`;
  const watchHref = mediaType === 'movie'
    ? `/watch/movie/${tmdbId}`
    : `/watch/tv/${tmdbId}/season/1/episode/1`;

  const toggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to use your watchlist.' });
      setLoading(false);
      return;
    }

    if (inWatchlist) {
      await supabase.from('watchlist').delete().match({
        user_id: user.id,
        media_type: mediaType,
        tmdb_id: tmdbId,
      });
      setInWatchlist(false);
      toast({ title: 'Removed from Watchlist' });
    } else {
      await supabase.from('watchlist').upsert({
        user_id: user.id,
        media_type: mediaType,
        tmdb_id: tmdbId,
        title,
        poster_path: posterPath || null,
      });
      setInWatchlist(true);
      toast({ title: 'Added to Watchlist', variant: 'success' } as any);
    }
    setLoading(false);
  };

  return (
    <div
      className={cn(
        'media-card group relative carousel-item',
        showRank ? 'w-[140px] sm:w-[160px]' : 'w-[150px] sm:w-[170px] md:w-[190px]',
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Rank Badge */}
      {showRank && rank && (
        <div className="absolute -left-3 bottom-16 z-10 pointer-events-none">
          <span
            className="font-heading font-black text-[4rem] leading-none"
            style={{
              WebkitTextStroke: '2px rgba(34,211,238,0.4)',
              color: 'transparent',
              textShadow: '0 0 20px rgba(34,211,238,0.15)',
            }}
          >
            {rank}
          </span>
        </div>
      )}

      <div className="relative aspect-[2/3] overflow-hidden rounded-xl cursor-pointer">
        <Image
          src={imageUrl(posterPath, 'w342')}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 150px, (max-width: 768px) 170px, 190px"
        />

        {/* Hover Overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-bg/85 backdrop-blur-sm flex flex-col justify-end p-3 transition-all duration-200',
            hovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          {overview && (
            <p className="text-xs text-textMuted line-clamp-3 mb-3">{overview}</p>
          )}
          <div className="flex gap-1.5">
            <Link
              href={watchHref}
              className="flex-1 flex items-center justify-center gap-1 bg-primary text-bg rounded-lg py-1.5 text-xs font-semibold hover:shadow-neon-cyan transition-all"
            >
              <Play className="w-3 h-3 fill-current" />
              Play
            </Link>
            <button
              onClick={toggleWatchlist}
              disabled={loading}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {inWatchlist ? (
                <Check className="w-3.5 h-3.5 text-primary" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-textPrimary" />
              )}
            </button>
            <Link
              href={detailHref}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="More info"
            >
              <Info className="w-3.5 h-3.5 text-textPrimary" />
            </Link>
          </div>
        </div>
      </div>

      {/* Card Info */}
      <Link href={detailHref} className="block px-0.5 mt-2 space-y-0.5">
        <p className="text-xs font-medium text-textPrimary line-clamp-2 leading-tight">{title}</p>
        <div className="flex items-center gap-2">
          {rating && rating > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-yellow-400">
              <Star className="w-2.5 h-2.5 fill-current" />
              {rating.toFixed(1)}
            </span>
          )}
          {year && (
            <span className="text-[10px] text-textMuted">{year}</span>
          )}
        </div>
      </Link>
    </div>
  );
}
