import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { AccentTheme, VisibleSections } from '../../../types/portfolio';
import { Sparkles, Volume2, VolumeX, Eye, Flame, Compass, Radio } from 'lucide-react';
import { soundManager } from '../../../utils/audio';

const themePresets: { id: AccentTheme; label: string; color: string }[] = [
  { id: 'violet', label: 'Cyber Violet', color: '#8b5cf6' },
  { id: 'cyan', label: 'Electric Cyan', color: '#06b6d4' },
  { id: 'emerald', label: 'Matrix Emerald', color: '#10b981' },
  { id: 'rose', label: 'Neon Rose', color: '#f43f5e' },
  { id: 'amber', label: 'Sunset Amber', color: '#f59e0b' },
];

export const ThemeEditor: React.FC = () => {
  const { data, updateSettings, setAccentTheme, setCustomColors, toggleSectionVisibility } = usePortfolio();
  const { settings } = data;

  const [customPrimary, setCustomPrimary] = useState(settings.customPrimaryColor || '#8b5cf6');
  const [customAccent, setCustomAccent] = useState(settings.customAccentColor || '#06b6d4');

  const handleApplyCustomColors = () => {
    setCustomColors(customPrimary, customAccent);
  };

  const sectionsList: { key: keyof VisibleSections; label: string }[] = [
    { key: 'hero', label: 'Hero Section' },
    { key: 'about', label: 'About & Story Section' },
    { key: 'projects', label: 'Projects Showcase Section' },
    { key: 'skills', label: 'Skills & Stack Marquee' },
    { key: 'experience', label: 'Work Experience Timeline' },
    { key: 'testimonials', label: 'Client Testimonials' },
    { key: 'contact', label: 'Contact Section & Form' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-display text-white mb-1">
          Visual Aesthetics, Colors & Magic UI FX
        </h3>
        <p className="text-xs text-slate-400">
          Customize neon colors, shooting star meteors, 3D cyber grid, and toggle section visibility.
        </p>
      </div>

      {/* Preset Themes */}
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-2">
          CURATED NEON PALETTES
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {themePresets.map((t) => {
            const isSelected = settings.accentTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setAccentTheme(t.id)}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                  isSelected
                    ? 'bg-white/15 border-white/40 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                  style={{ backgroundColor: t.color }}
                />
                <span className="text-xs font-semibold text-white truncate">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Builder */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono text-purple-400 font-bold uppercase">
            🎨 Custom Color Mixer
          </label>
          {settings.accentTheme === 'custom' && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              ACTIVE
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-slate-300 mb-1 font-mono">PRIMARY NEON GLOW</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customPrimary}
                onChange={(e) => setCustomPrimary(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={customPrimary}
                onChange={(e) => setCustomPrimary(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-300 mb-1 font-mono">ACCENT NEON GLOW</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customAccent}
                onChange={(e) => setCustomAccent(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={customAccent}
                onChange={(e) => setCustomAccent(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono text-white"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleApplyCustomColors}
          className="w-full py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg transition-transform hover:scale-[1.01]"
        >
          Apply Custom Colors
        </button>
      </div>

      {/* Magic UI Effects Toggles */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
          Magic UI & Crazy Effects
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Shooting Star Meteors */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-purple-400" />
              <div>
                <h5 className="text-xs font-bold text-white">Shooting Meteors</h5>
                <p className="text-[10px] text-slate-400">Animated star showers</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.showMeteors}
              onChange={(e) => {
                soundManager.playClick();
                updateSettings({ showMeteors: e.target.checked });
              }}
              className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
            />
          </div>

          {/* 3D Cyber Retro Grid */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-cyan-400" />
              <div>
                <h5 className="text-xs font-bold text-white">3D Retro Grid</h5>
                <p className="text-[10px] text-slate-400">Cyber perspective horizon</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.showRetroGrid}
              onChange={(e) => {
                soundManager.playClick();
                updateSettings({ showRetroGrid: e.target.checked });
              }}
              className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Sound Effects */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {settings.soundEffects ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <div>
                <h5 className="text-xs font-bold text-white">Audio Synthesis</h5>
                <p className="text-[10px] text-slate-400">Tactile UI micro-sounds</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEffects}
              onChange={(e) => {
                soundManager.playClick();
                updateSettings({ soundEffects: e.target.checked });
              }}
              className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Availability Pill */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-amber-400" />
              <div>
                <h5 className="text-xs font-bold text-white">Hero Status Pill</h5>
                <p className="text-[10px] text-slate-400">Availability badge</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.showAvailabilityBadge}
              onChange={(e) => {
                soundManager.playClick();
                updateSettings({ showAvailabilityBadge: e.target.checked });
              }}
              className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Section Visibility Toggles */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
          Section Display Toggles (Show / Hide)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sectionsList.map((sec) => (
            <label
              key={sec.key}
              className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.06] transition-colors"
            >
              <span className="text-xs text-slate-200">{sec.label}</span>
              <input
                type="checkbox"
                checked={settings.visibleSections[sec.key]}
                onChange={() => toggleSectionVisibility(sec.key)}
                className="w-4 h-4 rounded accent-purple-600"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
