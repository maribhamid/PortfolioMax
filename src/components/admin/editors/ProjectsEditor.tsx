import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ProjectItem } from '../../../types/portfolio';
import { Plus, Edit2, Trash2, Star, Check } from 'lucide-react';
import { soundManager } from '../../../utils/audio';
import { ImageUploadField } from '../ui/ImageUploadField';

export const ProjectsEditor: React.FC = () => {
  const { data, addProject, updateProject, deleteProject } = usePortfolio();
  const { projects } = data;

  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Omit<ProjectItem, 'id'>>({
    title: '',
    description: '',
    longDescription: '',
    category: 'Full-Stack',
    tags: ['React', 'TypeScript', 'Tailwind'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    demoUrl: '',
    githubUrl: '',
    metrics: '',
  });

  const [tagInput, setTagInput] = useState('');

  const handleStartCreate = () => {
    soundManager.playClick();
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      category: 'Full-Stack',
      tags: ['React', 'TypeScript'],
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      featured: false,
      demoUrl: '',
      githubUrl: '',
      metrics: '',
    });
    setTagInput('');
    setIsCreating(true);
    setEditingProject(null);
  };

  const handleStartEdit = (p: ProjectItem) => {
    soundManager.playClick();
    setEditingProject(p);
    setFormData({
      title: p.title,
      description: p.description,
      longDescription: p.longDescription || '',
      category: p.category,
      tags: p.tags,
      image: p.image,
      featured: p.featured,
      demoUrl: p.demoUrl,
      githubUrl: p.githubUrl,
      metrics: p.metrics || '',
    });
    setTagInput(p.tags.join(', '));
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTags = tagInput
      ? tagInput.split(',').map((t) => t.trim()).filter(Boolean)
      : formData.tags;

    const payload = { ...formData, tags: parsedTags };

    if (isCreating) {
      addProject(payload);
      setIsCreating(false);
    } else if (editingProject) {
      updateProject(editingProject.id, payload);
      setEditingProject(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold font-display text-white">
            Projects Portfolio Manager
          </h3>
          <p className="text-xs text-slate-400">
            Add, update, or remove showcase projects. Edits reflect instantly.
          </p>
        </div>
        {!isCreating && !editingProject && (
          <button
            onClick={handleStartCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Project
          </button>
        )}
      </div>

      {/* Editor Form Modal / Inline */}
      {(isCreating || editingProject) && (
        <form onSubmit={handleSave} className="p-5 rounded-2xl bg-white/5 border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="text-sm font-bold text-white font-display">
              {isCreating ? 'Create New Project' : `Edit: ${editingProject?.title}`}
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingProject(null);
                }}
                className="px-3 py-1 text-xs text-slate-400 hover:text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">TITLE</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">CATEGORY</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                placeholder="e.g. AI & ML, Full-Stack, Web3"
              />
            </div>
          </div>

          <ImageUploadField
            label="PROJECT COVER / SCREENSHOT IMAGE"
            value={formData.image}
            onChange={(val) => setFormData({ ...formData, image: val })}
            placeholder="https://... or paste Google Drive image link"
            description="Upload project screenshot directly from your drive or paste a Google Drive link."
            aspectRatio="video"
          />

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">SHORT SUMMARY</label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">FULL DETAIL OVERVIEW</label>
            <textarea
              rows={3}
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              placeholder="Architecture, metrics, technical decisions..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">TECH TAGS (COMMA SEPARATED)</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="React, TypeScript, Go"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">DEMO URL</label>
              <input
                type="text"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">GITHUB URL</label>
              <input
                type="text"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">HIGHLIGHT METRIC</label>
              <input
                type="text"
                value={formData.metrics}
                onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                placeholder="e.g. 50,000+ active users"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="featuredCheck"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-purple-600 bg-black/40 border-white/20"
              />
              <label htmlFor="featuredCheck" className="text-xs font-medium text-slate-300">
                Mark as Featured Project (Glowing Beam)
              </label>
            </div>
          </div>
        </form>
      )}

      {/* Existing Projects List */}
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-800"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white truncate font-display">
                    {project.title}
                  </h4>
                  {project.featured && (
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                      FEATURED
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {project.category} • {project.tags.join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => updateProject(project.id, { featured: !project.featured })}
                className={`p-2 rounded-lg transition-colors ${
                  project.featured ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-white'
                }`}
                title="Toggle Featured"
              >
                <Star className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleStartEdit(project)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Edit Project"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Delete "${project.title}"?`)) {
                    deleteProject(project.id);
                  }
                }}
                className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
