import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sliders,
  Sparkles,
  Layers,
  Code2,
  Briefcase,
  Star,
  Palette,
  Mail,
  Anchor,
  Columns,
  BookOpen,
  FileText,
  LogOut,
  ShieldCheck,
  Cloud,
  CloudUpload,
  DatabaseZap,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { HeroEditor } from './editors/HeroEditor';
import { ResumeEditor } from './editors/ResumeEditor';
import { AboutEditor } from './editors/AboutEditor';
import { ProjectsEditor } from './editors/ProjectsEditor';
import { SkillsEditor } from './editors/SkillsEditor';
import { ExperienceEditor } from './editors/ExperienceEditor';
import { TestimonialsEditor } from './editors/TestimonialsEditor';
import { ContactEditor } from './editors/ContactEditor';
import { FooterEditor } from './editors/FooterEditor';
import { ThemeEditor } from './editors/ThemeEditor';
import { SecurityEditor } from './editors/SecurityEditor';
import { EffectsEditor } from './editors/EffectsEditor';
import { soundManager } from '../../utils/audio';

type TabKey =
  | 'hero'
  | 'effects'
  | 'resume'
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'testimonials'
  | 'contact'
  | 'footer'
  | 'theme'
  | 'security';

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'hero', label: 'Hero & Profile', icon: <Sparkles className="w-4 h-4 text-purple-500" /> },
  { key: 'effects', label: 'Motion & FX Studio', icon: <Sliders className="w-4 h-4 text-cyan-500" /> },
  { key: 'resume', label: 'Resume & Files', icon: <FileText className="w-4 h-4 text-emerald-500" /> },
  { key: 'contact', label: 'Get in Touch & Contact', icon: <Mail className="w-4 h-4 text-pink-500" /> },
  { key: 'about', label: 'About & Story', icon: <BookOpen className="w-4 h-4 text-cyan-500" /> },
  { key: 'projects', label: 'Projects Showcase', icon: <Layers className="w-4 h-4 text-indigo-500" /> },
  { key: 'skills', label: 'Skills & Stack', icon: <Code2 className="w-4 h-4 text-amber-500" /> },
  { key: 'experience', label: 'Work History', icon: <Briefcase className="w-4 h-4 text-rose-500" /> },
  { key: 'testimonials', label: 'Testimonials', icon: <Star className="w-4 h-4 text-yellow-500" /> },
  { key: 'footer', label: 'Footer & Clock', icon: <Anchor className="w-4 h-4 text-teal-500" /> },
  { key: 'theme', label: 'Theme & Magic FX', icon: <Palette className="w-4 h-4 text-purple-500" /> },
  { key: 'security', label: 'Security & Passkey', icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
];

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAuthenticated,
    adminView,
    setAdminView,
    logout,
    cloudSyncStatus,
    isCloudConnected,
    forceSyncToCloud,
    uploadLocalStorageToDatabase,
  } = usePortfolio();
  const [activeTab, setActiveTab] = useState<TabKey>('hero');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [isSyncingLocal, setIsSyncingLocal] = useState(false);

  const handleUploadLocalStorage = async () => {
    setIsSyncingLocal(true);
    soundManager.playClick();
    const ok = await uploadLocalStorageToDatabase();
    setIsSyncingLocal(false);
    if (ok) {
      setSyncMessage('Successfully uploaded Profile Photo, Resume & Local Storage data to Cloud Database!');
      setTimeout(() => setSyncMessage(null), 6000);
    } else {
      setSyncMessage('Failed to sync local data to Firebase. Please check connection.');
      setTimeout(() => setSyncMessage(null), 6000);
    }
  };

  // Strict Authentication Security Gate: If not authenticated, do not show admin panel
  if (!isAdminOpen || !isAuthenticated) return null;

  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-50 flex ${
          adminView === 'split' ? 'pointer-events-none' : 'items-center justify-center p-3 sm:p-6'
        }`}
      >
        {/* Backdrop for Full Modal Mode */}
        {adminView === 'full' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAdminOpen(false)}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl pointer-events-auto"
          />
        )}

        {/* CMS Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className={`pointer-events-auto relative bg-white dark:bg-[#0c0f1d] border border-slate-200 dark:border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col z-50 ${
            adminView === 'split'
              ? 'w-full md:w-1/2 h-full rounded-none border-r border-slate-200 dark:border-white/20 shadow-2xl'
              : 'w-full max-w-5xl h-[90vh]'
          }`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-black/50 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1.5px] flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 dark:bg-black rounded-[6.5px] flex items-center justify-center">
                  <Sliders className="w-4 h-4 text-purple-300" />
                </div>
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                  Portfolio CMS Control Center
                </h2>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  {isCloudConnected ? (
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          cloudSyncStatus === 'synced'
                            ? 'bg-emerald-500'
                            : cloudSyncStatus === 'syncing'
                            ? 'bg-amber-400 animate-ping'
                            : 'bg-rose-500'
                        }`}
                      />
                      <span
                        className={
                          cloudSyncStatus === 'synced'
                            ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                            : cloudSyncStatus === 'syncing'
                            ? 'text-amber-600 dark:text-amber-400 font-semibold'
                            : 'text-rose-500'
                        }
                      >
                        {cloudSyncStatus === 'synced'
                          ? 'Firebase Live Cloud Synced'
                          : cloudSyncStatus === 'syncing'
                          ? 'Syncing to Firebase...'
                          : 'Cloud Sync Offline'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      <span>Local Mode (Connect Firebase in Vercel)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Upload Local Storage to Database button */}
              {isCloudConnected && (
                <button
                  onClick={handleUploadLocalStorage}
                  disabled={isSyncingLocal || cloudSyncStatus === 'syncing'}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 transition-colors disabled:opacity-50"
                  title="Upload all local storage content (including Profile Photo & Resume) directly into Firebase Database"
                >
                  {isSyncingLocal ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                  ) : (
                    <DatabaseZap className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                  <span>{isSyncingLocal ? 'Uploading...' : 'Sync Local to Database'}</span>
                </button>
              )}

              {/* Cloud Sync manual trigger button */}
              {isCloudConnected && (
                <button
                  onClick={forceSyncToCloud}
                  disabled={cloudSyncStatus === 'syncing'}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 transition-colors disabled:opacity-50"
                  title="Push current state to Firebase Firestore"
                >
                  <CloudUpload className="w-3.5 h-3.5" />
                  <span>{cloudSyncStatus === 'syncing' ? 'Syncing...' : 'Sync Cloud'}</span>
                </button>
              )}

              {/* Split screen toggle */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setAdminView(adminView === 'full' ? 'split' : 'full');
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors"
                title={adminView === 'full' ? 'Switch to Split Screen' : 'Switch to Full Screen'}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>{adminView === 'full' ? 'Split Preview' : 'Full Screen'}</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/20 transition-colors"
                title="Lock & Logout of Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock</span>
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsAdminOpen(false);
                }}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
                title="Close CMS (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sync notification banner */}
          {syncMessage && (
            <div className="px-6 py-2.5 bg-emerald-500/15 border-b border-emerald-500/20 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{syncMessage}</span>
              </div>
              <button
                onClick={() => setSyncMessage(null)}
                className="p-1 hover:bg-emerald-500/20 rounded text-emerald-700 dark:text-emerald-400"
              >
                ✕
              </button>
            </div>
          )}

          {/* Main Workspace Body */}
          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full sm:w-56 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-white/10 p-3 bg-slate-50/80 dark:bg-black/20 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-y-auto shrink-0 no-scrollbar">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab(tab.key);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap text-left ${
                      isActive
                        ? 'bg-purple-600/10 text-purple-700 dark:bg-purple-600/30 dark:text-white border border-purple-500/40 shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Content Area */}
            <div className="admin-workspace flex-1 p-6 overflow-y-auto bg-slate-50/50 dark:bg-black/10">
              {activeTab === 'hero' && <HeroEditor />}
              {activeTab === 'effects' && <EffectsEditor />}
              {activeTab === 'resume' && <ResumeEditor />}
              {activeTab === 'contact' && <ContactEditor />}
              {activeTab === 'about' && <AboutEditor />}
              {activeTab === 'projects' && <ProjectsEditor />}
              {activeTab === 'skills' && <SkillsEditor />}
              {activeTab === 'experience' && <ExperienceEditor />}
              {activeTab === 'testimonials' && <TestimonialsEditor />}
              {activeTab === 'footer' && <FooterEditor />}
              {activeTab === 'theme' && <ThemeEditor />}
              {activeTab === 'security' && <SecurityEditor />}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
