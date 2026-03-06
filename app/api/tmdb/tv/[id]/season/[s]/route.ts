import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; s: string }> }
) {
  const { id, s } = await params;
  try {
    const data = await tmdbFetch(`/tv/${id}/season/${s}`);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Season not found' }, { status: 404 });
  }
}
