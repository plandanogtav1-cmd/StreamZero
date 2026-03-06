import { createClient } from '@/lib/supabase/server';
import { buildTvUrl } from '@/lib/vidking';
import { WatchTVClient } from './WatchTVClient';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getShow(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/tmdb/tv/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()).detail;
  } catch {
    return null;
  }
}

async function getSavedProgress(tmdbId: number, season: number, episode: number) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from('watch_progress')
      .select('current_seconds, progress_percent')
      .match({ user_id: user.id, media_type: 'tv', tmdb_id: tmdbId, season, episode })
      .single();

    return data;
  } catch {
    return null;
  }
}

export default async function WatchTVPage({
  params,
}: {
  params: { id: string; s: string; e: string };
}) {
  const season = parseInt(params.s);
  const episode = parseInt(params.e);

  const [show, progress] = await Promise.all([
    getShow(params.id),
    getSavedProgress(parseInt(params.id), season, episode),
  ]);

  const resumeSeconds = progress?.progress_percent && progress.progress_percent < 95
    ? (progress.current_seconds || 0)
    : 0;

  const playerUrl = buildTvUrl(parseInt(params.id), season, episode, {
    autoPlay: true,
    nextEpisode: true,
    episodeSelector: true,
    progress: resumeSeconds,
  });

  return (
    <WatchTVClient
      tmdbId={parseInt(params.id)}
      showName={show?.name || 'TV Show'}
      season={season}
      episode={episode}
      playerUrl={playerUrl}
      resumeSeconds={resumeSeconds}
      totalSeasons={show?.number_of_seasons || 1}
      backdropPath={show?.backdrop_path}
    />
  );
}
