import { Link } from 'react-router-dom';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { useTranslation } from 'react-i18next';

const navItems = ['home', 'features', 'pricing', 'docs', 'contact'];

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-cyan-500/5 px-4 py-3 shadow-glass dark:border-white/5 dark:from-slate-900/60 dark:via-slate-900/70 dark:to-cyan-900/30">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/60 via-sky-500/60 to-fuchsia-500/60 shadow-neon-primary">
            <SparklesIcon className="h-7 w-7 text-white drop-shadow-[0_0_14px_rgba(59,130,246,0.8)]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">{t('brand')}</p>
            <p className="text-lg font-semibold text-white drop-shadow-sm">Nexus Hosting</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-neon-primary backdrop-blur-xl dark:bg-slate-900/50 md:flex">
          {navItems.map((item) => (
            <Link
              key={item}
              to={`/${item === 'home' ? '' : item}`}
              className="relative px-2 py-1 text-white transition hover:text-cyan-200"
            >
              <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              {t(`nav.${item}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link
            to="/console"
            className="hidden items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-50 shadow-neon-primary transition hover:-translate-y-0.5 hover:bg-cyan-500/30 md:flex"
          >
            {t('actions.launch')}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
