import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get('mediaType') || 'movie';
  const genreId = searchParams.get('genreId');
  const region = searchParams.get('region');
  const language = searchParams.get('language');
  const page = searchParams.get('page') || '1';
  const releaseDateGte = searchParams.get('releaseDateGte');
  const sortBy = searchParams.get('sortBy');

  const params: Record<string, string> = {
    page,
    sort_by: sortBy || 'popularity.desc',
  };

  if (genreId) params.with_genres = genreId;
  if (region) params.region = region;
  if (language) params.with_original_language = language;
  if (releaseDateGte) {
    if (mediaType === 'movie') {
      params['release_date.gte'] = releaseDateGte;
    } else {
      params['first_air_date.gte'] = releaseDateGte;
    }
  }

  try {
    const data = await tmdbFetch(`/discover/${mediaType}`, params);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to discover' }, { status: 500 });
  }
}
