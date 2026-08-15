interface LoadingSkeletonProps {
  type?: "product" | "category" | "text" | "table";
  count?: number;
}

export default function LoadingSkeleton({
  type = "product",
  count = 1,
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  if (type === "product") {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <div className="aspect-square animate-pulse bg-slate-200" />

            <div className="space-y-3 p-4">
              <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "category") {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <div className="aspect-[4/3] animate-pulse bg-slate-200" />

            <div className="space-y-3 p-4">
              <div className="h-5 w-3/5 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {items.map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse items-center gap-4 border-b border-slate-100 p-4 last:border-b-0"
          >
            <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-slate-200" />
              <div className="h-3 w-1/5 rounded bg-slate-200" />
            </div>
            <div className="h-8 w-20 rounded-lg bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((_, index) => (
        <div
          key={index}
          className="h-4 animate-pulse rounded bg-slate-200"
        />
      ))}
    </div>
  );
}