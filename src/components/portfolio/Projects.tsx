import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Sparkles, Search, Layers, Zap, CheckCircle2, Plus } from 'lucide-react';
import { GithubIcon } from '../ui/SocialIcons';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProjectItem } from '../../types/portfolio';
import { BorderBeam } from '../ui/BorderBeam';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { ScrollReveal } from '../ui/ScrollReveal';
import { MagneticButton } from '../ui/MagneticButton';
import { soundManager } from '../../utils/audio';

export const Projects: React.FC = () => {
  const { data, setIsAdminOpen } = usePortfolio();
  const { projects } = data;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              PORTFOLIO SHOWCASE
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              Featured Creations
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Production systems, AI agents, and experimental interfaces engineered with precision.
            </p>
          </div>

          {/* Search bar (only if projects exist) */}
          {projects.length > 0 && (
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          )}
        </ScrollReveal>

        {/* Empty State when no projects added yet */}
        {projects.length === 0 ? (
          <div className="glass-card border border-dashed border-slate-300 dark:border-white/20 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-500 dark:text-purple-400 flex items-center justify-center mx-auto">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              No Projects Added Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              Your showcase is currently clean. Open the Admin Panel to add your custom applications, repositories, screenshots, and live demo links!
            </p>
            <button
              onClick={() => {
                soundManager.playSuccess();
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-transform hover:scale-105"
            >
              <Plus className="w-4 h-4 text-white" />
              <span className="text-white">Add First Project in Admin</span>
            </button>
          </div>
        ) : (
          <>
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedCategory(cat);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-400 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Projects Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    onMouseEnter={() => soundManager.playHover()}
                    className="group glass-card border border-slate-200/90 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between relative hover:border-purple-500/40 dark:hover:border-white/20 transition-all duration-300 hover:shadow-2xl shadow-md"
                  >
                    {project.featured && (
                      <BorderBeam size={160} duration={9} colorFrom="#8b5cf6" colorTo="#38bdf8" />
                    )}

                    {/* Card Thumbnail */}
                    <div
                      onClick={() => {
                        soundManager.playClick();
                        setActiveProject(project);
                      }}
                      className="relative aspect-video overflow-hidden cursor-pointer bg-slate-900"
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Badges on image */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15">
                          {project.category}
                        </span>
                        {project.featured && (
                          <Badge variant="glow" className="text-[10px] py-0.5">
                            FEATURED
                          </Badge>
                        )}
                      </div>

                      {project.metrics && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-mono text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30">
                          <Zap className="w-3 h-3 text-emerald-400" />
                          <span>{project.metrics}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3
                          onClick={() => {
                            soundManager.playClick();
                            setActiveProject(project);
                          }}
                          className="text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors cursor-pointer mb-2"
                        >
                          {project.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                          {project.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-400">
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Action Links */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10 text-xs">
                          <button
                            onClick={() => {
                              soundManager.playClick();
                              setActiveProject(project);
                            }}
                            className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
                          >
                            Details
                            <ExternalLink className="w-3 h-3" />
                          </button>

                          <div className="flex items-center gap-3">
                            {project.githubUrl && (
                              <MagneticButton strength={0.25}>
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseEnter={() => soundManager.playHover()}
                                  className="text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors p-1"
                                  title="GitHub Source"
                                >
                                  <GithubIcon className="w-4 h-4" />
                                </a>
                              </MagneticButton>
                            )}
                            {project.demoUrl && (
                              <MagneticButton strength={0.25}>
                                <a
                                  href={project.demoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseEnter={() => soundManager.playHover()}
                                  className="text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors p-1"
                                  title="Live Demo"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </MagneticButton>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>

      {/* Project Detail Modal */}
      <Modal
        isOpen={!!activeProject}
        onClose={() => setActiveProject(null)}
        title={activeProject?.title}
      >
        {activeProject && (
          <div className="space-y-6">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/10">
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20">
                  {activeProject.category}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider font-mono text-purple-400 mb-1">
                OVERVIEW
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {activeProject.longDescription || activeProject.description}
              </p>
            </div>

            {activeProject.metrics && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-400 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Impact Metric: {activeProject.metrics}</span>
              </div>
            )}

            <div>
              <h4 className="text-xs uppercase tracking-wider font-mono text-slate-400 mb-2">
                TECHNOLOGY STACK
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  View Source
                </a>
              )}
              {activeProject.demoUrl && (
                <a
                  href={activeProject.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Launch Demo
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
