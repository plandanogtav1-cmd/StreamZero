const BASE = process.env.NEXT_PUBLIC_VIDKING_BASE || 'https://www.vidking.net';
const DEFAULT_COLOR = process.env.NEXT_PUBLIC_VIDKING_COLOR || '22d3ee';

interface MovieOpts {
  color?: string;
  autoPlay?: boolean;
  progress?: number;
}

interface TvOpts extends MovieOpts {
  nextEpisode?: boolean;
  episodeSelector?: boolean;
}

export function buildMovieUrl(tmdbId: number, opts: MovieOpts = {}): string {
  const {
    color = DEFAULT_COLOR,
    autoPlay = true,
    progress,
  } = opts;

  const url = new URL(`${BASE}/embed/movie/${tmdbId}`);
  url.searchParams.set('color', color.replace('#', ''));
  url.searchParams.set('autoPlay', String(autoPlay));
  if (progress !== undefined && progress > 0) {
    url.searchParams.set('progress', String(Math.floor(progress)));
  }

  return url.toString();
}

export function buildTvUrl(
  tmdbId: number,
  season: number,
  episode: number,
  opts: TvOpts = {}
): string {
  const {
    color = DEFAULT_COLOR,
    autoPlay = true,
    nextEpisode = true,
    episodeSelector = true,
    progress,
  } = opts;

  const url = new URL(`${BASE}/embed/tv/${tmdbId}/${season}/${episode}`);
  url.searchParams.set('color', color.replace('#', ''));
  url.searchParams.set('autoPlay', String(autoPlay));
  url.searchParams.set('nextEpisode', String(nextEpisode));
  url.searchParams.set('episodeSelector', String(episodeSelector));
  if (progress !== undefined && progress > 0) {
    url.searchParams.set('progress', String(Math.floor(progress)));
  }

  return url.toString();
}
