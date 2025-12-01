'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const current = theme === 'system' ? systemTheme : theme;
  const isDark = current === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300/60 bg-white/70 text-[11px] text-slate-700 shadow-sm backdrop-blur hover:border-slate-400 hover:bg-white dark:border-slate-600/70 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-slate-400"
      aria-label="Toggle theme"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
