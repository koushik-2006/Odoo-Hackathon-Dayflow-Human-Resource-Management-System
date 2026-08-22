import React from 'react';

/**
 * StatCard component for Employee Dashboard statistics display.
 */
export default function StatCard({ title, value, subtitle, icon: Icon, badge, color = 'indigo', loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 bg-slate-200 rounded" />
          <div className="h-9 w-9 bg-slate-200 rounded-xl" />
        </div>
        <div className="h-8 w-20 bg-slate-200 rounded" />
        <div className="h-3 w-32 bg-slate-100 rounded" />
      </div>
    );
  }

  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    indigo: {
      bg: 'bg-indigo-50 text-indigo-600',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
  }[color] || {
    bg: 'bg-indigo-50 text-indigo-600',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${colorStyles.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</div>
        {badge && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${colorStyles.badge}`}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
    </div>
  );
}
