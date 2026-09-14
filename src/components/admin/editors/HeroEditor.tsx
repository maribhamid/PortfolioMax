import React from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Plus, Trash2, Link, FileText, ArrowRight, Mail } from 'lucide-react';
import { soundManager } from '../../../utils/audio';
import { ImageUploadField } from '../ui/ImageUploadField';
import { AvatarAdjuster } from '../ui/AvatarAdjuster';

export const HeroEditor: React.FC = () => {
  const { data, updateHero } = usePortfolio();
  const { hero } = data;

  const handleRoleChange = (index: number, value: string) => {
    const newRoles = [...hero.roles];
    newRoles[index] = value;
    updateHero({ roles: newRoles });
  };

  const addRole = () => {
    soundManager.playClick();
    updateHero({ roles: [...hero.roles, 'Full-Stack Developer'] });
  };

  const removeRole = (index: number) => {
    soundManager.playClick();
    const newRoles = hero.roles.filter((_, i) => i !== index);
    updateHero({ roles: newRoles });
  };

  const handleStatChange = (id: string, field: string, value: string) => {
    const updatedStats = hero.stats.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    updateHero({ stats: updatedStats });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-display text-white mb-1">
          Hero Section & Call-To-Action Manager
        </h3>
        <p className="text-xs text-slate-400">
          Customize your name, headline, avatar, cycling titles, Resume link, and primary buttons.
        </p>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">
            FULL NAME
          </label>
          <input
            type="text"
            value={hero.name}
            onChange={(e) => updateHero({ name: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500/60"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">
            AVAILABILITY STATUS TEXT
          </label>
          <input
            type="text"
            value={hero.status}
            onChange={(e) => updateHero({ status: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500/60"
          />
        </div>
      </div>

      {/* Profile Avatar Upload from Drive or URL */}
      <ImageUploadField
        label="PROFILE AVATAR / LOGO IMAGE"
        value={hero.avatarUrl}
        onChange={(val) => updateHero({ avatarUrl: val })}
        placeholder="https://... or paste Google Drive link"
        description="Upload your headshot or logo directly from your hard drive, or paste a Google Drive / web image link."
        aspectRatio="square"
      />

      {/* Live Profile Picture Studio & Adjuster */}
      {hero.avatarUrl && (
        <AvatarAdjuster
          avatarUrl={hero.avatarUrl}
          adjustments={hero.avatarAdjustments}
          onChange={(adj) => updateHero({ avatarAdjustments: adj })}
        />
      )}

      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">
          LOCATION
        </label>
        <input
          type="text"
          value={hero.location}
          onChange={(e) => updateHero({ location: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500/60"
        />
      </div>

      {/* Tagline & Bio */}
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">
          HERO HEADLINE / TAGLINE
        </label>
        <textarea
          rows={2}
          value={hero.tagline}
          onChange={(e) => updateHero({ tagline: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500/60"
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">
          BIO DESCRIPTION
        </label>
        <textarea
          rows={3}
          value={hero.bio}
          onChange={(e) => updateHero({ bio: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500/60"
        />
      </div>

      {/* Buttons & Resume Configuration */}
      <div className="pt-4 border-t border-white/10 space-y-4">
        <h4 className="text-xs font-mono text-purple-400 uppercase tracking-wider">
          Buttons & Resume Settings
        </h4>

        {/* Primary CTA (Explore Projects) */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              <span>Primary Button (Shimmer Button)</span>
            </div>
            <label className="flex items-center gap-1.5 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={hero.ctaPrimary.show}
                onChange={(e) =>
                  updateHero({
                    ctaPrimary: { ...hero.ctaPrimary, show: e.target.checked },
                  })
                }
                className="rounded accent-purple-600"
              />
              Show Button
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">LABEL</label>
              <input
                type="text"
                value={hero.ctaPrimary.label}
                onChange={(e) =>
                  updateHero({
                    ctaPrimary: { ...hero.ctaPrimary, label: e.target.value },
                  })
                }
                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">LINK OR ANCHOR</label>
              <input
                type="text"
                value={hero.ctaPrimary.link}
                onChange={(e) =>
                  updateHero({
                    ctaPrimary: { ...hero.ctaPrimary, link: e.target.value },
                  })
                }
                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Secondary CTA (Get in Touch) */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Secondary Button ("Get in Touch")</span>
            </div>
            <label className="flex items-center gap-1.5 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={hero.ctaSecondary.show}
                onChange={(e) =>
                  updateHero({
                    ctaSecondary: { ...hero.ctaSecondary, show: e.target.checked },
                  })
                }
                className="rounded accent-purple-600"
              />
              Show Button
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">LABEL</label>
              <input
                type="text"
                value={hero.ctaSecondary.label}
                onChange={(e) =>
                  updateHero({
                    ctaSecondary: { ...hero.ctaSecondary, label: e.target.value },
                  })
                }
                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">LINK OR ANCHOR</label>
              <input
                type="text"
                value={hero.ctaSecondary.link}
                onChange={(e) =>
                  updateHero({
                    ctaSecondary: { ...hero.ctaSecondary, link: e.target.value },
                  })
                }
                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Resume Button & Link */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Resume Link & Button</span>
            </div>
            <label className="flex items-center gap-1.5 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={hero.resume.show}
                onChange={(e) =>
                  updateHero({
                    resume: { ...hero.resume, show: e.target.checked },
                  })
                }
                className="rounded accent-purple-600"
              />
              Show Resume
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">BUTTON TEXT</label>
              <input
                type="text"
                value={hero.resume.label}
                onChange={(e) =>
                  updateHero({
                    resume: { ...hero.resume, label: e.target.value },
                  })
                }
                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">RESUME URL / CLOUD LINK</label>
              <input
                type="text"
                placeholder="https://drive.google.com/... or https://..."
                value={hero.resume?.url || hero.resume?.link || ''}
                onChange={(e) =>
                  updateHero({
                    resume: { ...hero.resume, url: e.target.value, link: e.target.value },
                  })
                }
                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
              <p className="text-[10px] text-emerald-400 mt-1">
                Tip: You can also upload your resume PDF directly from your computer under the <strong>"Resume & Files"</strong> tab on the left!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cycling Roles */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono text-slate-400">
            ANIMATED CYCLING ROLES
          </label>
          <button
            onClick={addRole}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Role
          </button>
        </div>
        <div className="space-y-2">
          {hero.roles.map((role, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={role}
                onChange={(e) => handleRoleChange(idx, e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
              />
              <button
                onClick={() => removeRole(idx)}
                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Remove Role"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Counter Editor */}
      <div className="pt-4 border-t border-white/10">
        <h4 className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-3">
          Hero Stat Badges
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hero.stats.map((stat) => (
            <div key={stat.id} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Value (e.g. 8+)"
                  value={stat.value}
                  onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                  className="w-1/2 bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                  className="w-1/2 bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
