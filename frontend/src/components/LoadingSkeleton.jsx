const shimmer =
  'relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 dark:from-slate-900 dark:via-emerald-900/40 dark:to-slate-900';

const LoadingSkeleton = ({ className = '' }) => {
  return (
    <div className={`${shimmer} ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-60 dark:via-emerald-100/10" />
    </div>
  );
};

export const ProductSkeletonGrid = () => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="space-y-3 rounded-2xl border border-amber-100/70 bg-white/80 p-4 dark:border-emerald-900/60 dark:bg-slate-950/80"
      >
        <LoadingSkeleton className="aspect-[4/3] rounded-2xl" />
        <LoadingSkeleton className="h-4 w-3/5" />
        <LoadingSkeleton className="h-3 w-4/5" />
        <div className="flex items-center justify-between pt-1">
          <LoadingSkeleton className="h-4 w-16" />
          <LoadingSkeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;

