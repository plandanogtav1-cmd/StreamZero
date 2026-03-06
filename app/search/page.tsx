'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { MediaCard } from '@/components/MediaCard';
import { yearFromDate } from '@/lib/tmdb';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q || q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/tmdb/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => {
        setResults((data.results || []).filter((r: any) =>
          (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path
        ));
      })
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold font-heading text-textPrimary">
              {q ? `Results for "${q}"` : 'Search'}
            </h1>
          </div>
          {!loading && results.length > 0 && (
            <p className="text-textMuted text-sm">{results.length} titles found</p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton aspect-[2/3] rounded-xl" />
                <div className="skeleton h-3 w-3/4 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {results.map((item: any) => (
              <MediaCard
                key={`${item.media_type}-${item.id}`}
                tmdbId={item.id}
                mediaType={item.media_type}
                title={item.title || item.name}
                posterPath={item.poster_path}
                rating={item.vote_average}
                year={yearFromDate(item.release_date || item.first_air_date)}
                overview={item.overview}
                className="w-full"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && q && results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 opacity-30">🎬</div>
            <h2 className="text-xl font-bold text-textPrimary mb-2">No results found</h2>
            <p className="text-textMuted">Try a different search term</p>
          </div>
        )}

        {!q && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 opacity-30">🔍</div>
            <h2 className="text-xl font-bold text-textPrimary mb-2">Search for movies & shows</h2>
            <p className="text-textMuted">Type in the search bar above to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
