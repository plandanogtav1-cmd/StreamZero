import Image from 'next/image';
import Link from 'next/link';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { imageUrl, yearFromDate } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getSeason(tvId: string, s: string) {
  const res = await fetch(`${BASE_URL}/api/tmdb/tv/${tvId}/season/${s}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

async function getShow(tvId: string) {
  const res = await fetch(`${BASE_URL}/api/tmdb/tv/${tvId}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ id: string; s: string; e: string }>;
}) {
  const { id, s, e } = await params;
  const [seasonData, showData] = await Promise.all([
    getSeason(id, s),
    getShow(id),
  ]);

  const episodeNum = parseInt(e);
  const seasonNum = parseInt(s);
  const episodes = seasonData?.episodes || [];
  const episode = episodes.find((ep: any) => ep.episode_number === episodeNum);
  const show = showData?.detail;
  const totalSeasons = show?.number_of_seasons || 1;

  const prevEpisode = episodes.find((ep: any) => ep.episode_number === episodeNum - 1);
  const nextEpisode = episodes.find((ep: any) => ep.episode_number === episodeNum + 1);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-textMuted mb-6" aria-label="Breadcrumb">
        <Link href={`/tv/${id}`} className="hover:text-primary transition-colors">
          {show?.name || 'Show'}
        </Link>
        <span>/</span>
        <span>Season {s}</span>
        <span>/</span>
        <span className="text-textPrimary">Episode {e}</span>
      </nav>

      {/* Episode Info */}
      <div className="glass rounded-2xl overflow-hidden">
        {episode?.still_path && (
          <div className="relative aspect-video w-full">
            <Image
              src={imageUrl(episode.still_path, 'w780')}
              alt={episode.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs text-textMuted mb-1">
                Season {seasonNum} · Episode {episodeNum}
              </p>
              <h1 className="text-xl md:text-2xl font-bold font-heading text-textPrimary">
                {episode?.name || `Episode ${episodeNum}`}
              </h1>
            </div>
            <Button asChild size="lg" className="flex-shrink-0">
              <Link href={`/watch/tv/${id}/season/${s}/episode/${e}`}>
                <Play className="w-5 h-5 fill-current" />
                Play
              </Link>
            </Button>
          </div>

          {episode?.overview && (
            <p className="text-textMuted text-sm leading-relaxed">{episode.overview}</p>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
            {prevEpisode ? (
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/tv/${id}/season/${s}/episode/${prevEpisode.episode_number}`}>
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </Link>
              </Button>
            ) : seasonNum > 1 ? (
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/tv/${id}/season/${seasonNum - 1}/episode/1`}>
                  <ChevronLeft className="w-4 h-4" />
                  Season {seasonNum - 1}
                </Link>
              </Button>
            ) : null}

            {nextEpisode ? (
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/tv/${id}/season/${s}/episode/${nextEpisode.episode_number}`}>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            ) : seasonNum < totalSeasons ? (
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/tv/${id}/season/${seasonNum + 1}/episode/1`}>
                  Season {seasonNum + 1}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* All episodes in this season */}
      {episodes.length > 1 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold font-heading text-textPrimary mb-4">
            Season {seasonNum} Episodes
          </h2>
          <div className="space-y-2">
            {episodes.map((ep: any) => (
              <Link
                key={ep.episode_number}
                href={`/tv/${id}/season/${s}/episode/${ep.episode_number}`}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/5 ${
                  ep.episode_number === episodeNum
                    ? 'bg-primary/10 border border-primary/20'
                    : 'border border-white/5'
                }`}
              >
                <span className="text-sm text-textMuted w-6 text-right flex-shrink-0">
                  {ep.episode_number}
                </span>
                {ep.still_path && (
                  <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface">
                    <Image src={imageUrl(ep.still_path, 'w300')} alt={ep.name} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-textPrimary truncate">{ep.name}</p>
                  {ep.runtime && (
                    <p className="text-xs text-textMuted">{ep.runtime}m</p>
                  )}
                </div>
                {ep.episode_number === episodeNum && (
                  <span className="text-xs text-primary font-medium">Now Playing</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
