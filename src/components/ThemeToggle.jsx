import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { setTheme, initTheme } from '../theme';

const ThemeToggle = () => {
  const [theme, setThemeState] = useState('light');

  useEffect(() => {
    const initial = initTheme();
    setThemeState(initial);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setThemeState(nextTheme);
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group relative flex h-11 w-20 items-center rounded-full bg-white/10 p-1 backdrop-blur-xl transition hover:scale-[1.02] hover:bg-white/15 hover:shadow-neon-secondary dark:bg-slate-900/70 dark:hover:bg-slate-900/80 border border-fuchsia-500/40"
    >
      <span
        className={`absolute inset-1 rounded-full bg-gradient-to-r from-fuchsia-500/40 via-sky-500/30 to-cyan-400/30 blur-xl transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-60'}`}
      />
      <span
        className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/70 text-amber-200 shadow-neon-secondary transition-all duration-300 ${
          isDark ? 'translate-x-9 bg-slate-800 text-cyan-200' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <MoonIcon className="h-5 w-5 animate-pulse drop-shadow-[0_0_12px_rgba(14,165,233,0.8)]" />
        ) : (
          <SunIcon className="h-6 w-6 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
        )}
      </span>
      <div className="relative z-0 flex w-full justify-between px-2 text-[10px] font-semibold uppercase tracking-widest">
        <span className={`${!isDark ? 'text-amber-200' : 'text-white/50'}`}>Light</span>
        <span className={`${isDark ? 'text-cyan-200' : 'text-white/50'}`}>Dark</span>
      </div>
    </button>
  );
};

export default ThemeToggle;
