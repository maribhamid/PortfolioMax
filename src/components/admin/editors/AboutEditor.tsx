import React from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';

export const AboutEditor: React.FC = () => {
  const { data, updateAbout } = usePortfolio();
  const { about } = data;

  const handleHighlightChange = (index: number, field: string, value: string) => {
    const newHighlights = [...about.highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    updateAbout({ highlights: newHighlights });
  };

  const handleTerminalOutputsChange = (text: string) => {
    const lines = text.split('\n').filter(Boolean);
    updateAbout({ terminalOutputs: lines });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-display text-white mb-1">
          About & Philosophy Section Manager
        </h3>
        <p className="text-xs text-slate-400">
          Customize titles, mission story, developer terminal text, and bento highlights.
        </p>
      </div>

      {/* Header Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">SECTION BADGE</label>
          <input
            type="text"
            value={about.badge}
            onChange={(e) => updateAbout({ badge: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">MISSION BADGE</label>
          <input
            type="text"
            value={about.missionBadge}
            onChange={(e) => updateAbout({ missionBadge: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">SECTION TITLE</label>
        <input
          type="text"
          value={about.title}
          onChange={(e) => updateAbout({ title: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white"
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">SECTION SUBTITLE</label>
        <input
          type="text"
          value={about.subtitle}
          onChange={(e) => updateAbout({ subtitle: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
        />
      </div>

      {/* Main Story */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <h4 className="text-xs font-mono text-purple-400 uppercase tracking-wider">
          Story & Origin Details
        </h4>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">STORY HEADLINE</label>
          <input
            type="text"
            value={about.storyHeading}
            onChange={(e) => updateAbout({ storyHeading: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">PARAGRAPH 1</label>
          <textarea
            rows={2}
            value={about.storyParagraph1}
            onChange={(e) => updateAbout({ storyParagraph1: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">PARAGRAPH 2</label>
          <textarea
            rows={2}
            value={about.storyParagraph2}
            onChange={(e) => updateAbout({ storyParagraph2: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
          />
        </div>
      </div>

      {/* Terminal Simulation */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
          Developer Terminal Simulation
        </h4>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">COMMAND LINE</label>
          <input
            type="text"
            value={about.terminalCmd}
            onChange={(e) => updateAbout({ terminalCmd: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">
            OUTPUT LINES (ONE PER LINE)
          </label>
          <textarea
            rows={3}
            value={about.terminalOutputs.join('\n')}
            onChange={(e) => handleTerminalOutputsChange(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-white"
          />
        </div>
      </div>

      {/* Highlight Cards */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <h4 className="text-xs font-mono text-purple-400 uppercase tracking-wider">
          Highlight Cards (4-Pack)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {about.highlights.map((h, idx) => (
            <div key={h.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
              <input
                type="text"
                value={h.title}
                onChange={(e) => handleHighlightChange(idx, 'title', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs font-bold text-white"
                placeholder="Card Title"
              />
              <textarea
                rows={2}
                value={h.desc}
                onChange={(e) => handleHighlightChange(idx, 'desc', e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-[11px] text-slate-300"
                placeholder="Card Description"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
