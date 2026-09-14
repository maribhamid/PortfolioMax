import React from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles, Quote, Plus } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { soundManager } from '../../utils/audio';

export const Testimonials: React.FC = () => {
  const { data, setIsAdminOpen } = usePortfolio();
  const { testimonials } = data;

  return (
    <section id="testimonials" className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            ENDORSEMENTS & PRAISE
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Client & Peer Recommendations
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
            Direct feedback from product leads, founders, and engineering executives.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="glass-card border border-dashed border-slate-300 dark:border-white/20 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Star className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              No Testimonials Added Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              Showcase endorsements and feedback from your clients or colleagues by adding reviews through the Admin Panel!
            </p>
            <button
              onClick={() => {
                soundManager.playSuccess();
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 transition-transform hover:scale-105"
            >
              <Plus className="w-4 h-4 text-white" />
              <span className="text-white">Add First Testimonial in Admin</span>
            </button>
          </div>
        ) : (
          /* Testimonials Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => soundManager.playHover()}
                className="glass-card border border-slate-200/90 dark:border-white/10 hover:border-purple-500/30 dark:hover:border-white/20 p-6 sm:p-7 rounded-2xl flex flex-col justify-between relative group transition-all duration-300 hover:scale-[1.01] shadow-md hover:shadow-xl"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-black/5 dark:text-white/5 group-hover:text-purple-500/20 transition-colors pointer-events-none" />

                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array(t.rating || 5)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6">
                    "{t.content}"
                  </p>
                </div>

                {/* Author info */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10 bg-slate-200 dark:bg-slate-800"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      {t.role} • <span className="text-purple-600 dark:text-purple-400 font-semibold">{t.company}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
