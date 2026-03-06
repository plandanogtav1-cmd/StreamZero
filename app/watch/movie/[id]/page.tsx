import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { buildMovieUrl } from '@/lib/vidking';
import { WatchMovieClient } from './WatchMovieClient';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getMovie(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/tmdb/movie/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.detail;
  } catch {
    return null;
  }
}

async function getSavedProgress(tmdbId: number) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from('watch_progress')
      .select('current_seconds, progress_percent')
      .match({ user_id: user.id, media_type: 'movie', tmdb_id: tmdbId })
      .single();

    return data;
  } catch {
    return null;
  }
}

export default async function WatchMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [movie, progress] = await Promise.all([
    getMovie(id),
    getSavedProgress(parseInt(id)),
  ]);

  const resumeSeconds = progress?.progress_percent && progress.progress_percent < 95
    ? (progress.current_seconds || 0)
    : 0;

  const playerUrl = buildMovieUrl(parseInt(id), {
    autoPlay: true,
    progress: resumeSeconds,
  });

  return (
    <WatchMovieClient
      tmdbId={parseInt(id)}
      title={movie?.title || 'Movie'}
      playerUrl={playerUrl}
      resumeSeconds={resumeSeconds}
      backdropPath={movie?.backdrop_path}
    />
  );
}
