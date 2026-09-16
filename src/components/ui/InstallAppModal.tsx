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
            {/* Method 1: Direct Profile Install */}
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Option 1: Direct 1-Tap iOS Install (.mobileconfig)
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Installs Marib Portfolio directly onto your iOS home screen as a standalone full-screen app. No Mac or App Store needed.
                </p>
              </div>

              <a
                href="/Marib-Portfolio.mobileconfig"
                download="Marib-Portfolio.mobileconfig"
                onClick={() => soundManager.playClick()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30"
              >
                <Download className="w-4 h-4" />
                <span>Download iOS App Profile (.mobileconfig)</span>
              </a>

              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-purple-300">How to install on iPhone:</p>
                <p>1. Tap the button above to download the profile in Safari.</p>
                <p>2. Open iPhone <strong>Settings</strong> &gt; tap <strong>Profile Downloaded</strong> (or General &gt; VPN &amp; Device Management).</p>
                <p>3. Tap <strong>Install</strong> in the top-right corner. The app icon appears on your home screen!</p>
              </div>
            </div>

            {/* Method 2: Safari Add to Home Screen */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/10 space-y-2.5">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-cyan-400" />
                Option 2: Instant Safari "Add to Home Screen"
              </h4>
              <p className="text-xs text-slate-400">
                In Safari on your iPhone, tap the <strong>Share</strong> button (box with up arrow), scroll down, and tap <strong>Add to Home Screen</strong>.
              </p>
            </div>

            {/* Method 3: Native IPA Package via GitHub Actions */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/10 space-y-2.5">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Option 3: Native iOS IPA Package (AltStore / Sideloadly)
              </h4>
              <p className="text-xs text-slate-400">
                GitHub Actions automatically builds the compiled native Xcode <code className="text-emerald-400">Marib-Portfolio.ipa</code> package on macOS runners.
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