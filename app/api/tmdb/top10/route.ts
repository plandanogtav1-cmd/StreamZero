import { NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET() {
  try {
    const data = await tmdbFetch<{ results: unknown[] }>('/trending/all/day');
    const top10 = (data.results || []).slice(0, 10).map((item: any, index: number) => ({
      ...item,
      rank: index + 1,
    }));
    return NextResponse.json({ results: top10 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch top 10' }, { status: 500 });
  }
}
