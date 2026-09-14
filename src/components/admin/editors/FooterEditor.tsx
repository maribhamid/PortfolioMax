import React from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';

export const FooterEditor: React.FC = () => {
  const { data, updateFooter } = usePortfolio();
  const { footer } = data;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-display text-white mb-1">
          Footer & Live Clock Settings
        </h3>
        <p className="text-xs text-slate-400">
          Configure footer branding, live clock timezone city, system status, and copyright text.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">
            BRAND INITIALS / LOGO TEXT
          </label>
          <input
            type="text"
            value={footer.brandText}
            onChange={(e) => updateFooter({ brandText: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">
            TIMEZONE CITY NAME (FOR LIVE CLOCK)
          </label>
          <input
            type="text"
            placeholder="e.g. San Francisco, London, New York"
            value={footer.timezoneCity}
            onChange={(e) => updateFooter({ timezoneCity: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">
            SYSTEM STATUS PILL TEXT
          </label>
          <input
            type="text"
            value={footer.statusText}
            onChange={(e) => updateFooter({ statusText: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">
            COPYRIGHT NOTICE
          </label>
          <input
            type="text"
            value={footer.copyrightText}
            onChange={(e) => updateFooter({ copyrightText: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">
          CREDIT LINE / BADGE
        </label>
        <input
          type="text"
          value={footer.creditText}
          onChange={(e) => updateFooter({ creditText: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
        />
      </div>
    </div>
  );
};
