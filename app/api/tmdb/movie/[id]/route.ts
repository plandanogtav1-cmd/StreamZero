import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const [detail, recommendations, similar] = await Promise.all([
      tmdbFetch(`/movie/${id}`, { append_to_response: 'credits,videos' }),
      tmdbFetch(`/movie/${id}/recommendations`),
      tmdbFetch(`/movie/${id}/similar`),
    ]);
    return NextResponse.json({ detail, recommendations, similar });
  } catch {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
  }
}
