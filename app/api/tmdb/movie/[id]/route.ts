import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [detail, recommendations, similar] = await Promise.all([
      tmdbFetch(`/movie/${params.id}`, { append_to_response: 'credits,videos' }),
      tmdbFetch(`/movie/${params.id}/recommendations`),
      tmdbFetch(`/movie/${params.id}/similar`),
    ]);
    return NextResponse.json({ detail, recommendations, similar });
  } catch {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
  }
}
