const THEME_KEY = 'cnx-theme';

export const initTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(THEME_KEY);
  const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const initial = stored || (systemPrefersDark ? 'dark' : 'light');
  setTheme(initial);
  return initial;
};

export const setTheme = (theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem(THEME_KEY, theme);
};
