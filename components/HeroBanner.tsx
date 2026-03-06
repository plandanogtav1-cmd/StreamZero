'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Star } from 'lucide-react';
import { backdropUrl } from '@/lib/tmdb';
import { Button } from './ui/button';

interface HeroItem {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  overview: string;
  backdropPath?: string | null;
  rating?: number;
  year?: string;
  runtime?: string;
}

interface HeroBannerProps {
  items: HeroItem[];
}

export function HeroBanner({ items }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  if (!items || items.length === 0) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-surface"><p className="text-textMuted">Loading...</p></div>;
  }

  const item = items[current];
  const watchHref = item.mediaType === 'movie'
    ? `/watch/movie/${item.tmdbId}`
    : `/watch/tv/${item.tmdbId}/season/1/episode/1`;
  const detailHref = `/${item.mediaType}/${item.tmdbId}`;

  const next = () => { setDirection(1); setCurrent((c) => (c + 1) % items.length); };
  const prev = () => { setDirection(-1); setCurrent((c) => (c - 1 + items.length) % items.length); };

  useEffect(() => {
    timerRef.current = setInterval(next, 7000);
    return () => clearInterval(timerRef.current);
  }, [items.length]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 7000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 100) {
      if (diff > 0) prev(); else next();
      setIsDragging(false);
      resetTimer();
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      className="relative w-full select-none"
      style={{ minHeight: 'min(85vh, 700px)' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        {item.backdropPath ? (
          <Image
            key={item.tmdbId}
            src={backdropUrl(item.backdropPath)}
            alt={item.title}
            fill
            priority
            className="object-cover object-center animate-in fade-in zoom-in-105 duration-700"
            onLoad={() => setImgLoaded(true)}
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-surface" />
        )}
        <div className="absolute inset-0 bg-grad-hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-end min-h-[min(85vh,700px)] pb-12 md:pb-16 px-4 md:px-16">
        <div key={current} className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {item.mediaType === 'tv' && (
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/20">
                TV Series
              </span>
            )}
            {item.rating && item.rating > 0 && (
              <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">
                <Star className="w-3 h-3 fill-current" />
                {item.rating.toFixed(1)}
              </span>
            )}
            {item.year && (
              <span className="text-xs text-textMuted px-2 py-0.5 rounded bg-white/5 border border-white/10">
                {item.year}
              </span>
            )}
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-textPrimary leading-tight mb-4 drop-shadow-lg">
            {item.title}
          </h1>

          <p className="text-textMuted text-sm md:text-base leading-relaxed line-clamp-3 mb-8 max-w-xl">
            {item.overview}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <Button asChild size="lg" className="gap-2 font-bold shadow-neon-cyan">
              <Link href={watchHref}>
                <Play className="w-5 h-5 fill-current" />
                Play Now
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href={detailHref}>
                <Info className="w-5 h-5" />
                More Info
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {items.length > 1 && (
        <div className="absolute bottom-24 right-4 md:right-16 z-20 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); resetTimer(); }}
              className={`w-2 h-2 rounded-full transition ${i === current ? 'bg-primary w-8' : 'bg-white/40 hover:bg-white/60'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
