import React, { useState } from 'react';
import { Modal } from './Modal';
import {
  Smartphone,
  Apple,
  Monitor,
  Download,
  Share2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  HardDrive,
  Copy,
  Check
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>('android');
  const [appUrl, setAppUrl] = useState(() =>
    typeof window !== 'undefined' ? window.location.origin : 'https://portfoliomax.vercel.app'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleDownloadProfile = async () => {
    soundManager.playClick();
    setIsGenerating(true);
    try {
      const res = await fetch('/Marib-Portfolio.mobileconfig');
      let configText = await res.text();
      const targetUrl =
        appUrl.trim() ||
        (typeof window !== 'undefined' ? window.location.origin : 'https://portfoliomax.vercel.app');

      // Dynamically inject current URL
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

  const handleCopyCli = () => {
    navigator.clipboard.writeText('git clone https://github.com/maribhamid/PortfolioMax.git && npm install && npm run electron:dev');
    setCopiedCode(true);
    soundManager.playSuccess();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Download & Install Application"
      subtitle="Select your platform for the full standalone experience"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Platform Selector Tabs (Sticky at top) */}
        <div className="sticky top-0 z-20 -mt-1 pt-1 pb-2 bg-slate-900/95 dark:bg-[#0c0e17]/95 backdrop-blur-md">
          <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-950/90 border border-white/10 shadow-lg">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('android');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'android'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="truncate">Android APK</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('ios');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ios'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span className="truncate">Apple iOS</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('desktop');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'desktop'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="truncate">Desktop (Windows)</span>
          </button>
        </div>
        </div>

        {/* ================= ANDROID TAB ================= */}
        {activeTab === 'android' && (
          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-emerald-400" />
                      Direct Android APK Package
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      v1.0.0
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Native Android release package with splash screen, edge-to-edge rendering, offline caching, and real-time Firestore synchronization.
                  </p>
                </div>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Real-time CMS Sync
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Offline Caching
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Android 8.0 to 15+
                </span>
              </div>

              {/* Download APK Button */}
              <a
                href="/Marib-Portfolio.apk"
                download="Marib-Portfolio.apk"
                onClick={() => soundManager.playClick()}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Download Marib-Portfolio.apk (9.2 MB)</span>
              </a>

              {/* 3-Step Install Guide */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <p className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Installation Guide:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="font-bold text-emerald-400 mr-1.5">1.</span>
                    Tap the download button above.
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="font-bold text-emerald-400 mr-1.5">2.</span>
                    Open the file from Downloads.
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="font-bold text-emerald-400 mr-1.5">3.</span>
                    Allow install from source & tap Install.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= APPLE iOS TAB ================= */}
        {activeTab === 'ios' && (
          <div className="space-y-4">
            {/* Option 1: Safari Add to Home Screen */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-purple-400" />
                  Option 1: Safari "Add to Home Screen" (Recommended)
                </h4>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                  Instant Standalone
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Installs this exact portfolio as a standalone iOS app on your iPhone or iPad with zero browser address bars and native gestures:
              </p>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[11px] font-bold shrink-0">1</span>
                  <span>In Safari on iPhone, tap the <strong>Share</strong> button (box with upward arrow).</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[11px] font-bold shrink-0">2</span>
                  <span>Scroll down the action sheet and tap <strong>Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[11px] font-bold shrink-0">3</span>
                  <span>Tap <strong>Add</strong> at top right. Launch anytime from your iPhone home screen!</span>
                </div>
              </div>
            </div>

            {/* Option 2: Direct Apple Configuration Profile */}
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Option 2: Apple Configuration Profile (.mobileconfig)
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Pins the web app directly to iOS via official Apple WebClip profile configuration.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">
                  Target App URL:
                </label>
                <input
                  type="url"
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-indigo-200 focus:outline-none focus:border-indigo-500"
                  placeholder="https://your-domain.vercel.app"
                />
              </div>

              <button
                onClick={handleDownloadProfile}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isGenerating ? 'Generating Profile...' : 'Download iOS Profile (.mobileconfig)'}</span>
              </button>
            </div>

            {/* Option 3: GitHub Actions Native IPA Workflow */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Option 3: Xcode IPA Artifacts (AltStore / Sideloadly)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                GitHub Actions automatically builds native Xcode IPA archives on macOS cloud runners for developer sideloading.
              </p>
              <a
                href="https://github.com/maribhamid/PortfolioMax/actions"
                target="_blank"
                rel="noreferrer"
                onClick={() => soundManager.playClick()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-1"
              >
                <span>View GitHub Actions Cloud IPA Artifacts</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* ================= DESKTOP TAB ================= */}
        {activeTab === 'desktop' && (
          <div className="space-y-4">
            {/* Windows Setup Installer */}
            <div className="p-4 sm:p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-cyan-400" />
                      Windows Desktop Setup Installer
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      Windows 64-bit
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Official desktop release with custom titlebar, system tray minimization, native push alerts, offline support, and full Admin Studio access.
                  </p>
                </div>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-cyan-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Desktop Titlebar & Tray
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-cyan-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Full Offline Mode
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-cyan-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Real-time Cloud Sync
                </span>
              </div>

              {/* Download Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://github.com/maribhamid/PortfolioMax/releases/download/v1.0.0/Marib-Portfolio-Setup.exe"
                  download="Marib-Portfolio-Setup.exe"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-600/30 cursor-pointer active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Setup.exe (151 MB)</span>
                </a>

                <a
                  href="https://github.com/maribhamid/PortfolioMax/releases/download/v1.0.0/Marib-Portfolio-Portable.exe"
                  download="Marib-Portfolio-Portable.exe"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/15 cursor-pointer active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Portable Executable (.exe)</span>
                </a>
              </div>
            </div>

            {/* Cross-Platform Developer CLI for Mac / Linux */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  macOS & Linux Developer Command
                </h4>
                <button
                  onClick={handleCopyCli}
                  className="text-[11px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto select-all">
                npm run electron:dev
              </div>
              <p className="text-[11px] text-slate-400">
                To run on macOS or Linux, clone repository and run the Electron desktop runtime command.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};