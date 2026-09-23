import React from 'react';
import { CheckCircle2, Clock, FileText, CreditCard, Bell } from 'lucide-react';

/**
 * ActivityItem component for displaying employee recent activity log entry.
 */
export default function ActivityItem({ activity }) {
  const { title, description, timestamp, time, type } = activity;

  // Icon mapping
  const getIcon = () => {
    switch (type) {
      case 'leave':
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'attendance':
      case 'info':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'profile':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'salary':
      case 'finance':
        return <CreditCard className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/50 space-y-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white shadow-sm border border-slate-100">
            {getIcon()}
          </div>
          <span className="text-sm font-semibold text-slate-900">{title}</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">{timestamp || time}</span>
      </div>
      {description && <p className="text-xs text-slate-600 pl-7">{description}</p>}
    </div>
  );
}
