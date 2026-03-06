import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string; s: string } }
) {
  try {
    const data = await tmdbFetch(`/tv/${params.id}/season/${params.s}`);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Season not found' }, { status: 404 });
  }
}
