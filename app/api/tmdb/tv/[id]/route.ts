import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [detail, recommendations] = await Promise.all([
      tmdbFetch(`/tv/${params.id}`, { append_to_response: 'credits,videos' }),
      tmdbFetch(`/tv/${params.id}/recommendations`),
    ]);
    return NextResponse.json({ detail, recommendations });
  } catch {
    return NextResponse.json({ error: 'TV show not found' }, { status: 404 });
  }
}
