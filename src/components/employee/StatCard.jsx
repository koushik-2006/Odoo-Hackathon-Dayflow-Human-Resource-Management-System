import React from 'react';
import BorderGlow from '../ui/BorderGlow';

/**
 * StatCard component for Employee Dashboard statistics display wrapped in BorderGlow.
 */
export default function StatCard({ title, value, subtitle, icon: Icon, badge, color = 'indigo', loading }) {
  if (loading) {
    return (
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800/80 backdrop-blur-xl shadow-lg animate-pulse space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 bg-slate-800 rounded" />
          <div className="h-9 w-9 bg-slate-800 rounded-xl" />
        </div>
        <div className="h-8 w-20 bg-slate-800 rounded" />
        <div className="h-3 w-32 bg-slate-800/60 rounded" />
      </div>
    );
  }

  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      glow: ['#34d399', '#10b981', '#059669'],
    },
    blue: {
      bg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      glow: ['#60a5fa', '#3b82f6', '#2563eb'],
    },
    purple: {
      bg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      glow: ['#c084fc', '#a855f7', '#7e22ce'],
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      glow: ['#fbbf24', '#f59e0b', '#d97706'],
    },
    indigo: {
      bg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
      badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      glow: ['#818cf8', '#6366f1', '#4338ca'],
    },
  }[color] || {
    bg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    glow: ['#818cf8', '#6366f1', '#4338ca'],
  };

  return (
    <BorderGlow
      borderRadius={20}
      backgroundColor="rgba(15, 23, 42, 0.9)"
      glowColor="250 85 80"
      colors={colorStyles.glow}
      glowRadius={30}
      edgeSensitivity={20}
      className="w-full shadow-xl"
    >
      <div className="p-5 space-y-3 group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
          {Icon && (
            <div className={`p-2.5 rounded-xl ${colorStyles.bg} group-hover:scale-110 transition-transform`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div className="text-3xl font-extrabold tracking-tight text-white">{value}</div>
          {badge && (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${colorStyles.badge}`}>
              {badge}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-slate-400 font-medium line-clamp-1">{subtitle}</p>
        )}
      </div>
    </BorderGlow>
  );
}
