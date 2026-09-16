import React, { useState, useEffect } from 'react';
import { ArrowUp, Sparkles, Sliders, ShieldCheck, Smartphone } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { soundManager } from '../../utils/audio';
import { InstallAppModal } from '../ui/InstallAppModal';

export const Footer: React.FC = () => {
  const { data, openAdmin } = usePortfolio();
  const { footer } = data;
  const [time, setTime] = useState('');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-md pt-12 pb-28 sm:pb-24 px-4 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand & Local Time */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-slate-900 dark:bg-black rounded-[7px] flex items-center justify-center font-bold text-xs text-white">
              {footer.brandText || 'AV'}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white font-display">
              {data.hero.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>
                {footer.timezoneCity || 'Local'} Time: {time || 'Loading...'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: System Status */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{footer.statusText || 'Systems Normal'}</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setIsInstallModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 transition-all font-semibold"
            title="Install on iOS or Android"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install App (iOS & Android)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playSuccess();
              openAdmin();
            }}
            className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors font-semibold"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Edit Sections (CMS)</span>
          </button>
        </div>

        {/* Right: Back to top */}
        <button
          onClick={scrollToTop}
          onMouseEnter={() => soundManager.playHover()}
          className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors flex items-center gap-2 text-xs shadow-sm"
          title="Back to top"
        >
          <span>Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>
          © {new Date().getFullYear()} {data.hero.name}. {footer.copyrightText}
        </p>
        <p className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-500 dark:text-purple-400" />
          <span>{footer.creditText}</span>
        </p>
      </div>

      {/* Direct Mobile App Installation Modal (iOS & Android) */}
      <InstallAppModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />
    </footer>
  );
};
