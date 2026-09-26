import React from 'react';

export default function Table({ children, className = '' }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-900/40">
      <table className={`w-full text-left text-sm text-slate-300 ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = '' }) {
  return (
    <thead className={`bg-slate-900/80 text-xs uppercase text-slate-400 font-semibold tracking-wider border-b border-slate-800 ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '' }) {
  return (
    <tbody className={`divide-y divide-slate-800/60 ${className}`}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '', hover = true }) {
  return (
    <tr
      className={`transition-colors ${
        hover ? 'hover:bg-slate-800/40' : ''
      } ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }) {
  return <th className={`px-5 py-3.5 ${className}`}>{children}</th>;
}

export function TableCell({ children, className = '' }) {
  return <td className={`px-5 py-4 ${className}`}>{children}</td>;
}
