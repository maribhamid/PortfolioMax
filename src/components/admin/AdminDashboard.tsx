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
  CheckCircle2,
  Inbox
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { HeroEditor } from './editors/HeroEditor';
import { MessagesEditor } from './editors/MessagesEditor';
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
  | 'messages'
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
  { key: 'messages', label: 'Inbox & Messages', icon: <Inbox className="w-4 h-4 text-rose-500" /> },
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
    unreadMessagesCount,
  } = usePortfolio();
  const [activeTab, setActiveTab] = useState<TabKey>('messages');
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
          />
        )}

        {/* Admin Dashboard Window */}
        <motion.div
          initial={
            adminView === 'split'
              ? { x: -600, opacity: 0 }
              : { scale: 0.95, opacity: 0, y: 20 }
          }
          animate={{ x: 0, scale: 1, opacity: 1, y: 0 }}
          exit={
            adminView === 'split'
              ? { x: -600, opacity: 0 }
              : { scale: 0.95, opacity: 0, y: 20 }
          }
          transition={{ type: 'spring', damping: 26, stiffness: 240 }}
          className={`pointer-events-auto relative flex flex-col bg-white/95 dark:bg-[#0c0e17]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden rounded-2xl sm:rounded-3xl ${
            adminView === 'split'
              ? 'fixed left-0 top-0 bottom-0 w-full md:w-1/2 z-50 rounded-none border-r border-slate-200 dark:border-white/15 shadow-2xl'
              : 'w-full max-w-5xl h-[92vh] max-h-[850px]'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold font-mono text-sm shadow-sm">
                CMS
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Portfolio Studio & Cloud Suite
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    Live Real-Time Editor
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  {/* Cloud Connection Badge */}
                  <div className="flex items-center gap-1">
                    {isCloudConnected ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                        <Cloud className="w-3 h-3" />
                        <span>Firebase Cloud Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 dark:text-amber-400">
                        <Cloud className="w-3 h-3" />
                        <span>Local Storage Mode</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Force Cloud Sync Button */}
              {isCloudConnected && (
                <button
                  onClick={handleUploadLocalStorage}
                  disabled={isSyncingLocal}
                  title="Upload all local storage data, profile avatar & resume to Cloud Firestore"
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isSyncingLocal ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <DatabaseZap className="w-3.5 h-3.5 text-purple-500" />
                  )}
                  <span className="hidden sm:inline">Sync Local to Cloud</span>
                </button>
              )}

              {/* View Toggle (Split Screen vs Full Modal) */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setAdminView(adminView === 'full' ? 'split' : 'full');
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
                title={adminView === 'full' ? 'Switch to Side-by-Side Split View' : 'Switch to Fullscreen Studio'}
              >
                <Columns className="w-4 h-4" />
              </button>

              {/* Logout Button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  logout();
                }}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                title="Lock & Log Out of Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsAdminOpen(false);
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
                title="Close Studio (Cmd+E / Ctrl+E)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Toast Notification message */}
          {syncMessage && (
            <div className="px-5 py-2.5 bg-purple-600 text-white text-xs font-medium flex items-center justify-between transition-all">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{syncMessage}</span>
              </div>
              <button onClick={() => setSyncMessage(null)} className="text-white/80 hover:text-white">
                <X className="w-3.5 h-3.5" />
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
                    <span className="flex-1">{tab.label}</span>
                    {tab.key === 'messages' && unreadMessagesCount > 0 && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                        {unreadMessagesCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Content Area */}
            <div className="admin-workspace flex-1 p-6 overflow-y-auto bg-slate-50/50 dark:bg-black/10">
              {activeTab === 'messages' && <MessagesEditor />}
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
