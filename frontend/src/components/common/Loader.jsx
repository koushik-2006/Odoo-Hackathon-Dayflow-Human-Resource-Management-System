import React from 'react';

export default function Loader({ fullScreen = false, text = 'Loading...' }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <div className="absolute w-10 h-10 rounded-full border-4 border-purple-500/20 border-b-purple-500 animate-spin-reverse" />
        </div>
        {text && (
          <p className="mt-4 text-sm font-medium text-slate-300 animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-3">
      <div className="w-10 h-10 rounded-full border-3 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      {text && <p className="text-xs font-medium text-slate-400">{text}</p>}
    </div>
  );
}
