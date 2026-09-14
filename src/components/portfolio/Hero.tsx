import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Sparkles, Layers, Clock, Users, Star, FileText } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../ui/SocialIcons';
import { usePortfolio } from '../../context/PortfolioContext';
import { TiltCard } from '../ui/TiltCard';
import { BorderBeam } from '../ui/BorderBeam';
import { ShimmerButton } from '../ui/ShimmerButton';
import { Badge } from '../ui/Badge';
import { Ripple } from '../ui/Ripple';
import { NumberTicker } from '../ui/NumberTicker';
import { MagneticButton } from '../ui/MagneticButton';
import { Floating3DObject } from '../ui/Floating3DObject';
import { soundManager } from '../../utils/audio';

const iconMap: Record<string, React.ReactNode> = {
  Clock: <Clock className="w-4 h-4 text-purple-400" />,
  Layers: <Layers className="w-4 h-4 text-cyan-400" />,
  Users: <Users className="w-4 h-4 text-emerald-400" />,
  Star: <Star className="w-4 h-4 text-amber-400" />,
};

export const Hero: React.FC = () => {
  const { data } = usePortfolio();
  const { hero } = data;
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  // Cycling roles
  useEffect(() => {
    if (!hero.roles || hero.roles.length === 0) return;
    const timer = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % hero.roles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [hero.roles]);

  const scrollTo = (id: string) => {
    soundManager.playClick();
    const cleanId = id.startsWith('#') ? id.slice(1) : id;
    const el = document.getElementById(cleanId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const resumeHref = hero.resumeFile || hero.resume?.url || hero.resume?.link || '#resume';

  const adj = hero.avatarAdjustments || {};
  const avatarStyle: React.CSSProperties = {
    transform: `scale(${adj.scale ?? 1}) translate(${adj.offsetX ?? 0}%, ${adj.offsetY ?? 0}%)`,
    filter: `brightness(${(adj.brightness ?? 100) / 100}) contrast(${(adj.contrast ?? 100) / 100}) saturate(${(adj.saturation ?? 100) / 100})`,
    transformOrigin: 'center center',
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 overflow-hidden"
    >
      {/* Magic UI Ripple background */}
      <Ripple mainCircleSize={220} numCircles={6} mainCircleOpacity={0.15} />

      {/* Ambient background glow balls */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-cyan-500/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Headlines & Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Status Badge */}
          {data.settings.showAvailabilityBadge && hero.status && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              <Badge variant="pulse" className="backdrop-blur-md">
                {hero.status}
              </Badge>
            </motion.div>
          )}

          {/* Greeting & Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-xs uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400 font-mono font-bold flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Creative Architecture
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              Hi, I'm{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400">
                {hero.name}
              </span>
            </h1>
          </motion.div>

          {/* Animated Cycling Role */}
          {hero.roles && hero.roles.length > 0 && (
            <div className="h-10 sm:h-12 overflow-hidden my-3 flex items-center">
              <motion.div
                key={currentRoleIndex}
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -25, opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="text-lg sm:text-2xl font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
              >
                <span className="text-purple-600 dark:text-purple-400">/</span>
                <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                  {hero.roles[currentRoleIndex] || 'Full-Stack Developer'}
                </span>
              </motion.div>
            </div>
          )}

          {/* Tagline & Bio */}
          {hero.tagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl mb-4 font-normal"
            >
              {hero.tagline}
            </motion.p>
          )}

          {hero.bio && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mb-8"
            >
              {hero.bio}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 mb-10"
          >
            {hero.ctaPrimary?.show && (
              <MagneticButton>
                <ShimmerButton
                  onClick={() => scrollTo(hero.ctaPrimary.link)}
                  className="shadow-purple-500/25 shadow-lg text-white"
                >
                  <span className="text-white">{hero.ctaPrimary.label || 'Explore Projects'}</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </ShimmerButton>
              </MagneticButton>
            )}

            {hero.ctaSecondary?.show && (
              <MagneticButton>
                <button
                  onClick={() => scrollTo(hero.ctaSecondary.link)}
                  onMouseEnter={() => soundManager.playHover()}
                  className="px-6 py-3 rounded-full text-sm font-semibold text-slate-800 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm transition-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  <span>{hero.ctaSecondary.label || 'Get in Touch'}</span>
                </button>
              </MagneticButton>
            )}

            {hero.resume?.show && (
              <MagneticButton>
                <a
                  href={resumeHref}
                  target="_blank"
                  rel="noreferrer"
                  download={hero.resumeFile ? (hero.resumeFileName || 'resume.pdf') : undefined}
                  onMouseEnter={() => soundManager.playHover()}
                  onClick={() => soundManager.playClick()}
                  className="px-5 py-3 rounded-full text-xs font-semibold text-slate-800 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{hero.resume?.label || 'Download Resume'}</span>
                </a>
              </MagneticButton>
            )}
          </motion.div>

          {/* Direct Social Links */}
          {data.contact.socials && data.contact.socials.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3"
            >
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">CHANNELS:</span>
              {data.contact.socials.map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => soundManager.playHover()}
                  className="px-3 py-1.5 rounded-full glass-pill text-xs text-slate-700 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 transition-colors flex items-center gap-1.5 font-mono shadow-sm"
                >
                  {soc.platform.toLowerCase().includes('git') ? (
                    <GithubIcon className="w-3.5 h-3.5" />
                  ) : soc.platform.toLowerCase().includes('link') ? (
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  ) : (
                    <TwitterIcon className="w-3.5 h-3.5" />
                  )}
                  <span>{soc.platform}</span>
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Right Column: Interactive 3D Card & Stats */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="lg:col-span-5 flex flex-col items-center relative"
        >
          {/* Interactive Floating 3D Holographic Wireframe */}
          <div className="absolute -top-20 -right-14 z-20 pointer-events-none hidden sm:block">
            <Floating3DObject size={190} />
          </div>

          {/* 3D Tilt Card */}
          <TiltCard
            intensity={18}
            className="w-full max-w-sm glass-card border border-slate-200/90 dark:border-white/15 p-5 shadow-2xl relative group overflow-hidden bg-white/90 dark:bg-slate-900/40"
          >
            <BorderBeam size={180} duration={8} colorFrom="#8b5cf6" colorTo="#06b6d4" />

            <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-slate-200 dark:bg-slate-900/50">
              <img
                src={hero.avatarUrl}
                alt={hero.name}
                style={avatarStyle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
                <span className="font-mono text-[11px] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-white">
                  📍 {hero.location}
                </span>
                <span className="font-mono text-[10px] text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ONLINE
                </span>
              </div>
            </div>

            {/* Quick stats row with NumberTicker */}
            {hero.stats && hero.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                {hero.stats.slice(0, 4).map((stat) => (
                  <div
                    key={stat.id}
                    className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex items-center gap-2.5 shadow-sm dark:shadow-none"
                  >
                    <div className="p-1.5 rounded-lg bg-purple-500/10 dark:bg-white/5">
                      {iconMap[stat.icon] || <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                        <NumberTicker value={stat.value} />
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
};
