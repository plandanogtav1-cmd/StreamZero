import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get('mediaType') || 'all';
  const window = searchParams.get('window') || 'day';

  try {
    const data = await tmdbFetch(`/trending/${mediaType}/${window}`);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch trending' }, { status: 500 });
  }
}
