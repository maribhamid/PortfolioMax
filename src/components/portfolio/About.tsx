import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Zap, Cpu, ShieldCheck, HeartHandshake } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { BorderBeam } from '../ui/BorderBeam';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ScrollReveal } from '../ui/ScrollReveal';
import { soundManager } from '../../utils/audio';

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
  Cpu: <Cpu className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5 text-rose-500 dark:text-rose-400" />,
};

export const About: React.FC = () => {
  const { data } = usePortfolio();
  const { about } = data;

  return (
    <section id="about" className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {about.badge}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            {about.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-4">
            {about.subtitle}
          </p>
        </ScrollReveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Story Card */}
          <ScrollReveal direction="left" className="md:col-span-7">
            <div
              onMouseEnter={() => soundManager.playHover()}
              className="h-full glass-card border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-xl"
            >
            <BorderBeam size={220} duration={12} delay={2} />
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-purple-600 dark:text-purple-400 mb-4">
                <Flame className="w-4 h-4 text-purple-500" />
                <span>{about.missionBadge}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 font-display">
                {about.storyHeading}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-4 font-normal">
                {about.storyParagraph1}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                {about.storyParagraph2}
              </p>
            </div>

            {/* Live Developer Terminal Simulation */}
            <div className="mt-8 rounded-xl bg-slate-900 dark:bg-black/80 border border-slate-700/60 dark:border-white/10 p-4 font-mono text-xs shadow-md">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-[10px] text-slate-400">zsh ~ developer-env</span>
              </div>
              <div className="space-y-1 text-slate-200">
                <div>
                  <span className="text-purple-400">❯</span> {about.terminalCmd}
                </div>
                {about.terminalOutputs.map((line, idx) => (
                  <div key={idx} className="text-emerald-400 pl-4">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

          {/* Highlights 4-Pack with SpotlightCard */}
          <ScrollReveal direction="right" className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
            {about.highlights.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => soundManager.playHover()}
              >
                <SpotlightCard
                  spotlightColor="rgba(139, 92, 246, 0.2)"
                  className="border border-slate-200/90 hover:border-purple-500/40 dark:border-white/10 dark:hover:border-white/20 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.01] shadow-md dark:shadow-none"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 dark:bg-white/5 border border-purple-500/20 dark:border-white/10 shrink-0">
                      {iconMap[item.icon] || <Zap className="w-5 h-5 text-purple-500" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 font-display">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
