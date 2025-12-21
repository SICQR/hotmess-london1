/**
 * Reusable loading skeleton components
 * Improves perceived performance while data loads
 */

export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 animate-pulse"
        >
          <div className="h-6 w-1/3 bg-white/10 rounded mb-4" />
          <div className="h-4 w-2/3 bg-white/10 rounded mb-2" />
          <div className="h-4 w-1/2 bg-white/10 rounded" />
        </div>
      ))}
    </>
  );
}

export function ListItemSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-white/5 rounded-xl animate-pulse"
        >
          <div className="size-12 bg-white/10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-white/10 rounded" />
            <div className="h-3 w-1/2 bg-white/10 rounded" />
          </div>
          <div className="h-8 w-20 bg-white/10 rounded" />
        </div>
      ))}
    </>
  );
}

export function StatCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 animate-pulse"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="size-6 bg-white/10 rounded" />
          </div>
          <div className="h-8 w-20 bg-white/10 rounded mb-2" />
          <div className="h-3 w-24 bg-white/10 rounded" />
        </div>
      ))}
    </>
  );
}

export function TableRowSkeleton({ count = 5, columns = 4 }: { count?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-white/10 animate-pulse">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="flex-1 h-4 bg-white/10 rounded" />
          ))}
        </div>
      ))}
    </>
  );
}

export function ImageGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="aspect-square bg-white/5 rounded-3xl animate-pulse"
        />
      ))}
    </>
  );
}
