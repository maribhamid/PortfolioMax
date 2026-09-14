import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ExperienceItem } from '../../../types/portfolio';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';
import { soundManager } from '../../../utils/audio';

export const ExperienceEditor: React.FC = () => {
  const { data, addExperience, updateExperience, deleteExperience } = usePortfolio();
  const { experience } = data;

  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Omit<ExperienceItem, 'id'>>({
    role: '',
    company: '',
    period: '',
    location: '',
    description: '',
    achievements: [],
    technologies: [],
  });

  const [achievementsText, setAchievementsText] = useState('');
  const [techText, setTechText] = useState('');

  const handleStartCreate = () => {
    soundManager.playClick();
    setFormData({
      role: '',
      company: '',
      period: '2024 - Present',
      location: 'San Francisco, CA',
      description: '',
      achievements: ['Delivered core platform rewrite'],
      technologies: ['React', 'TypeScript'],
    });
    setAchievementsText('Delivered core platform rewrite');
    setTechText('React, TypeScript');
    setIsCreating(true);
    setEditingItem(null);
  };

  const handleStartEdit = (exp: ExperienceItem) => {
    soundManager.playClick();
    setEditingItem(exp);
    setFormData({
      role: exp.role,
      company: exp.company,
      period: exp.period,
      location: exp.location,
      description: exp.description,
      achievements: exp.achievements || [],
      technologies: exp.technologies || [],
    });
    setAchievementsText(exp.achievements?.join('\n') || '');
    setTechText(exp.technologies?.join(', ') || '');
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const achievements = achievementsText
      .split('\n')
      .map((a) => a.trim())
      .filter(Boolean);
    const technologies = techText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      achievements,
      technologies,
    };

    if (isCreating) {
      addExperience(payload);
      setIsCreating(false);
    } else if (editingItem) {
      updateExperience(editingItem.id, payload);
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold font-display text-white">
            Career Timeline & Experience
          </h3>
          <p className="text-xs text-slate-400">
            Keep your career trajectory, roles, and achievements updated.
          </p>
        </div>
        {!isCreating && !editingItem && (
          <button
            onClick={handleStartCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Milestone
          </button>
        )}
      </div>

      {(isCreating || editingItem) && (
        <form onSubmit={handleSave} className="p-5 rounded-2xl bg-white/5 border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="text-sm font-bold text-white font-display">
              {isCreating ? 'Add Experience Milestone' : `Edit: ${editingItem?.role}`}
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingItem(null);
                }}
                className="px-3 py-1 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">ROLE / TITLE</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">COMPANY</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">TIMEFRAME</label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                placeholder="2022 - Present"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">LOCATION</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                placeholder="San Francisco, CA (Hybrid)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">SUMMARY DESCRIPTION</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">KEY ACHIEVEMENTS (ONE PER LINE)</label>
            <textarea
              rows={3}
              value={achievementsText}
              onChange={(e) => setAchievementsText(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              placeholder="Reduced API latency by 40%&#10;Built real-time websocket engine"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">TECH STACK (COMMA SEPARATED)</label>
            <input
              type="text"
              value={techText}
              onChange={(e) => setTechText(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              placeholder="React, TypeScript, Node.js, AWS"
            />
          </div>
        </form>
      )}

      {/* Experience List */}
      <div className="space-y-3">
        {experience.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
          >
            <div>
              <h4 className="text-sm font-bold text-white font-display">
                {exp.role} <span className="text-purple-400 font-normal">@ {exp.company}</span>
              </h4>
              <p className="text-xs text-slate-400">
                {exp.period} • {exp.location}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStartEdit(exp)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Edit Milestone"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Delete milestone "${exp.role}"?`)) {
                    deleteExperience(exp.id);
                  }
                }}
                className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete Milestone"
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
