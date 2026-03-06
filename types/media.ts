export interface MediaBase {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  overview: string;
  genres: string[];
  posterPath?: string;
  backdropPath?: string;
  rating?: number;
  year?: number;
  runtime?: number;
  seasons?: number;
  episodes?: number;
}

export interface WatchlistItem extends MediaBase {
  addedAt: string;
  id?: number;
}

export interface WatchProgress {
  id?: number;
  userId?: string;
  mediaType: 'movie' | 'tv';
  tmdbId: number;
  season?: number;
  episode?: number;
  durationSeconds?: number;
  currentSeconds?: number;
  progressPercent?: number;
  lastEvent?: string;
  lastSeenAt: string;
  title?: string;
  posterPath?: string;
  backdropPath?: string;
}

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number;
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
  media_type?: 'movie';
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
  seasons?: TMDBSeason[];
  media_type?: 'tv';
}

export interface TMDBSeason {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  episode_count: number;
  episodes?: TMDBEpisode[];
}

export interface TMDBEpisode {
  id: number;
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime: number;
  vote_average: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export type TMDBMedia = TMDBMovie | TMDBTVShow;

export interface PlayerEventData {
  event: 'timeupdate' | 'play' | 'pause' | 'ended' | 'seeked';
  currentTime: number;
  duration: number;
  progress: number;
  id: string;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
  timestamp: number;
}

export interface PlayerEvent {
  type: 'PLAYER_EVENT';
  data: PlayerEventData;
}
