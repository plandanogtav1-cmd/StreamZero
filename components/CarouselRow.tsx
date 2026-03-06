'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselRowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleHref?: string;
}

export function CarouselRow({ title, children, className, titleHref }: CarouselRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') scroll('left');
    if (e.key === 'ArrowRight') scroll('right');
  };

  // Drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 2;
    el.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className={cn('group/row relative', className)} aria-label={title}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <h2 className="text-lg md:text-xl font-bold text-textPrimary font-heading">
          {title}
          <span className="ml-2 inline-block w-8 h-0.5 bg-grad-cta rounded-full align-middle" />
        </h2>
      </div>

      {/* Scroll container */}
      <div className="relative">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-full flex items-center justify-center bg-gradient-to-r from-bg to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <div className="glass rounded-full p-2 shadow-lg">
              <ChevronLeft className="w-5 h-5 text-textPrimary" />
            </div>
          </button>
        )}

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-full flex items-center justify-center bg-gradient-to-l from-bg to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <div className="glass rounded-full p-2 shadow-lg">
              <ChevronRight className="w-5 h-5 text-textPrimary" />
            </div>
          </button>
        )}

        <div
          ref={scrollRef}
          className={cn(
            'carousel-container pl-4 md:pl-8 pr-4',
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          )}
          onScroll={updateScrollState}
          onKeyDown={handleKeyDown}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          tabIndex={0}
          role="list"
          aria-label={`${title} carousel`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
