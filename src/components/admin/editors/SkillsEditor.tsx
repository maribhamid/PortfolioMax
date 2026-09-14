import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { SkillItem } from '../../../types/portfolio';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { soundManager } from '../../../utils/audio';

export const SkillsEditor: React.FC = () => {
  const { data, addSkill, updateSkill, deleteSkill } = usePortfolio();
  const { skills } = data;

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'Frontend' | 'Backend' | 'AI & Cloud' | 'Tools & Design'>('Frontend');
  const [newSkillLevel, setNewSkillLevel] = useState(90);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addSkill({
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: Number(newSkillLevel),
      icon: 'Code2',
      highlight: false,
    });
    setNewSkillName('');
    soundManager.playSuccess();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-display text-white">
          Technical Skills & Radar
        </h3>
        <p className="text-xs text-slate-400">
          Modify proficiency scores, add new frameworks, or re-categorize technologies.
        </p>
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleAddSkill} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] font-mono text-slate-400 mb-1">SKILL NAME</label>
          <input
            type="text"
            required
            placeholder="e.g. GraphQL, Rust"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
          />
        </div>

        <div className="w-36">
          <label className="block text-[10px] font-mono text-slate-400 mb-1">CATEGORY</label>
          <select
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value as any)}
            className="w-full bg-[#0e111d] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="AI & Cloud">AI & Cloud</option>
            <option value="Tools & Design">Tools & Design</option>
          </select>
        </div>

        <div className="w-24">
          <label className="block text-[10px] font-mono text-slate-400 mb-1">LEVEL ({newSkillLevel}%)</label>
          <input
            type="number"
            min="10"
            max="100"
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(Number(e.target.value))}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1 shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </form>

      {/* Skills list grouped */}
      <div className="space-y-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 gap-3"
          >
            <div className="flex-1 min-w-[120px]">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                className="bg-transparent text-sm font-semibold text-white focus:bg-black/50 rounded px-1.5 py-0.5"
              />
              <span className="text-[10px] font-mono text-slate-400 block px-1.5">
                {skill.category}
              </span>
            </div>

            <div className="flex items-center gap-3 w-44">
              <input
                type="range"
                min="30"
                max="100"
                value={skill.level}
                onChange={(e) => updateSkill(skill.id, { level: Number(e.target.value) })}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-300 w-8 text-right">
                {skill.level}%
              </span>
            </div>

            <button
              onClick={() => updateSkill(skill.id, { highlight: !skill.highlight })}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                skill.highlight ? 'text-purple-400 bg-purple-500/10' : 'text-slate-500 hover:text-white'
              }`}
              title="Toggle Core Strength"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => deleteSkill(skill.id)}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Skill"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
