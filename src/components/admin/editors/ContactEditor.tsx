import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Plus, Trash2, Globe, Mail, Phone, MapPin, Eye, ArrowRight } from 'lucide-react';
import { soundManager } from '../../../utils/audio';

export const ContactEditor: React.FC = () => {
  const { data, updateContact, updateHero } = usePortfolio();
  const { contact, hero } = data;

  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const [newProjectType, setNewProjectType] = useState('');
  const [newBudget, setNewBudget] = useState('');

  // Socials
  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatform.trim() || !newUrl.trim()) return;
    const newSocial = {
      id: 'soc-' + Date.now(),
      platform: newPlatform.trim(),
      url: newUrl.trim(),
    };
    updateContact({ socials: [...contact.socials, newSocial] });
    setNewPlatform('');
    setNewUrl('');
    soundManager.playSuccess();
  };

  const handleDeleteSocial = (id: string) => {
    soundManager.playClick();
    updateContact({ socials: contact.socials.filter((s) => s.id !== id) });
  };

  // Project Types
  const handleAddProjectType = () => {
    if (!newProjectType.trim()) return;
    updateContact({ projectTypes: [...contact.projectTypes, newProjectType.trim()] });
    setNewProjectType('');
    soundManager.playSuccess();
  };

  const handleDeleteProjectType = (index: number) => {
    soundManager.playClick();
    updateContact({ projectTypes: contact.projectTypes.filter((_, i) => i !== index) });
  };

  // Budgets
  const handleAddBudget = () => {
    if (!newBudget.trim()) return;
    updateContact({ budgets: [...contact.budgets, newBudget.trim()] });
    setNewBudget('');
    soundManager.playSuccess();
  };

  const handleDeleteBudget = (index: number) => {
    soundManager.playClick();
    updateContact({ budgets: contact.budgets.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-display text-white mb-1">
          Get in Touch & Contact Section CMS
        </h3>
        <p className="text-xs text-slate-400">
          Customize the "Get in Touch" Hero CTA button, direct contact channels, form dropdowns, and social profiles.
        </p>
      </div>

      {/* Hero "Get in Touch" Button Customizer */}
      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>"Get in Touch" Button in Hero Section</span>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={hero.ctaSecondary?.show ?? true}
              onChange={(e) =>
                updateHero({
                  ctaSecondary: { ...hero.ctaSecondary, show: e.target.checked },
                })
              }
              className="w-4 h-4 rounded accent-cyan-500"
            />
            <span>Show on Hero</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-mono text-slate-300 mb-1">
              BUTTON TEXT
            </label>
            <input
              type="text"
              value={hero.ctaSecondary?.label || 'Get in Touch'}
              onChange={(e) =>
                updateHero({
                  ctaSecondary: { ...hero.ctaSecondary, label: e.target.value },
                })
              }
              className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-slate-300 mb-1">
              BUTTON LINK / ANCHOR
            </label>
            <input
              type="text"
              value={hero.ctaSecondary?.link || '#contact'}
              onChange={(e) =>
                updateHero({
                  ctaSecondary: { ...hero.ctaSecondary, link: e.target.value },
                })
              }
              className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Section Headings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">SECTION BADGE</label>
          <input
            type="text"
            value={contact.badge}
            onChange={(e) => updateContact({ badge: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">SECTION TITLE</label>
          <input
            type="text"
            value={contact.title}
            onChange={(e) => updateContact({ title: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">SECTION SUBTITLE</label>
        <textarea
          rows={2}
          value={contact.subtitle}
          onChange={(e) => updateContact({ subtitle: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
        />
      </div>

      {/* Direct Info */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <h4 className="text-xs font-mono text-rose-400 uppercase tracking-wider">
          Direct Channels & Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">DIRECT EMAIL ADDRESS</label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => updateContact({ email: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">PHONE NUMBER</label>
            <input
              type="text"
              value={contact.phone}
              onChange={(e) => updateContact({ phone: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">LOCATION</label>
            <input
              type="text"
              value={contact.location}
              onChange={(e) => updateContact({ location: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">RESPONSE TIME</label>
            <input
              type="text"
              value={contact.responseTime}
              onChange={(e) => updateContact({ responseTime: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Social Profiles */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
          Social Profiles & External Channels
        </h4>

        <form onSubmit={handleAddSocial} className="flex gap-2 items-end bg-white/5 p-3 rounded-xl border border-white/10">
          <div className="w-1/3">
            <label className="block text-[10px] font-mono text-slate-400 mb-1">PLATFORM</label>
            <input
              type="text"
              required
              placeholder="e.g. GitHub, Discord"
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1 text-xs text-white"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-mono text-slate-400 mb-1">PROFILE URL</label>
            <input
              type="url"
              required
              placeholder="https://..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1 text-xs text-white"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </form>

        <div className="space-y-2">
          {contact.socials.map((soc) => (
            <div
              key={soc.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5"
            >
              <div className="flex items-center gap-2 overflow-hidden text-xs">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-white">{soc.platform}:</span>
                <span className="text-slate-400 truncate">{soc.url}</span>
              </div>
              <button
                onClick={() => handleDeleteSocial(soc.id)}
                className="p-1 text-rose-400 hover:bg-rose-500/10 rounded"
                title="Remove Link"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Dropdowns */}
      <div className="pt-4 border-t border-white/10 space-y-4">
        <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
          Contact Form Dropdown Choices
        </h4>

        {/* Project Types */}
        <div>
          <label className="block text-xs text-slate-300 font-semibold mb-2">
            Project Type Options
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="New project type..."
              value={newProjectType}
              onChange={(e) => setNewProjectType(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
            />
            <button
              onClick={handleAddProjectType}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Add Option
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {contact.projectTypes.map((type, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300"
              >
                {type}
                <button
                  onClick={() => handleDeleteProjectType(idx)}
                  className="hover:text-rose-400 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Budgets */}
        <div>
          <label className="block text-xs text-slate-300 font-semibold mb-2">
            Estimated Budget Options
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="New budget range..."
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
            />
            <button
              onClick={handleAddBudget}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Add Option
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {contact.budgets.map((b, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300"
              >
                {b}
                <button
                  onClick={() => handleDeleteBudget(idx)}
                  className="hover:text-rose-400 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
