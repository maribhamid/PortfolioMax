import React from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import {
  CursorStyle,
  Shape3D,
  ScrollIntensity,
  MotionEffectsConfig
} from '../../../types/portfolio';
import {
  MousePointer2,
  Magnet,
  SunMedium,
  Layers,
  Box,
  Scroll,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  Compass,
  Eye
} from 'lucide-react';
import { soundManager } from '../../../utils/audio';
import { MagneticButton } from '../../ui/MagneticButton';
import { Floating3DObject } from '../../ui/Floating3DObject';
import { defaultPortfolioData } from '../../../data/defaultData';

export const EffectsEditor: React.FC = () => {
  const { data, updateEffectsConfig, updateSettings } = usePortfolio();
  const effects = data.settings.effectsConfig || defaultPortfolioData.settings.effectsConfig!;
  const { customCursor, magneticButtons, cursorSpotlight, interactiveBackground, floating3D, scrollAnimations } = effects;

  const cursorStyles: { id: CursorStyle; label: string; desc: string; icon: string }[] = [
    { id: 'neon-ring', label: 'Neon Ring', desc: 'Trailing ring + sharp glow dot', icon: '⭕' },
    { id: 'cyber-crosshair', label: 'Cyber Reticle', desc: 'Sci-fi corner brackets & crosshair', icon: '🎯' },
    { id: 'glow-orb', label: 'Glow Orb', desc: 'Soft chromatic fluid blur aura', icon: '🔮' },
    { id: 'minimal-dot', label: 'Minimal Dot', desc: 'Sleek precision dot & expanding ring', icon: '⚪' },
  ];

  const shapes3D: { id: Shape3D; label: string; desc: string }[] = [
    { id: 'icosahedron', label: 'Icosahedron', desc: '20-face crystal polyhedron' },
    { id: 'cube', label: 'Hypercube', desc: 'Dual-frame tesseract cube' },
    { id: 'torus', label: 'Torus Ring', desc: 'Gyroscopic 3-axis orbital ring' },
  ];

  const scrollIntensities: { id: ScrollIntensity; label: string; desc: string }[] = [
    { id: 'subtle', label: 'Subtle', desc: 'Gentle fade & soft 15px slide' },
    { id: 'standard', label: 'Standard', desc: 'Balanced scale, slide & spring' },
    { id: 'energetic', label: 'Energetic', desc: '3D perspective tilt & blur-clear' },
  ];

  const handleResetDefaults = () => {
    soundManager.playSuccess();
    updateEffectsConfig(defaultPortfolioData.settings.effectsConfig!);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            MOTION & FX STUDIO
          </div>
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            Interactive Motion & Physics Controls
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Toggle, calibrate, and live-preview custom cursors, magnetic physics, 3D wireframes, and scroll animations.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset FX Defaults</span>
        </button>
      </div>

      {/* SECTION 1: CUSTOM CURSOR */}
      <div className="p-5 rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <MousePointer2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Custom Cursor Engine
                {customCursor.enabled ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                    OFF
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Smooth spring-physics cursor with interactive hover reactions and custom styles.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={customCursor.enabled}
              onChange={(e) => {
                soundManager.playClick();
                updateEffectsConfig({
                  customCursor: { ...customCursor, enabled: e.target.checked },
                });
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {customCursor.enabled && (
          <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-white/5">
            {/* Style Selector */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Cursor Visual Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {cursorStyles.map((item) => {
                  const isSelected = customCursor.style === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundManager.playClick();
                        updateEffectsConfig({
                          customCursor: { ...customCursor, style: item.id },
                        });
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 shadow-sm ring-1 ring-purple-500/50'
                          : 'bg-slate-50/70 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/5 border-slate-200 dark:border-white/10'
                      }`}
                    >
                      <div className="text-xl mb-1.5">{item.icon}</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {item.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sliders: Size & Glow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                    CURSOR SIZE
                  </label>
                  <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                    {customCursor.size}px
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="2"
                  value={customCursor.size}
                  onChange={(e) =>
                    updateEffectsConfig({
                      customCursor: { ...customCursor, size: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                    GLOW INTENSITY
                  </label>
                  <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                    {Math.round(customCursor.glowIntensity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={customCursor.glowIntensity}
                  onChange={(e) =>
                    updateEffectsConfig({
                      customCursor: { ...customCursor, glowIntensity: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: MAGNETIC BUTTONS */}
      <div className="p-5 rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Magnet className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Magnetic Buttons Physics
                {magneticButtons.enabled ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ENABLED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                    DISABLED
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Spring physics pull buttons toward the cursor when hovering near them.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={magneticButtons.enabled}
              onChange={(e) => {
                soundManager.playClick();
                updateEffectsConfig({
                  magneticButtons: { ...magneticButtons, enabled: e.target.checked },
                });
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
          </label>
        </div>

        {magneticButtons.enabled && (
          <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                    MAGNETIC PULL STRENGTH
                  </label>
                  <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {magneticButtons.strength <= 0.2
                      ? 'Gentle (0.2)'
                      : magneticButtons.strength <= 0.4
                      ? 'Standard (0.35)'
                      : 'Ultra-Magnetic (0.55)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.6"
                  step="0.05"
                  value={magneticButtons.strength}
                  onChange={(e) =>
                    updateEffectsConfig({
                      magneticButtons: { ...magneticButtons, strength: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>0.1 (Subtle)</span>
                  <span>0.35 (Ideal)</span>
                  <span>0.60 (High Magnetism)</span>
                </div>
              </div>

              {/* Interactive Test Button */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center gap-2">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">
                  Live Magnetic Feel Tester
                </span>
                <MagneticButton
                  onClick={() => soundManager.playSuccess()}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 shadow-md hover:shadow-cyan-500/25 transition-shadow"
                >
                  <span className="flex items-center gap-1.5">
                    <Magnet className="w-3.5 h-3.5" />
                    Hover Over Me
                  </span>
                </MagneticButton>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: CURSOR SPOTLIGHT */}
      <div className="p-5 rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <SunMedium className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Cursor Spotlight Aura
                {cursorSpotlight.enabled ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ENABLED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                    DISABLED
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Smooth radial flashlight aura that trails cursor to illuminate cards and grids.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={cursorSpotlight.enabled}
              onChange={(e) => {
                soundManager.playClick();
                updateEffectsConfig({
                  cursorSpotlight: { ...cursorSpotlight, enabled: e.target.checked },
                });
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {cursorSpotlight.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-white/5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                  SPOTLIGHT RADIUS
                </label>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  {cursorSpotlight.radius}px
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="800"
                step="25"
                value={cursorSpotlight.radius}
                onChange={(e) =>
                  updateEffectsConfig({
                    cursorSpotlight: { ...cursorSpotlight, radius: Number(e.target.value) },
                  })
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                  AURA OPACITY
                </label>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  {Math.round(cursorSpotlight.opacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.01"
                value={cursorSpotlight.opacity}
                onChange={(e) =>
                  updateEffectsConfig({
                    cursorSpotlight: { ...cursorSpotlight, opacity: Number(e.target.value) },
                  })
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: FLOATING 3D OBJECT */}
      <div className="p-5 rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 dark:bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
              <Box className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Floating 3D Holographic Object
                {floating3D.enabled ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ENABLED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                    DISABLED
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dynamic 3D geometric wireframe that reacts to cursor position in the Hero section.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={floating3D.enabled}
              onChange={(e) => {
                soundManager.playClick();
                updateEffectsConfig({
                  floating3D: { ...floating3D, enabled: e.target.checked },
                });
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
          </label>
        </div>

        {floating3D.enabled && (
          <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Controls */}
              <div className="lg:col-span-8 space-y-4">
                {/* Shape Selector */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Geometric Shape
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {shapes3D.map((s) => {
                      const isSelected = floating3D.shape === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            soundManager.playClick();
                            updateEffectsConfig({
                              floating3D: { ...floating3D, shape: s.id },
                            });
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-500 shadow-sm ring-1 ring-pink-500/50'
                              : 'bg-slate-50/70 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/5 border-slate-200 dark:border-white/10'
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {s.label}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {s.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Speed & Scale Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                        ROTATION SPEED
                      </label>
                      <span className="text-xs font-mono font-bold text-pink-600 dark:text-pink-400">
                        {floating3D.speed}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.2"
                      value={floating3D.speed}
                      onChange={(e) =>
                        updateEffectsConfig({
                          floating3D: { ...floating3D, speed: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-pink-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                        OBJECT SCALE
                      </label>
                      <span className="text-xs font-mono font-bold text-pink-600 dark:text-pink-400">
                        {Math.round(floating3D.scale * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="1.5"
                      step="0.05"
                      value={floating3D.scale}
                      onChange={(e) =>
                        updateEffectsConfig({
                          floating3D: { ...floating3D, scale: Number(e.target.value) },
                        })
                      }
                      className="w-full accent-pink-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Live 3D Preview Box */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 dark:bg-black/70 border border-slate-800 dark:border-white/10 shadow-inner">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1">
                  Live 3D Hologram Preview
                </span>
                <Floating3DObject size={180} />
                <span className="text-[10px] font-mono text-slate-400 text-center">
                  Moves with cursor tilt
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: INTERACTIVE BACKGROUND ENGINE */}
      <div className="p-5 rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Interactive Background Canvas Engine
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure constellation particles, shooting meteors, and 3D cyber retro grid.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
          {/* Particles */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-500" />
                Particles
              </span>
              <input
                type="checkbox"
                checked={interactiveBackground.particles}
                onChange={(e) => {
                  soundManager.playClick();
                  updateEffectsConfig({
                    interactiveBackground: { ...interactiveBackground, particles: e.target.checked },
                  });
                }}
                className="w-4 h-4 accent-purple-600 cursor-pointer"
              />
            </div>
            {interactiveBackground.particles && (
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500">DENSITY</label>
                <select
                  value={interactiveBackground.particleDensity}
                  onChange={(e) => {
                    const density = e.target.value as 'low' | 'medium' | 'high' | 'off';
                    updateEffectsConfig({
                      interactiveBackground: { ...interactiveBackground, particleDensity: density },
                    });
                    updateSettings({ particleDensity: density });
                  }}
                  className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white font-mono"
                >
                  <option value="low">Low (35 pts)</option>
                  <option value="medium">Medium (55 pts)</option>
                  <option value="high">High (90 pts)</option>
                </select>
              </div>
            )}
          </div>

          {/* 3D Retro Grid */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-500" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  3D Retro Grid
                </span>
                <span className="text-[10px] text-slate-500">Cyber perspective plane</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={interactiveBackground.retroGrid}
              onChange={(e) => {
                soundManager.playClick();
                updateEffectsConfig({
                  interactiveBackground: { ...interactiveBackground, retroGrid: e.target.checked },
                });
                updateSettings({ showRetroGrid: e.target.checked });
              }}
              className="w-4 h-4 accent-cyan-600 cursor-pointer"
            />
          </div>

          {/* Meteors */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Meteors Shower
                </span>
                <span className="text-[10px] text-slate-500">Shooting stars</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={interactiveBackground.meteors}
              onChange={(e) => {
                soundManager.playClick();
                updateEffectsConfig({
                  interactiveBackground: { ...interactiveBackground, meteors: e.target.checked },
                });
                updateSettings({ showMeteors: e.target.checked });
              }}
              className="w-4 h-4 accent-rose-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* SECTION 6: SCROLL-DRIVEN ANIMATIONS */}
      <div className="p-5 rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
              <Scroll className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Scroll-Driven Animations
                {scrollAnimations.enabled ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                    OFF
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Orchestrates viewport scroll entrances across cards, headlines, and showcases.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={scrollAnimations.enabled}
              onChange={(e) => {
                soundManager.playClick();
                updateEffectsConfig({
                  scrollAnimations: { ...scrollAnimations, enabled: e.target.checked },
                });
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>

        {scrollAnimations.enabled && (
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Animation Curve & Intensity
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {scrollIntensities.map((item) => {
                const isSelected = scrollAnimations.intensity === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundManager.playClick();
                      updateEffectsConfig({
                        scrollAnimations: { ...scrollAnimations, intensity: item.id },
                      });
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 shadow-sm ring-1 ring-teal-500/50'
                        : 'bg-slate-50/70 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/5 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
