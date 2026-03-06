'use client';

import { useState, useEffect } from 'react';
import { MediaCard } from '@/components/MediaCard';
import { yearFromDate } from '@/lib/tmdb';

const GENRES = {
  movie: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 18, name: 'Drama' },
    { id: 14, name: 'Fantasy' },
    { id: 27, name: 'Horror' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Sci-Fi' },
    { id: 53, name: 'Thriller' },
  ],
  tv: [
    { id: 10759, name: 'Action & Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 9648, name: 'Mystery' },
  ],
};

export default function BrowsePage() {
  const [category, setCategory] = useState<'movie' | 'tv' | 'anime'>('movie');
  const [genre, setGenre] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        let url = '/api/tmdb/discover?';
        if (category === 'anime') {
          url += 'mediaType=tv&genreId=16&language=ja';
        } else {
          url += `mediaType=${category}`;
          if (genre) url += `&genreId=${genre}`;
        }
        url += `&page=${page}`;
        const res = await fetch(url);
        const data = await res.json();
        if (page === 1) {
          setItems(data.results || []);
        } else {
          setItems(prev => [...prev, ...(data.results || [])]);
        }
        setHasMore(data.page < data.total_pages);
      } catch (error) {
        console.error('Failed to fetch:', error);
        if (page === 1) setItems([]);
      }
      setLoading(false);
    };
    fetchContent();
  }, [category, genre, page]);

  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [category, genre]);

  const currentGenres = category === 'anime' ? [] : GENRES[category];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8">
      <h1 className="text-3xl md:text-4xl font-black font-heading text-textPrimary mb-8">
        Browse Content
      </h1>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6">
        {['movie', 'tv', 'anime'].map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat as any); setGenre(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              category === cat
                ? 'bg-primary text-bg'
                : 'bg-surface text-textMuted hover:text-textPrimary'
            }`}
          >
            {cat === 'movie' ? 'Movies' : cat === 'tv' ? 'TV Shows' : 'Anime'}
          </button>
        ))}
      </div>

      {/* Genre Filters */}
      {currentGenres.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setGenre(null)}
            className={`px-4 py-1.5 rounded-full text-sm transition ${
              genre === null
                ? 'bg-primary/20 text-primary border border-primary'
                : 'bg-surface/50 text-textMuted hover:text-textPrimary'
            }`}
          >
            All
          </button>
          {currentGenres.map((g) => (
            <button
              key={g.id}
              onClick={() => setGenre(g.id)}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                genre === g.id
                  ? 'bg-primary/20 text-primary border border-primary'
                  : 'bg-surface/50 text-textMuted hover:text-textPrimary'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      {/* Content Grid */}
      {loading && page === 1 ? (
        <div className="text-center py-20 text-textMuted">Loading...</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
            {items.map((item) => (
              <MediaCard
                key={item.id}
                tmdbId={item.id}
                mediaType={category === 'anime' ? 'tv' : category}
                title={item.title || item.name}
                posterPath={item.poster_path}
                rating={item.vote_average}
                year={yearFromDate(item.release_date || item.first_air_date)}
                overview={item.overview}
              />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-primary text-bg font-medium hover:bg-primary/90 disabled:opacity-50 transition"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
