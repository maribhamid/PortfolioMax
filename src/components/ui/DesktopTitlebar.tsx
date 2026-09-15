import React, { useEffect, useState } from 'react';
import { Minus, Square, Copy, X, Sparkles, Terminal } from 'lucide-react';

export const DesktopTitlebar: React.FC = () => {
  const [isElectron, setIsElectron] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI?.isElectron) {
      setIsElectron(true);
      window.electronAPI.isMaximized().then(setIsMaximized).catch(() => {});
    }
  }, []);

  if (!isElectron || !window.electronAPI) {
    return null;
  }

  const handleMinimize = () => {
    window.electronAPI?.minimize();
  };

  const handleMaximize = async () => {
    window.electronAPI?.maximize();
    const max = await window.electronAPI?.isMaximized();
    setIsMaximized(!!max);
  };

  const handleClose = () => {
    window.electronAPI?.close();
  };

  return (
    <header
      className="h-9 w-full bg-[#07090e]/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-3 select-none z-[9999] fixed top-0 left-0 right-0 text-xs text-slate-400"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Left: App Title & Status */}
      <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <div className="w-5 h-5 rounded-md bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <Terminal className="w-3 h-3" />
        </div>
        <span className="font-medium text-[11px] text-slate-200 tracking-wide font-mono">
          Portfolio Studio
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Desktop App
        </span>
      </div>

      {/* Center: Window Drag Prompt */}
      <div className="text-[10px] font-mono text-slate-500 hidden md:block">
        Marib Hamid — Full-Stack Developer & AI Systems
      </div>

      {/* Right: Window Controls */}
      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          onClick={handleMinimize}
          className="w-7 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Minimize"
        >
          <Minus className="w-3 h-3" />
        </button>

        <button
          onClick={handleMaximize}
          className="w-7 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title={isMaximized ? 'Restore' : 'Maximize'}
        >
          {isMaximized ? <Copy className="w-2.5 h-2.5" /> : <Square className="w-2.5 h-2.5" />}
        </button>

        <button
          onClick={handleClose}
          className="w-7 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-600 transition-colors"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
