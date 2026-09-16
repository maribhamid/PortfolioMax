import React, { useState } from 'react';
import { Modal } from './Modal';
import { Smartphone, Apple, Download, Share2, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>('ios');
  const [appUrl, setAppUrl] = useState(() => (typeof window !== 'undefined' ? window.location.origin : 'https://portfoliomax.vercel.app'));
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadProfile = async () => {
    soundManager.playClick();
    setIsGenerating(true);
    try {
      const res = await fetch('/Marib-Portfolio.mobileconfig');
      let configText = await res.text();
      const targetUrl = appUrl.trim() || (typeof window !== 'undefined' ? window.location.origin : 'https://portfoliomax.vercel.app');
      
      // Dynamically inject the exact current domain/URL
      configText = configText.replace(
        /<key>URL<\/key>\s*<string>[^<]*<\/string>/,
        `<key>URL</key>\n            <string>${targetUrl}</string>`
      );

      const blob = new Blob([configText], { type: 'application/x-apple-aspen-config' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Marib-Portfolio.mobileconfig';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.location.href = '/Marib-Portfolio.mobileconfig';
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Install Native Mobile App" maxWidth="max-w-xl">
      <div className="space-y-6">
        {/* Platform Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/60 border border-white/10">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('ios');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ios'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>Apple iOS (iPhone / iPad)</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('android');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'android'
                ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android (APK)</span>
          </button>
        </div>

        {/* iOS Content */}
        {activeTab === 'ios' && (
          <div className="space-y-4">
            {/* Method 1: Instant Safari Add to Home Screen (RECOMMENDED) */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  Option 1: Safari "Add to Home Screen" (Recommended)
                </h4>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                  100% Identical to WebApp
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Installs this exact portfolio &amp; Admin Suite as a standalone iOS app on your home screen with zero browser bars:
              </p>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-300 space-y-1.5">
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[11px] font-bold shrink-0">1</span>
                  <span>In Safari on iPhone, tap the <strong>Share</strong> button (square with arrow pointing up).</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[11px] font-bold shrink-0">2</span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[11px] font-bold shrink-0">3</span>
                  <span>Tap <strong>Add</strong> in the top right. It installs directly to your home screen!</span>
                </p>
              </div>
            </div>

            {/* Method 2: Direct iOS Profile Install (.mobileconfig) */}
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Option 2: Direct iOS Profile Download (.mobileconfig)
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Generates an Apple Configuration Profile that pins your live portfolio app to your iPhone home screen.
                </p>
              </div>

              {/* URL Confirmation Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">
                  Target App URL:
                </label>
                <input
                  type="url"
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs font-mono text-purple-200 focus:outline-none focus:border-purple-500"
                  placeholder="https://your-domain.vercel.app"
                />
              </div>

              <button
                onClick={handleDownloadProfile}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isGenerating ? 'Generating Profile...' : 'Download iOS Profile (.mobileconfig)'}</span>
              </button>

              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-purple-300">How to install profile on iPhone:</p>
                <p>1. Tap download above in Safari and tap <strong>Allow</strong>.</p>
                <p>2. Open iPhone <strong>Settings</strong> &gt; tap <strong>Profile Downloaded</strong> (at the top).</p>
                <p>3. Tap <strong>Install</strong> in the top-right corner.</p>
              </div>
            </div>

            {/* Method 3: Native IPA Package via GitHub Actions */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/10 space-y-2.5">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Option 3: Native iOS IPA Package (Xcode / AltStore / Sideloadly)
              </h4>
              <p className="text-xs text-slate-400">
                GitHub Actions automatically compiles the native Xcode <code className="text-emerald-400">Marib-Portfolio.ipa</code> on macOS cloud runners.
              </p>
              <a
                href="https://github.com/maribhamid/PortfolioMax/actions"
                target="_blank"
                rel="noreferrer"
                onClick={() => soundManager.playClick()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <span>View GitHub Actions iOS IPA Artifacts</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Android Content */}
        {activeTab === 'android' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Direct Android APK Download (4.60 MB)
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Full native Android application with dark splash screen, native status bar tinting, offline support, and push notifications.
                </p>
              </div>

              <a
                href="/Marib-Portfolio.apk"
                download="Marib-Portfolio.apk"
                onClick={() => soundManager.playClick()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
              >
                <Download className="w-4 h-4" />
                <span>Download Marib-Portfolio.apk (4.60 MB)</span>
              </a>

              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-emerald-300">How to install on Android:</p>
                <p>1. Tap the download button above.</p>
                <p>2. Open the downloaded file from your Notifications or Downloads folder.</p>
                <p>3. Tap <strong>Install</strong>. If prompted, allow installations from unknown sources.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};