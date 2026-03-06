import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get('mediaType') || 'movie';

  try {
    const data = await tmdbFetch(`/genre/${mediaType}/list`);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch genres' }, { status: 500 });
  }
}
