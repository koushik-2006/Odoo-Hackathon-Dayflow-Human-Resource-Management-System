import React from 'react';

export default function StatCard({ title, value, icon: Icon, description, trend, trendType }) {
  // trendType: 'up' (green), 'down' (red), 'info' (indigo/blue)
  const getTrendBadge = () => {
    if (trendType === 'up') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (trendType === 'down') return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800/80 backdrop-blur-xl shadow-xl hover:border-indigo-500/40 transition-all duration-300 space-y-3 group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-3xl font-extrabold tracking-tight text-white">{value}</div>
        {trend && (
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getTrendBadge()}`}>
            {trend}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-slate-400 font-medium line-clamp-1">{description}</p>
      )}
    </div>
  );
}
