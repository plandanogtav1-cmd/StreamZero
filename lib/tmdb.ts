const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

function getHeaders() {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error('TMDB_API_KEY is not set');
  
  // Support both v3 API key and v4 Bearer token
  if (key.startsWith('eyJ')) {
    // v4 Bearer token
    return {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    };
  } else {
    // v3 API key - use query param instead
    return {
      'Content-Type': 'application/json',
    };
  }
}

export async function tmdbFetch<T>(
  path: string,
  params?: Record<string, string>,
  revalidate = 3600
): Promise<T> {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error('TMDB_API_KEY is not set');
  
  const url = new URL(`${TMDB_BASE}${path}`);
  
  // Add api_key param for v3 keys
  if (!key.startsWith('eyJ')) {
    url.searchParams.set('api_key', key);
  }
  
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  
  const res = await fetch(url.toString(), {
    headers: getHeaders(),
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`TMDB fetch failed: ${res.status} ${res.statusText} for ${path}`);
  }
  return res.json() as Promise<T>;
}

export function imageUrl(path: string | null | undefined, size: string = 'w500'): string {
  if (!path) return '/placeholder-poster.jpg';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function backdropUrl(path: string | null | undefined): string {
  if (!path) return '/placeholder-backdrop.jpg';
  return `${TMDB_IMAGE_BASE}/original${path}`;
}

export function yearFromDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).getFullYear().toString();
}

export function runtimeToText(min: number | undefined): string {
  if (!min) return '';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
