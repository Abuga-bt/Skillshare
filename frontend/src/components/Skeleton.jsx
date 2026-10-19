export function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="w-11 h-11 rounded-full bg-stone-100" />
        <div className="w-16 h-5 rounded-full bg-stone-100" />
      </div>
      <div className="h-5 bg-stone-100 rounded w-3/4 mb-2" />
      <div className="h-4 bg-stone-50 rounded w-full mb-1" />
      <div className="h-4 bg-stone-50 rounded w-2/3 mb-4" />
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-stone-100" />
        <div className="h-4 bg-stone-50 rounded w-24" />
      </div>
      <div className="h-10 bg-stone-50 rounded-xl" />
    </div>
  );
}

export function SkeletonList({ rows = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card p-5 animate-pulse">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-stone-100 rounded w-1/3" />
              <div className="h-3 bg-stone-50 rounded w-1/2" />
              <div className="h-3 bg-stone-50 rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonChat() {
  return (
    <div className="grid md:grid-cols-3 gap-4 h-[420px]">
      <div className="card p-3 space-y-3 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-stone-100" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-stone-100 rounded w-1/2" />
              <div className="h-3 bg-stone-50 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
      <div className="card md:col-span-2 animate-pulse flex items-center justify-center">
        <div className="h-4 bg-stone-100 rounded w-32" />
      </div>
    </div>
  );
}
