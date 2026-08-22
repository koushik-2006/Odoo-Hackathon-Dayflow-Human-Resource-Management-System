import React from 'react';

export default function Card({
  children,
  className = '',
  hoverable = false,
  glass = true,
  ...props
}) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        glass ? 'glass-card' : 'bg-slate-900 border-slate-800'
      } ${hoverable ? 'glass-card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`p-6 border-b border-slate-800/80 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-bold text-slate-100 tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-xs text-slate-400 mt-1 leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-6 border-t border-slate-800/80 bg-slate-900/30 rounded-b-2xl ${className}`}>
      {children}
    </div>
  );
}
