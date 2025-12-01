'use client';

import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1 text-sm">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-slate-600 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={clsx(
          'w-full rounded-xl border bg-white/80 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 dark:bg-slate-900/70 dark:text-slate-50',
          'border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:focus:border-primary',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
          className
        )}
        {...props}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
