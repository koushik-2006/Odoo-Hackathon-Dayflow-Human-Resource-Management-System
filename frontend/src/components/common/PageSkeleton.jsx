import React from 'react';

export default function PageSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-28 w-full bg-slate-900/80 rounded-2xl border border-slate-800/80 backdrop-blur-xl p-6 flex flex-col justify-center space-y-3">
        <div className="h-6 w-48 bg-slate-800 rounded-lg" />
        <div className="h-4 w-72 bg-slate-800/60 rounded-lg" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-900/80 rounded-2xl border border-slate-800/80 p-5 space-y-3">
            <div className="h-4 w-24 bg-slate-800 rounded" />
            <div className="h-8 w-16 bg-slate-800 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="h-72 w-full bg-slate-900/80 rounded-2xl border border-slate-800/80 p-6 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading Dayflow workspace...</span>
        </div>
      </div>
    </div>
  );
}
