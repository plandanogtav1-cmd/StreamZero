import { Suspense } from 'react';
import { HeroBanner } from '@/components/HeroBanner';
import { CarouselRow } from '@/components/CarouselRow';
import { MediaCard } from '@/components/MediaCard';
import { HeroBannerSkeleton, RowSkeleton } from '@/components/Skeletons/CardSkeleton';
import { imageUrl, yearFromDate, runtimeToText } from '@/lib/tmdb';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getHomeData() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateStr = thirtyDaysAgo.toISOString().split('T')[0];

    const [trendingRes, top10Res, recentRes, actionRes, comedyRes, dramaRes, horrorRes, filRes] =
      await Promise.allSettled([
        fetch(`${BASE_URL}/api/tmdb/trending?mediaType=all&window=day`, { next: { revalidate: 3600 } }),
        fetch(`${BASE_URL}/api/tmdb/top10`, { next: { revalidate: 3600 } }),
        fetch(`${BASE_URL}/api/tmdb/discover?mediaType=movie&releaseDateGte=${dateStr}&sortBy=release_date.desc`, { next: { revalidate: 3600 } }),
        fetch(`${BASE_URL}/api/tmdb/discover?mediaType=movie&genreId=28`, { next: { revalidate: 3600 } }),
        fetch(`${BASE_URL}/api/tmdb/discover?mediaType=movie&genreId=35`, { next: { revalidate: 3600 } }),
        fetch(`${BASE_URL}/api/tmdb/discover?mediaType=tv&genreId=18`, { next: { revalidate: 3600 } }),
        fetch(`${BASE_URL}/api/tmdb/discover?mediaType=movie&genreId=27`, { next: { revalidate: 3600 } }),
        fetch(`${BASE_URL}/api/tmdb/discover?mediaType=movie&language=tl`, { next: { revalidate: 3600 } }),
      ]);

    const parse = async (r: PromiseSettledResult<Response>) => {
      if (r.status === 'rejected') return { results: [] };
      try { return await r.value.json(); } catch { return { results: [] }; }
    };

    const [trending, top10, recent, action, comedy, drama, horror, filipino] = await Promise.all([
      parse(trendingRes),
      parse(top10Res),
      parse(recentRes),
      parse(actionRes),
      parse(comedyRes),
      parse(dramaRes),
      parse(horrorRes),
      parse(filRes),
    ]);

    return { trending, top10, recent, action, comedy, drama, horror, filipino };
  } catch {
    return { trending: { results: [] }, top10: { results: [] }, recent: { results: [] }, action: { results: [] }, comedy: { results: [] }, drama: { results: [] }, horror: { results: [] }, filipino: { results: [] } };
  }
}

export default async function HomePage() {
  const { trending, top10, recent, action, comedy, drama, horror, filipino } = await getHomeData();

  const heroItems = trending?.results?.slice(0, 10).map((item: any) => ({
    tmdbId: item.id,
    mediaType: item.media_type || 'movie',
    title: item.title || item.name,
    overview: item.overview,
    backdropPath: item.backdrop_path,
    rating: item.vote_average,
    year: yearFromDate(item.release_date || item.first_air_date),
  })) || [];

  return (
    <div className="pb-20">
      {/* Hero */}
      <Suspense fallback={<HeroBannerSkeleton />}>
        {heroItems.length > 0 ? (
          <HeroBanner items={heroItems} />
        ) : (
          <div className="min-h-[60vh] flex items-center justify-center bg-surface">
            <p className="text-textMuted">Loading...</p>
          </div>
        )}
      </Suspense>

      <div className="space-y-12 mt-8">
        {/* Top 10 */}
        {top10?.results?.length > 0 && (
          <CarouselRow title="Top 10 Today">
            {top10.results.map((item: any) => (
              <MediaCard
                key={item.id}
                tmdbId={item.id}
                mediaType={item.media_type || 'movie'}
                title={item.title || item.name}
                posterPath={item.poster_path}
                rating={item.vote_average}
                year={yearFromDate(item.release_date || item.first_air_date)}
                overview={item.overview}
                rank={item.rank}
                showRank
                className="w-[180px] sm:w-[200px] md:w-[220px]"
              />
            ))}
          </CarouselRow>
        )}

        {/* Recently Added */}
        {recent?.results?.length > 0 && (
          <CarouselRow title="🆕 Recently Added">
            {recent.results.slice(0, 20).map((item: any) => (
              <MediaCard
                key={item.id}
                tmdbId={item.id}
                mediaType={item.media_type || 'movie'}
                title={item.title || item.name}
                posterPath={item.poster_path}
                rating={item.vote_average}
                year={yearFromDate(item.release_date || item.first_air_date)}
                overview={item.overview}
              />
            ))}
          </CarouselRow>
        )}

        {/* Trending */}
        {trending?.results?.length > 0 && (
          <CarouselRow title="Trending Now">
            {trending.results.slice(0, 20).map((item: any) => (
              <MediaCard
                key={item.id}
                tmdbId={item.id}
                mediaType={item.media_type || 'movie'}
                title={item.title || item.name}
                posterPath={item.poster_path}
                rating={item.vote_average}
                year={yearFromDate(item.release_date || item.first_air_date)}
                overview={item.overview}
              />
            ))}
          </CarouselRow>
        )}

        {/* Action */}
        {action?.results?.length > 0 && (
          <CarouselRow title="🔥 Action & Thriller">
            {action.results.slice(0, 20).map((item: any) => (
              <MediaCard
                key={item.id}
                tmdbId={item.id}
                mediaType={item.media_type || 'movie'}
                title={item.title || item.name}
                posterPath={item.poster_path}
                rating={item.vote_average}
                year={yearFromDate(item.release_date || item.first_air_date)}
                overview={item.overview}
              />
            ))}
          </CarouselRow>
        )}

        {/* Drama */}
        {drama?.results?.length > 0 && (
          <CarouselRow title="🎭 Drama Series">
            {drama.results.slice(0, 20).map((item: any) => (
              <MediaCard
                key={item.id}
                tmdbId={item.id}
                mediaType={'tv'}
                title={item.title || item.name}
                posterPath={item.poster_path}
                rating={item.vote_average}
                year={yearFromDate(item.first_air_date)}
                overview={item.overview}
              />
            ))}
          </CarouselRow>
        )}

        {/* Comedy */}
        {comedy?.results?.length > 0 && (
          <CarouselRow title="😂 Comedy">
            {comedy.results.slice(0, 20).map((item: any) => (
              <MediaCard
                key={item.id}
                tmdbId={item.id}
                mediaType={'movie'}
                title={item.title || item.name}
                posterPath={item.poster_path}
                rating={item.vote_average}
                year={yearFromDate(item.release_date)}
                overview={item.overview}
              />
            ))}
          </CarouselRow>
        )}

        {/* Horror */}
        {horror?.results?.length > 0 && (
          <CarouselRow title="👻 Horror & Suspense">
            {horror.results.slice(0, 20).map((item: any) => (
              <MediaCard
                key={item.id}
                tmdbId={item.id}
                mediaType={'movie'}
                title={item.title || item.name}
                posterPath={item.poster_path}
                rating={item.vote_average}
                year={yearFromDate(item.release_date)}
                overview={item.overview}
              />
            ))}
          </CarouselRow>
        )}

        {/* Pinoy Spotlight */}
        {filipino?.results?.length > 0 && (
          <CarouselRow title="🇵🇭 Pinoy Spotlight">
            {filipino.results.slice(0, 20).map((item: any) => (
              <MediaCard
                key={item.id}
                tmdbId={item.id}
                mediaType={item.media_type || 'movie'}
                title={item.title || item.name}
                posterPath={item.poster_path}
                rating={item.vote_average}
                year={yearFromDate(item.release_date || item.first_air_date)}
                overview={item.overview}
              />
            ))}
          </CarouselRow>
        )}
      </div>
    </div>
  );
}
