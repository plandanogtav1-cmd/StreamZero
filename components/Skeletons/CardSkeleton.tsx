export function CardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden flex-shrink-0 w-[160px] sm:w-[180px]">
      <div className="skeleton aspect-[2/3] w-full rounded-xl" />
      <div className="mt-2 space-y-1.5 px-0.5">
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="skeleton h-3 w-2/5 rounded" />
      </div>
    </div>
  );
}

export function RowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div>
      <div className="skeleton h-6 w-48 rounded mb-4" />
      <div className="flex gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div className="relative w-full aspect-video max-h-[85vh] skeleton">
      <div className="absolute bottom-12 left-8 md:left-16 space-y-4">
        <div className="skeleton h-10 w-64 rounded" />
        <div className="skeleton h-4 w-96 rounded" />
        <div className="skeleton h-4 w-80 rounded" />
        <div className="flex gap-3 mt-4">
          <div className="skeleton h-10 w-28 rounded-lg" />
          <div className="skeleton h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="skeleton w-full h-[50vh]" />
      <div className="container mx-auto px-4 md:px-8 py-8 space-y-6">
        <div className="flex gap-6">
          <div className="skeleton w-[150px] h-[225px] rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-8 w-72 rounded" />
            <div className="skeleton h-4 w-48 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
            <div className="skeleton h-4 w-4/6 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
