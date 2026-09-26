import React from 'react';
import Card from '../ui/Card';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  color = 'indigo',
}) {
  const iconColors = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  };

  return (
    <Card hoverable glass className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div
            className={`p-3.5 rounded-2xl border ${
              iconColors[color] || iconColors.indigo
            } shadow-inner`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {trend && (
            <span
              className={`font-semibold flex items-center gap-1 ${
                trend > 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
          {trendLabel && <span className="text-slate-400">{trendLabel}</span>}
          {subtitle && !trend && <span className="text-slate-400">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
}
