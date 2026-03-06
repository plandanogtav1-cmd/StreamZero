'use client';

interface PlayerFrameProps {
  src: string;
  title: string;
  backdropPath?: string | null;
}

export function PlayerFrame({ src, title }: PlayerFrameProps) {
  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-primary/20 shadow-[0_0_40px_rgba(34,211,238,0.25)]">
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        frameBorder="0"
        scrolling="no"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
