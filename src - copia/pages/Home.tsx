
import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col">
      <section className="relative h-[700px] flex items-center bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2000&auto=format&fit=crop" 
            alt="Financial Analysis Background" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-block bg-blue-600/20 text-blue-400 text-xs font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-6 border border-blue-500/30">
              {t('home.realEstateIntelligence')}
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tighter">
              {t('home.analysisTitle')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                {t('home.frictionless')}
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">
              {t('home.heroDescription')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/apply" 
                className="inline-flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-2xl shadow-blue-500/20 hover:-translate-y-1 active:scale-95"
              >
                <span>{t('home.startAnalysis')}</span>
                <ArrowRight size={22} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            <div className="group">
              <div className="w-20 h-20 bg-slate-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-200">
                <Calculator size={36} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">{t('home.preciseCalculation')}</h3>
              <p className="text-slate-500 leading-relaxed">{t('home.preciseDescription')}</p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-slate-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-200">
                <ShieldCheck size={36} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">{t('home.totalPrivacy')}</h3>
              <p className="text-slate-500 leading-relaxed">{t('home.privacyDescription')}</p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-slate-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-200">
                <TrendingUp size={36} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">{t('home.optimization')}</h3>
              <p className="text-slate-500 leading-relaxed">{t('home.optimizationDescription')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
