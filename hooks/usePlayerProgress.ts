'use client';

import { useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PlayerEvent } from '@/types/media';

interface UsePlayerProgressOpts {
  mediaType: 'movie' | 'tv';
  tmdbId: number;
  season?: number;
  episode?: number;
  title?: string;
  posterPath?: string | null;
}

export function usePlayerProgress(opts: UsePlayerProgressOpts) {
  const { mediaType, tmdbId, season, episode } = opts;

  const handleMessage = useCallback(async (event: MessageEvent) => {
    if (event.origin !== 'https://www.vidking.net') return;

    let payload: PlayerEvent;
    try {
      payload = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    } catch {
      return;
    }

    if (payload?.type !== 'PLAYER_EVENT' || !payload.data) return;

    const d = payload.data;
    if (!d.currentTime || !d.duration) return;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const progressPercent = Math.min(99.9, (d.currentTime / d.duration) * 100);

    if (d.event !== 'pause' && d.event !== 'ended') return;

    const upsertData: Record<string, unknown> = {
      user_id: user.id,
      media_type: mediaType,
      tmdb_id: tmdbId,
      duration_seconds: Math.floor(d.duration),
      current_seconds: Math.floor(d.currentTime),
      progress_percent: progressPercent,
      last_seen_at: new Date().toISOString(),
    };

    if (mediaType === 'tv') {
      upsertData.season = season ?? 1;
      upsertData.episode = episode ?? 1;
    }

    await supabase.from('watch_progress').upsert(upsertData, {
      onConflict: 'user_id,media_type,tmdb_id,season,episode',
    });
  }, [mediaType, tmdbId, season, episode]);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);
}
