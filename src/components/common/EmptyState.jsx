import React from 'react';
import { Inbox } from 'lucide-react';
import Button from '../ui/Button';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data available',
  description = 'There are currently no items to display.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass-card rounded-2xl my-4">
      <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-100">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
