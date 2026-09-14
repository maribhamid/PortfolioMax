import React, { useState, useRef } from 'react';
import { Upload, Link2, Image, Trash2, CheckCircle2, HardDrive, Sparkles } from 'lucide-react';
import { formatGoogleDriveUrl, readFileAsDataUrl } from '../../../utils/driveHelper';
import { soundManager } from '../../../utils/audio';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  description?: string;
  aspectRatio?: 'square' | 'video' | 'any';
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://... or Google Drive link',
  description = 'Upload an image directly from your local hard drive or paste a Google Drive / web link.',
  aspectRatio = 'square',
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle local drive file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
      soundManager.playSuccess();
      setStatusMessage(`Loaded "${file.name}" (${Math.round(file.size / 1024)} KB)`);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error('Failed to read image from drive:', err);
      soundManager.playClick();
    }
  };

  // Handle URL or Google Drive link change
  const handleUrlChange = (val: string) => {
    setUrlInput(val);
    const formatted = formatGoogleDriveUrl(val, 'image');
    onChange(formatted);
  };

  const handleClear = () => {
    soundManager.playClick();
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isDataUrl = value && value.startsWith('data:');
  const isGoogleDrive = value && (value.includes('googleusercontent.com') || value.includes('drive.google.com'));

  return (
    <div className="space-y-2.5 p-3.5 sm:p-4 rounded-2xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          {label}
        </label>
        
        {/* Toggle between Local Drive upload and Cloud URL */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-200/80 dark:bg-white/10 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
              activeMode === 'upload'
                ? 'bg-white dark:bg-black/60 text-purple-600 dark:text-purple-300 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HardDrive className="w-3 h-3" />
            <span>Local Drive</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
              activeMode === 'url'
                ? 'bg-white dark:bg-black/60 text-purple-600 dark:text-purple-300 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Link2 className="w-3 h-3" />
            <span>Google Drive / URL</span>
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
        {description}
      </p>

      {/* Upload Mode: File input from Hard Drive */}
      {activeMode === 'upload' ? (
        <div className="space-y-2">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-purple-500 dark:hover:border-purple-400 rounded-xl p-4 cursor-pointer bg-white/70 dark:bg-black/30 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all group">
            <Upload className="w-6 h-6 text-slate-400 group-hover:text-purple-500 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-300">
              {value ? 'Replace Image from Drive' : 'Choose Image from Hard Drive'}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              PNG, JPG, WebP, GIF, SVG (embedded directly into state)
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        /* URL Mode: Web URL or Google Drive Link */
        <div className="space-y-1.5">
          <div className="relative">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-white dark:bg-black/50 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all pr-8"
            />
            {urlInput && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                title="Clear input"
              >
                ✕
              </button>
            )}
          </div>
          {urlInput.includes('drive.google.com') && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
              <Sparkles className="w-3 h-3" />
              <span>Auto-converted Google Drive share link into direct CDN image URL!</span>
            </div>
          )}
        </div>
      )}

      {/* Live Status notification */}
      {statusMessage && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Live Preview Thumbnail & Removal */}
      {value && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`overflow-hidden rounded-lg border border-slate-200 dark:border-white/20 bg-slate-100 dark:bg-black shrink-0 ${
                aspectRatio === 'video' ? 'w-16 h-10' : 'w-10 h-10'
              }`}
            >
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80';
                }}
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1.5">
                <span>Active Image</span>
                {isDataUrl && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold border border-purple-500/20">
                    LOCAL DRIVE
                  </span>
                )}
                {isGoogleDrive && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20">
                    G-DRIVE
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[200px] sm:max-w-xs font-mono">
                {value.startsWith('data:') ? `Base64 Data URI (${Math.round(value.length / 1024)} KB)` : value}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
            title="Remove active image"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      )}
    </div>
  );
};
