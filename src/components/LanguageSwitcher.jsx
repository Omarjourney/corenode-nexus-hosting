import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
];

const neonBorder = 'border border-cyan-500/40 shadow-neon-primary';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [current, setCurrent] = useState(i18n.language);

  const handleChange = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('cnx-language', lng);
    setCurrent(lng);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className={`group flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold uppercase text-white backdrop-blur-md transition hover:scale-[1.02] hover:bg-white/15 hover:shadow-neon-primary dark:bg-slate-900/60 dark:hover:bg-slate-900/80 ${neonBorder}`}
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/70 via-sky-500/60 to-blue-500/50 p-[2px] shadow-neon-primary">
          <span className="flex h-full w-full items-center justify-center rounded-full bg-slate-900/80 text-sky-200 group-hover:animate-spin-slow">
            <GlobeAltIcon className="h-5 w-5 drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]" />
          </span>
        </span>
        <div className="text-left">
          <p className="text-[10px] font-medium uppercase tracking-widest text-cyan-200">{t('language.label')}</p>
          <p className="text-sm font-semibold text-white drop-shadow-sm">{current.toUpperCase()}</p>
        </div>
        <ChevronDownIcon className="h-4 w-4 text-cyan-200 transition group-hover:translate-y-[1px]" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="transform opacity-0 translate-y-2"
        enterTo="transform opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="transform opacity-100 translate-y-0"
        leaveTo="transform opacity-0 translate-y-2"
      >
        <Menu.Items className={`absolute right-0 mt-3 w-48 origin-top-right overflow-hidden rounded-2xl bg-white/15 p-2 backdrop-blur-xl ring-1 ring-white/20 dark:bg-slate-900/80 ${neonBorder}`}>
          <div className="px-3 pb-2 pt-1 text-xs uppercase tracking-[0.2em] text-cyan-200/80">
            {t('language.description')}
          </div>
          {languages.map(({ code, label }) => (
            <Menu.Item key={code}>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => handleChange(code)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold uppercase tracking-wide text-white transition ${
                    active || current === code
                      ? 'bg-cyan-500/20 text-cyan-100 shadow-neon-primary'
                      : 'hover:bg-white/10 text-slate-100'
                  }`}
                >
                  <span>{label}</span>
                  {current === code && (
                    <span className="text-[10px] text-cyan-200">Active</span>
                  )}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LanguageSwitcher;
