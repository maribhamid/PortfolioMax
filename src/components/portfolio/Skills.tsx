import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code2, Server, Cpu, Wrench, Atom, Zap, Plus } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Marquee } from '../ui/Marquee';
import { soundManager } from '../../utils/audio';

const categoryIcons: Record<string, React.ReactNode> = {
  Frontend: <Code2 className="w-4 h-4 text-purple-400" />,
  Backend: <Server className="w-4 h-4 text-cyan-400" />,
  'AI & Cloud': <Cpu className="w-4 h-4 text-emerald-400" />,
  'Tools & Design': <Wrench className="w-4 h-4 text-amber-400" />,
};

export const Skills: React.FC = () => {
  const { data, setIsAdminOpen } = usePortfolio();
  const { skills } = data;
  const [activeTab, setActiveTab] = useState<'Frontend' | 'Backend' | 'AI & Cloud' | 'Tools & Design'>('Frontend');

  const categories: Array<'Frontend' | 'Backend' | 'AI & Cloud' | 'Tools & Design'> = [
    'Frontend',
    'Backend',
    'AI & Cloud',
    'Tools & Design',
  ];

  const filteredSkills = skills.filter((s) => s.category === activeTab);

  // Divide skills into two rows for marquee
  const row1 = skills.slice(0, Math.ceil(skills.length / 2));
  const row2 = skills.slice(Math.ceil(skills.length / 2));

  return (
    <section id="skills" className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            TECHNICAL PROFICIENCY
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Tools, Runtimes & Frameworks
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
            A comprehensive overview of daily development stack and architectural primitives.
          </p>
        </div>

        {skills.length === 0 ? (
          <div className="glass-card border border-dashed border-slate-300 dark:border-white/20 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 dark:text-cyan-400 flex items-center justify-center mx-auto">
              <Code2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              No Skills Added Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              Add your programming languages, frontend libraries, cloud providers, and backend frameworks from the Admin Panel to activate the Magic UI marquees!
            </p>
            <button
              onClick={() => {
                soundManager.playSuccess();
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 transition-transform hover:scale-105"
            >
              <Plus className="w-4 h-4 text-white" />
              <span className="text-white">Add First Skill in Admin</span>
            </button>
          </div>
        ) : (
          <>
            {/* Dual Infinite Scrolling Marquees (Magic UI) */}
            <div className="relative mb-16 mask-marquee overflow-hidden py-4">
              <Marquee pauseOnHover duration="28s" className="mb-3">
                {row1.map((skill) => (
                  <div
                    key={skill.id}
                    onMouseEnter={() => soundManager.playHover()}
                    className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl glass-card border border-slate-200/90 dark:border-white/10 hover:border-purple-500/40 hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm dark:shadow-none"
                  >
                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <Atom className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold font-display text-slate-900 dark:text-white whitespace-nowrap">
                      {skill.name}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      {skill.level}%
                    </span>
                  </div>
                ))}
              </Marquee>

              {row2.length > 0 && (
                <Marquee reverse pauseOnHover duration="32s">
                  {row2.map((skill) => (
                    <div
                      key={skill.id}
                      onMouseEnter={() => soundManager.playHover()}
                      className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl glass-card border border-slate-200/90 dark:border-white/10 hover:border-cyan-500/40 hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm dark:shadow-none"
                    >
                      <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                        <Zap className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold font-display text-slate-900 dark:text-white whitespace-nowrap">
                        {skill.name}
                      </span>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        {skill.level}%
                      </span>
                    </div>
                  ))}
                </Marquee>
              )}
            </div>

            {/* Interactive Category Tabs & Bars */}
            <div className="glass-card border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-slate-200 dark:border-white/10">
                {categories.map((cat) => {
                  const isActive = activeTab === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        soundManager.playClick();
                        setActiveTab(cat);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-purple-600/15 text-purple-600 dark:bg-purple-600/30 dark:text-purple-300 border border-purple-500/40 shadow-sm font-bold'
                          : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {categoryIcons[cat]}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onMouseEnter={() => soundManager.playHover()}
                    className="p-4 rounded-xl bg-slate-50/90 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 hover:border-purple-500/30 dark:hover:border-white/15 transition-colors shadow-sm dark:shadow-none"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">
                          {skill.name}
                        </span>
                        {skill.highlight && (
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-500/30">
                            CORE
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Animated progress bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/5 overflow-hidden p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
