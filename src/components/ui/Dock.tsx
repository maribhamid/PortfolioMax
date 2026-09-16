import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  Home,
  User,
  Layers,
  Code2,
  Briefcase,
  Mail,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  Download
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AccentTheme } from '../../types/portfolio';
import { soundManager } from '../../utils/audio';
import { cn } from '../../lib/utils';

interface DockIconProps {
  mouseX: any;
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}

const DockIcon: React.FC<DockIconProps> = ({ mouseX, children, label, onClick, active }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-110, 0, 110], [40, 56, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 170, damping: 14 });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <motion.div
      ref={ref}
      style={isMobile ? undefined : { width, height: width }}
      onClick={() => {
        soundManager.playClick();
        onClick();
      }}
      onMouseEnter={() => {
        if (!isMobile) {
          soundManager.playHover();
          setHovered(true);
        }
      }}
      onMouseLeave={() => setHovered(false)}
      data-interactive="true"
      className={cn(
        'relative flex items-center justify-center rounded-2xl cursor-pointer transition-colors select-none shrink-0',
        isMobile && 'w-9 h-9',
        active
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
          : 'bg-white/80 dark:bg-white/10 hover:bg-slate-200/80 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10'
      )}
    >
      {/* Tooltip */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute -top-10 px-2.5 py-1 rounded-lg bg-slate-900/90 dark:bg-black/90 text-white text-[11px] font-mono whitespace-nowrap shadow-xl border border-white/15 pointer-events-none z-50 backdrop-blur-md"
        >
          {label}
        </motion.div>
      )}

      <div className="flex items-center justify-center w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

const themes: { id: AccentTheme; label: string; color: string }[] = [
  { id: 'violet', label: 'Cyber Violet', color: '#8b5cf6' },
  { id: 'cyan', label: 'Electric Cyan', color: '#06b6d4' },
  { id: 'emerald', label: 'Matrix Emerald', color: '#10b981' },
  { id: 'rose', label: 'Neon Rose', color: '#f43f5e' },
  { id: 'amber', label: 'Sunset Amber', color: '#f59e0b' },
];

export const Dock: React.FC = () => {
  const mouseX = useMotionValue(Infinity);
  const { data, colorMode, toggleColorMode, toggleSound, openAdmin, openInstallModal, setAccentTheme } = usePortfolio();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-end justify-center pointer-events-auto max-w-[96vw]">
      {/* Accent Themes Popover */}
      <AnimatePresence>
        {themeMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="absolute bottom-20 p-2.5 rounded-2xl glass-card border border-slate-200 dark:border-white/20 w-48 shadow-2xl z-50 bg-white/95 dark:bg-black/95 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Accent Theme
              </span>
              <button
                onClick={() => setThemeMenuOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    soundManager.playSuccess();
                    setAccentTheme(t.id);
                    setThemeMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    data.settings.accentTheme === t.id
                      ? 'bg-purple-600/15 text-purple-700 dark:bg-white/15 dark:text-white font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/15 dark:border-white/30"
                    style={{ backgroundColor: t.color }}
                  />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-3xl bg-white/85 dark:bg-black/60 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-2xl shadow-slate-400/20 dark:shadow-black/60 overflow-x-auto no-scrollbar"
      >
        <DockIcon mouseX={mouseX} label="Home" onClick={() => scrollTo('hero')}>
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
        </DockIcon>

        <DockIcon mouseX={mouseX} label="About" onClick={() => scrollTo('about')}>
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
        </DockIcon>

        <DockIcon mouseX={mouseX} label="Projects" onClick={() => scrollTo('projects')}>
          <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
        </DockIcon>

        <DockIcon mouseX={mouseX} label="Skills" onClick={() => scrollTo('skills')}>
          <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </DockIcon>

        <DockIcon mouseX={mouseX} label="Experience" onClick={() => scrollTo('experience')}>
          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
        </DockIcon>

        <DockIcon mouseX={mouseX} label="Contact" onClick={() => scrollTo('contact')}>
          <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
        </DockIcon>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-slate-300 dark:bg-white/15 mx-0.5 sm:mx-1 shrink-0" />

        {/* Theme Accent Picker */}
        <DockIcon
          mouseX={mouseX}
          label="Accent Colors"
          onClick={() => setThemeMenuOpen(!themeMenuOpen)}
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 dark:text-amber-400" />
        </DockIcon>

        {/* Light / Dark Mode Toggle */}
        <DockIcon
          mouseX={mouseX}
          label={colorMode === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          onClick={toggleColorMode}
        >
          {colorMode === 'dark' ? (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          )}
        </DockIcon>

        {/* Sound Effects Toggle */}
        <DockIcon
          mouseX={mouseX}
          label={data.settings.soundEffects ? 'Mute Sounds' : 'Enable Sounds'}
          onClick={toggleSound}
        >
          {data.settings.soundEffects ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          )}
        </DockIcon>

        {/* Admin CMS Trigger */}
        <DockIcon
          mouseX={mouseX}
          label="CMS Admin (Ctrl+E)"
          onClick={openAdmin}
        >
          <Sliders className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 dark:text-cyan-400" />
        </DockIcon>

        {/* Download & Install App Trigger */}
        <DockIcon
          mouseX={mouseX}
          label="Download App"
          onClick={openInstallModal}
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 dark:text-emerald-400" />
        </DockIcon>
      </motion.div>
    </div>
  );
};
