"use client";

export function MatchdaySkeleton() {
  return (
    <div
      className="animate-pulse space-y-8"
      aria-busy="true"
      aria-label="Loading matchday data"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-white/5 bg-white/5"
          />
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-[5/3] max-h-[420px] rounded-3xl border border-white/10 bg-white/5" />
        <div className="h-80 rounded-2xl border border-white/10 bg-white/5" />
      </div>
      <div className="h-72 rounded-2xl border border-white/10 bg-white/5" />
    </div>
  );
}
