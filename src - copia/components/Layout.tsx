
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Home, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { language, toggleLanguage, t } = useLanguage();

  // URL of the logo provided by the user
  const logoUrl = "/steplogo2.webp";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-950/95 backdrop-blur-md text-white shadow-2xl sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <div className="h-10 flex items-center transition-transform group-hover:scale-105">
              <img
                src={logoUrl}
                alt="Step Real Estate"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="hidden md:flex flex-col border-l border-white/20 ml-6 pl-6">
              <span className="text-sm font-black tracking-[0.2em] uppercase text-blue-400">{t('header.lendingDivision')}</span>
              <span className="text-[10px] text-white/60 font-medium tracking-[0.1em] uppercase">{t('header.financialIntelligence')}</span>
            </div>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-xs font-black tracking-widest hover:text-blue-400 transition-colors flex items-center space-x-2">
              <Home size={14} />
              <span className="hidden sm:inline">{t('header.home')}</span>
            </Link>
            <Link to="/apply" className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all shadow-lg shadow-blue-500/20 active:scale-95 border border-blue-400/30">
              {t('header.analyzeNow')}
            </Link>
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-xs font-black tracking-widest hover:text-blue-400 transition-colors uppercase"
            >
              <Globe size={14} />
              <span>{language === 'es' ? 'EN' : 'ES'}</span>
            </button>
            <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block"></div>
            <Link to="/admin/login" className="text-slate-400 hover:text-white transition-colors flex items-center space-x-2">
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline text-xs font-black tracking-widest">{t('header.portal')}</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 border-t border-white/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center">
            <img
              src={logoUrl}
              alt="Step Real Estate"
              className="h-12 w-auto object-contain opacity-40 brightness-0 invert hover:opacity-100 transition-all duration-500"
            />
          </div>
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{t('header.realEstate')}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">{t('header.lending')}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{t('header.analytics')}</div>
          </div>
          <p className="text-slate-500 text-xs font-medium">
            &copy; {new Date().getFullYear()} {t('header.rightsReserved')}
          </p>
          <div className="mt-6 inline-block bg-white/5 px-6 py-2 rounded-full border border-white/5">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
              {t('header.systemDescription')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
