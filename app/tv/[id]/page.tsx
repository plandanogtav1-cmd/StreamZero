import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Calendar, Tv } from 'lucide-react';
import { imageUrl, backdropUrl, yearFromDate } from '@/lib/tmdb';
import { MediaCard } from '@/components/MediaCard';
import { CarouselRow } from '@/components/CarouselRow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getTVShow(id: string) {
  const res = await fetch(`${BASE_URL}/api/tmdb/tv/${id}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getTVShow(params.id);
  const show = data?.detail;
  if (!show) return { title: 'TV Show' };
  return {
    title: show.name,
    description: show.overview,
    openGraph: {
      title: show.name,
      description: show.overview,
      images: show.backdrop_path ? [backdropUrl(show.backdrop_path)] : [],
    },
  };
}

export default async function TVShowPage({ params }: { params: { id: string } }) {
  const data = await getTVShow(params.id);

  if (!data?.detail) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <p className="text-textMuted">Show not found.</p>
      </div>
    );
  }

  const show = data.detail;
  const recommendations = data.recommendations?.results?.slice(0, 20) || [];
  const genres = (show.genres || []).map((g: any) => g.name);
  const seasons = (show.seasons || []).filter((s: any) => s.season_number > 0);

  return (
    <div className="min-h-screen pb-20">
      {/* Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        {show.backdrop_path ? (
          <Image
            src={backdropUrl(show.backdrop_path)}
            alt={show.name}
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-surface" />
        )}
        <div className="absolute inset-0 bg-grad-hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/70 to-transparent" />
      </div>

      {/* Details */}
      <div className="relative -mt-32 z-10 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="flex-shrink-0">
            <div className="w-[140px] md:w-[200px] rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src={imageUrl(show.poster_path, 'w342')}
                alt={show.name}
                width={200}
                height={300}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="flex-1 space-y-4 pt-4 md:pt-8">
            <h1 className="font-heading text-2xl md:text-4xl font-black text-textPrimary">
              {show.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              {show.vote_average > 0 && (
                <Badge variant="rating">
                  <Star className="w-3 h-3 fill-current" />
                  {show.vote_average.toFixed(1)}
                </Badge>
              )}
              {show.first_air_date && (
                <Badge variant="outline">
                  <Calendar className="w-3 h-3" />
                  {yearFromDate(show.first_air_date)}
                </Badge>
              )}
              {show.number_of_seasons && (
                <Badge variant="outline">
                  <Tv className="w-3 h-3" />
                  {show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}
                </Badge>
              )}
              {genres.slice(0, 3).map((g: string) => (
                <Badge key={g} variant="secondary">{g}</Badge>
              ))}
            </div>

            <p className="text-textMuted text-sm md:text-base leading-relaxed max-w-2xl">
              {show.overview}
            </p>

            <div className="flex gap-3 flex-wrap pt-2">
              <Button asChild size="lg">
                <Link href={`/watch/tv/${show.id}/season/1/episode/1`}>
                  <Play className="w-5 h-5 fill-current" />
                  Play S1 E1
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Seasons */}
        {seasons.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold font-heading text-textPrimary mb-6">
              Seasons
              <span className="ml-2 inline-block w-8 h-0.5 bg-grad-cta rounded-full align-middle" />
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {seasons.map((season: any) => (
                <Link
                  key={season.season_number}
                  href={`/tv/${show.id}/season/${season.season_number}/episode/1`}
                  className="group block"
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-surface border border-white/5 group-hover:border-primary/30 transition-all shadow-card group-hover:shadow-card-hover">
                    <Image
                      src={imageUrl(season.poster_path, 'w342')}
                      alt={season.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-xs font-semibold text-textPrimary">{season.name}</p>
                      <p className="text-[10px] text-textMuted">{season.episode_count} episodes</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-12">
          <CarouselRow title="More Like This">
            {recommendations.map((item: any) => (
              <MediaCard
                key={item.id}
                tmdbId={item.id}
                mediaType="tv"
                title={item.name || item.title}
                posterPath={item.poster_path}
                rating={item.vote_average}
                year={yearFromDate(item.first_air_date)}
                overview={item.overview}
              />
            ))}
          </CarouselRow>
        </div>
      )}
    </div>
  );
}
