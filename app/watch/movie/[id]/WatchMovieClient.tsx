'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { PlayerFrame } from '@/components/PlayerFrame';
import { usePlayerProgress } from '@/hooks/usePlayerProgress';
import { backdropUrl } from '@/lib/tmdb';

interface WatchMovieClientProps {
  tmdbId: number;
  title: string;
  playerUrl: string;
  resumeSeconds: number;
  backdropPath?: string | null;
}

export function WatchMovieClient({ tmdbId, title, playerUrl, resumeSeconds, backdropPath }: WatchMovieClientProps) {
  usePlayerProgress({ mediaType: 'movie', tmdbId });

  return (
    <div className="min-h-screen bg-bg pt-14">
      {/* Background */}
      {backdropPath && (
        <div className="fixed inset-0 -z-10">
          <Image
            src={backdropUrl(backdropPath)}
            alt=""
            fill
            className="object-cover scale-110 blur-3xl opacity-20"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/70 to-bg" />
        </div>
      )}

      {/* Top bar */}
      <div className="glass border-b border-white/5 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/movie/${tmdbId}`}
            className="flex items-center gap-2 text-textMuted hover:text-textPrimary transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="text-white/20">|</span>
          <h1 className="text-sm font-medium text-textPrimary truncate max-w-[200px] md:max-w-none">
            {title}
          </h1>
        </div>
        {resumeSeconds > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-primary">
            <Clock className="w-3.5 h-3.5" />
            Resuming
          </div>
        )}
      </div>

      {/* Player */}
      <div className="px-0 md:px-4 lg:px-8 py-4 md:py-6 max-w-6xl mx-auto">
        <PlayerFrame src={playerUrl} title={title} backdropPath={backdropPath} />

        <div className="mt-4 px-4 md:px-0 flex items-center justify-between">
          <p className="text-textMuted text-xs">
            Powered by Vidking Player • Progress saved automatically
          </p>
          <div className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#22D3EE', boxShadow: '0 0 6px #22D3EE' }}
            />
            <span className="text-xs text-primary">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
