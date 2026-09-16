import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Clock, FileText, Globe, Mail } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../ui/SocialIcons';
import { soundManager } from '../../utils/audio';

export const TopHeader: React.FC = () => {
  const { data, downloadResumeFile } = usePortfolio();
  const { hero, contact } = data;
  const [currentTime, setCurrentTime] = useState('');

  // Live ticking local clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    soundManager.playClick();
    const cleanId = id.startsWith('#') ? id.slice(1) : id;
    const el = document.getElementById(cleanId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Get initials for stylized monogram
  const initials = hero.name
    ? hero.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'MH';

  const resumeHref = hero.resumeFile || hero.resume?.url || hero.resume?.link || '#resume';

  const adj = hero.avatarAdjustments || {};
  const avatarStyle: React.CSSProperties = {
    transform: `scale(${adj.scale ?? 1}) translate(${adj.offsetX ?? 0}%, ${adj.offsetY ?? 0}%)`,
    filter: `brightness(${(adj.brightness ?? 100) / 100}) contrast(${(adj.contrast ?? 100) / 100}) saturate(${(adj.saturation ?? 100) / 100})`,
    transformOrigin: 'center center',
  };

  // Helper to reliably match platform icons regardless of casing
  const getPlatformIcon = (platform: string) => {
    const p = (platform || '').toLowerCase().trim();
    if (p.includes('github') || p.includes('git')) {
      return <GithubIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
    if (p.includes('linkedin')) {
      return <LinkedinIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
    }
    if (p.includes('twitter') || p.includes('x')) {
      return <TwitterIcon className="w-4 h-4 text-sky-500" />;
    }
    if (p.includes('mail') || p.includes('email')) {
      return <Mail className="w-4 h-4 text-pink-500" />;
    }
    return <Globe className="w-4 h-4 text-indigo-400" />;
  };

  const isElectron = typeof window !== 'undefined' && !!window.electronAPI?.isElectron;

  return (
    <header
      style={{
        paddingTop: isElectron ? '0px' : 'env(safe-area-inset-top, 0px)'
      }}
      className={`fixed ${isElectron ? 'top-9' : 'top-0'} left-0 right-0 z-30 pointer-events-none transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        <div className="flex items-center justify-between gap-1.5 sm:gap-4 pointer-events-auto px-2.5 sm:px-6 py-1.5 sm:py-2.5 rounded-2xl sm:rounded-full bg-white/85 dark:bg-[#090b14]/85 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-lg shadow-slate-200/20 dark:shadow-black/40 min-w-0">
          
          {/* LEFT: Interactive Brand Logo & Name */}
          <div
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-1.5 sm:gap-3 cursor-pointer group select-none min-w-0 shrink"
            title="Scroll to top"
          >
            {/* Monogram Logo Avatar */}
            <div className="relative shrink-0">
              {hero.avatarUrl ? (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden p-[1.5px] bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 group-hover:scale-105 transition-transform duration-300 shadow-md">
                  <img
                    src={hero.avatarUrl}
                    alt={hero.name}
                    style={avatarStyle}
                    decoding="async"
                    width="40"
                    height="40"
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1.5px] group-hover:scale-105 transition-transform duration-300 shadow-md">
                  <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-display font-extrabold text-white text-xs sm:text-sm tracking-wider">
                    {initials}
                  </div>
                </div>
              )}
              {/* Micro Status Dot */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-white dark:border-black" />
              </span>
            </div>

            {/* Name and Subtitle */}
            <div className="flex flex-col min-w-0">
              <span className="font-display font-bold text-xs sm:text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors tracking-tight flex items-center gap-1 sm:gap-1.5 truncate">
                <span className="truncate">{hero.name}</span>
                <Sparkles className="w-3 h-3 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hidden sm:inline" />
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[75px] xs:max-w-[120px] sm:max-w-none">
                {hero.roles?.[0] || 'Software Architect'}
              </span>
            </div>
          </div>

          {/* CENTER: Live Availability Beacon & Timezone (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs">
            {/* Availability Dot */}
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {hero.status ? 'AVAILABLE' : 'ACTIVE'}
              </span>
            </div>

            <span className="w-[1px] h-3 bg-slate-300 dark:bg-white/15" />

            {/* Location */}
            {hero.location && (
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[140px]">{hero.location.split('(')[0]}</span>
              </div>
            )}

            <span className="w-[1px] h-3 bg-slate-300 dark:bg-white/15" />

            {/* Live Clock */}
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <Clock className="w-3 h-3 text-purple-500" />
              <span>{currentTime}</span>
            </div>
          </div>

          {/* RIGHT: Explicit Link Pills with Icons & Labels (No 'Let's Talk') */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Social Links with Clear Icons & Labels */}
            {contact.socials?.map((social, idx) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className={`items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white border border-slate-200/90 dark:border-white/10 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm shrink-0 ${
                  idx === 0 ? 'hidden xs:flex' : 'hidden sm:flex'
                }`}
                title={`Open ${social.platform}`}
              >
                {getPlatformIcon(social.platform)}
                <span className="hidden sm:inline text-[11px]">{social.platform}</span>
              </a>
            ))}

            {/* Resume / CV Link with Icon */}
            {hero.resume?.show !== false && (
              <a
                href={resumeHref}
                target={resumeHref.startsWith('http') || resumeHref.startsWith('data:') ? '_blank' : '_self'}
                rel="noreferrer"
                download={hero.resumeFileName || (hero.resumeFile ? 'Resume.pdf' : undefined)}
                onClick={async (e) => {
                  soundManager.playClick();
                  if (resumeHref.startsWith('firestore://') || (!resumeHref.startsWith('http') && !resumeHref.startsWith('data:'))) {
                    e.preventDefault();
                    await downloadResumeFile(hero.resumeFileName);
                  }
                }}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer shrink-0"
                title="Download / View Resume"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-[11px] font-bold">Resume</span>
              </a>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
