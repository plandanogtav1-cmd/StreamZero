'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    if (debounced.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(debounced.trim())}`);
    }
  }, [debounced, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative" role="search">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
          focused
            ? 'border-primary/50 bg-surface shadow-neon-cyan/30 shadow-md'
            : 'border-white/10 bg-white/5'
        }`}
      >
        <Search className="w-4 h-4 text-textMuted flex-shrink-0" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search movies, shows..."
          className="bg-transparent text-sm text-textPrimary placeholder:text-textMuted outline-none w-32 sm:w-48 md:w-64"
          aria-label="Search"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-textMuted hover:text-textPrimary transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
