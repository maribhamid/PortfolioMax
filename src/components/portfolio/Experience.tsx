import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle2, Sparkles, Plus } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { BorderBeam } from '../ui/BorderBeam';
import { soundManager } from '../../utils/audio';

export const Experience: React.FC = () => {
  const { data, setIsAdminOpen } = usePortfolio();
  const { experience } = data;

  return (
    <section id="experience" className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            CAREER TRAJECTORY
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Work History & Milestones
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
            A journey of engineering leadership, scalable product launches, and continuous innovation.
          </p>
        </div>

        {experience.length === 0 ? (
          <div className="glass-card border border-dashed border-slate-300 dark:border-white/20 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              No Milestones Added Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              Track your career progression, company roles, leadership achievements, and tech stack by adding timeline entries in the Admin Panel!
            </p>
            <button
              onClick={() => {
                soundManager.playSuccess();
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105"
            >
              <Plus className="w-4 h-4 text-white" />
              <span className="text-white">Add First Milestone in Admin</span>
            </button>
          </div>
        ) : (
          /* Timeline container */
          <div className="relative pl-6 sm:pl-8 border-l border-slate-200 dark:border-white/10 space-y-12">
            {experience.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => soundManager.playHover()}
                className="relative group"
              >
                {/* Timeline indicator node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-purple-500 group-hover:border-cyan-400 transition-colors flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:bg-cyan-400 transition-colors" />
                </div>

                {/* Milestone Card */}
                <div className="glass-card border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-7 relative overflow-hidden transition-all duration-300 hover:border-purple-500/30 dark:hover:border-white/20 shadow-md hover:shadow-xl">
                  {index === 0 && (
                    <BorderBeam size={180} duration={10} colorFrom="#10b981" colorTo="#38bdf8" />
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white">
                        {item.role}
                      </h3>
                      <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2 mt-0.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{item.company}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-white/5">
                        <Calendar className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                        {item.period}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-white/5">
                        <MapPin className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4 font-normal">
                    {item.description}
                  </p>

                  {/* Key Deliverables */}
                  {item.achievements && item.achievements.length > 0 && (
                    <div className="space-y-2 mb-5">
                      {item.achievements.map((ach, aIdx) => (
                        <div key={aIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech Stack */}
                  {item.technologies && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200 dark:border-white/10">
                      {item.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
