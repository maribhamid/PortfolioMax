import React from 'react';
import {
  Sliders,
  ZoomIn,
  Move,
  Sun,
  Contrast,
  Palette,
  RotateCcw,
  Sparkles,
  Check,
  Eye
} from 'lucide-react';
import { AvatarAdjustments } from '../../../types/portfolio';
import { soundManager } from '../../../utils/audio';

interface AvatarAdjusterProps {
  avatarUrl: string;
  adjustments?: AvatarAdjustments;
  onChange: (adjustments: AvatarAdjustments) => void;
}

const defaultAdjustments: AvatarAdjustments = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  shape: 'squircle',
};

export const AvatarAdjuster: React.FC<AvatarAdjusterProps> = ({
  avatarUrl,
  adjustments = defaultAdjustments,
  onChange,
}) => {
  const current = { ...defaultAdjustments, ...(adjustments || {}) };

  const update = (partial: Partial<AvatarAdjustments>) => {
    onChange({ ...current, ...partial });
  };

  const handleReset = () => {
    soundManager.playClick();
    onChange(defaultAdjustments);
  };

  const applyPreset = (presetName: 'natural' | 'vibrant' | 'noir' | 'bright') => {
    soundManager.playClick();
    if (presetName === 'natural') {
      update({ brightness: 100, contrast: 100, saturation: 100 });
    } else if (presetName === 'vibrant') {
      update({ brightness: 105, contrast: 110, saturation: 135 });
    } else if (presetName === 'noir') {
      update({ brightness: 100, contrast: 120, saturation: 0 });
    } else if (presetName === 'bright') {
      update({ brightness: 115, contrast: 95, saturation: 105 });
    }
  };

  // Compute CSS styles from adjustments
  const previewStyle: React.CSSProperties = {
    transform: `scale(${current.scale ?? 1}) translate(${current.offsetX ?? 0}%, ${current.offsetY ?? 0}%)`,
    filter: `brightness(${(current.brightness ?? 100) / 100}) contrast(${(current.contrast ?? 100) / 100}) saturate(${(current.saturation ?? 100) / 100})`,
    transformOrigin: 'center center',
    transition: 'transform 0.1s ease-out, filter 0.1s ease-out',
  };

  const getShapeClasses = (shape?: string) => {
    if (shape === 'circle') return 'rounded-full';
    if (shape === 'rounded') return 'rounded-lg';
    return 'rounded-2xl'; // squircle
  };

  if (!avatarUrl) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Profile Picture Studio & Live Adjuster
          </h4>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-lg transition-colors"
          title="Reset adjustments to default"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Workspace: Live Preview on left/top, sliders on right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Dual Live Previews */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-3">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
            <Eye className="w-3.5 h-3.5 text-purple-500" />
            <span>LIVE COMPONENT PREVIEWS</span>
          </div>

          <div className="flex items-center justify-center gap-4">
            {/* Card Preview (Hero appearance) */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-24 h-32 overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-purple-500/40 shadow-md ${getShapeClasses(
                  current.shape
                )}`}
              >
                <img
                  src={avatarUrl}
                  alt="Hero Preview"
                  style={previewStyle}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400">Hero Card</span>
            </div>

            {/* Circle Preview (Header / Monogram appearance) */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-cyan-500/40 shadow-md">
                <img
                  src={avatarUrl}
                  alt="Header Preview"
                  style={previewStyle}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400">Header Icon</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="w-full pt-2 border-t border-slate-200 dark:border-white/10">
            <span className="text-[10px] font-mono text-slate-400 block mb-1.5 text-center">
              AESTHETIC PRESETS:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => applyPreset('natural')}
                className="px-2 py-1 rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-500 text-slate-700 dark:text-slate-300 font-medium text-center transition-colors"
              >
                Natural
              </button>
              <button
                type="button"
                onClick={() => applyPreset('vibrant')}
                className="px-2 py-1 rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-500 text-purple-600 dark:text-purple-300 font-medium text-center transition-colors"
              >
                Vibrant
              </button>
              <button
                type="button"
                onClick={() => applyPreset('noir')}
                className="px-2 py-1 rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-500 text-slate-700 dark:text-slate-300 font-medium text-center transition-colors"
              >
                Cyber Noir
              </button>
              <button
                type="button"
                onClick={() => applyPreset('bright')}
                className="px-2 py-1 rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-500 text-slate-700 dark:text-slate-300 font-medium text-center transition-colors"
              >
                Bright Glow
              </button>
            </div>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="md:col-span-7 space-y-3.5">
          {/* Zoom / Scale */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-1">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1 font-semibold">
                <ZoomIn className="w-3.5 h-3.5 text-purple-500" />
                <span>Zoom & Crop</span>
              </span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">
                {(current.scale ?? 1).toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="2.5"
              step="0.05"
              value={current.scale ?? 1}
              onChange={(e) => update({ scale: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          {/* Position Y (Vertical Pan) */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-1">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1 font-semibold">
                <Move className="w-3.5 h-3.5 text-cyan-500" />
                <span>Vertical Position (Pan Up/Down)</span>
              </span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                {current.offsetY ?? 0}%
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="1"
              value={current.offsetY ?? 0}
              onChange={(e) => update({ offsetY: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Position X (Horizontal Pan) */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-1">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1 font-semibold">
                <Move className="w-3.5 h-3.5 text-indigo-500" />
                <span>Horizontal Position (Pan Left/Right)</span>
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                {current.offsetX ?? 0}%
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="1"
              value={current.offsetX ?? 0}
              onChange={(e) => update({ offsetX: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Brightness */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-1">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1 font-semibold">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Brightness</span>
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                {current.brightness ?? 100}%
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="140"
              step="2"
              value={current.brightness ?? 100}
              onChange={(e) => update({ brightness: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Contrast */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-1">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1 font-semibold">
                <Contrast className="w-3.5 h-3.5 text-blue-500" />
                <span>Contrast</span>
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {current.contrast ?? 100}%
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="140"
              step="2"
              value={current.contrast ?? 100}
              onChange={(e) => update({ contrast: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Color Saturation */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-1">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1 font-semibold">
                <Palette className="w-3.5 h-3.5 text-pink-500" />
                <span>Color Saturation (0% = Black & White)</span>
              </span>
              <span className="text-pink-600 dark:text-pink-400 font-bold">
                {current.saturation ?? 100}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={current.saturation ?? 100}
              onChange={(e) => update({ saturation: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
