import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await tmdbFetch('/search/multi', { query: q, include_adult: 'false' }, 60);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
