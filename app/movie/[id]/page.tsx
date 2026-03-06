import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Bookmark, Star, Clock, Calendar } from 'lucide-react';
import { imageUrl, backdropUrl, runtimeToText, yearFromDate } from '@/lib/tmdb';
import { MediaCard } from '@/components/MediaCard';
import { CarouselRow } from '@/components/CarouselRow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getMovie(id: string) {
  const res = await fetch(`${BASE_URL}/api/tmdb/movie/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getMovie(id);
  const movie = data?.detail;
  if (!movie) return { title: 'Movie' };
  return {
    title: movie.title,
    description: movie.overview,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: movie.backdrop_path ? [backdropUrl(movie.backdrop_path)] : [],
    },
  };
}

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getMovie(id);

  if (!data?.detail) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-textMuted">Movie not found.</p>
          <Link href="/" className="text-primary mt-4 inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  const movie = data.detail;
  const similar = [...(data.recommendations?.results || []), ...(data.similar?.results || [])].slice(0, 20);
  const genres = (movie.genres || []).map((g: any) => g.name);
  const year = yearFromDate(movie.release_date);
  const runtime = runtimeToText(movie.runtime);

  return (
    <div className="min-h-screen pb-20">
      {/* Backdrop Hero */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        {movie.backdrop_path ? (
          <Image
            src={backdropUrl(movie.backdrop_path)}
            alt={movie.title}
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
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="w-[140px] md:w-[200px] rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src={imageUrl(movie.poster_path, 'w342')}
                alt={movie.title}
                width={200}
                height={300}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 pt-4 md:pt-8">
            <h1 className="font-heading text-2xl md:text-4xl font-black text-textPrimary leading-tight">
              {movie.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2">
              {movie.vote_average > 0 && (
                <Badge variant="rating">
                  <Star className="w-3 h-3 fill-current" />
                  {movie.vote_average.toFixed(1)}
                </Badge>
              )}
              {year && <Badge variant="outline"><Calendar className="w-3 h-3" />{year}</Badge>}
              {runtime && <Badge variant="outline"><Clock className="w-3 h-3" />{runtime}</Badge>}
              {genres.slice(0, 3).map((g: string) => (
                <Badge key={g} variant="secondary">{g}</Badge>
              ))}
            </div>

            {/* Overview */}
            <p className="text-textMuted text-sm md:text-base leading-relaxed max-w-2xl">
              {movie.overview}
            </p>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap pt-2">
              <Button asChild size="lg">
                <Link href={`/watch/movie/${movie.id}`}>
                  <Play className="w-5 h-5 fill-current" />
                  Play Now
                </Link>
              </Button>
              <Button variant="secondary" size="lg">
                <Bookmark className="w-5 h-5" />
                Watchlist
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <div className="mt-12">
          <CarouselRow title="More Like This">
            {similar.map((item: any) => (
              <MediaCard
                key={item.id}
                tmdbId={item.id}
                mediaType="movie"
                title={item.title || item.name}
                posterPath={item.poster_path}
                rating={item.vote_average}
                year={yearFromDate(item.release_date)}
                overview={item.overview}
              />
            ))}
          </CarouselRow>
        </div>
      )}
    </div>
  );
}
