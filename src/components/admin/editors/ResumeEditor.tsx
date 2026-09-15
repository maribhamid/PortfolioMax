import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { FileText, Upload, Check, ExternalLink, Download, Trash2, Eye, Sparkles, HardDrive, Loader2, Database } from 'lucide-react';
import { soundManager } from '../../../utils/audio';
import { formatGoogleDriveUrl } from '../../../utils/driveHelper';
import { saveResumeToFirestore, downloadOrOpenResume, deleteResumeFromFirestore } from '../../../lib/resumeStorage';

export const ResumeEditor: React.FC = () => {
  const { data, updateHero } = usePortfolio();
  const { hero } = data;
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Safety limit: 15 MB
    if (file.size > 15 * 1024 * 1024) {
      soundManager.playClick();
      setUploadStatus('Notice: File exceeds 15 MB. Please use a compressed PDF or Google Drive link.');
      return;
    }

    setIsUploading(true);
    setUploadStatus(`Uploading "${file.name}" to Cloud Database...`);

    try {
      const result = await saveResumeToFirestore(file);
      const displaySize = Math.round(file.size / 1024);

      updateHero({
        resumeFile: result.url,
        resumeFileName: `${file.name} (${displaySize} KB)`,
        resume: {
          ...hero.resume,
          url: result.url,
          link: result.url,
          show: true,
        },
      });

      soundManager.playSuccess();
      setUploadStatus(`Saved "${file.name}" (${displaySize} KB) directly into Firebase Database!`);
      setTimeout(() => setUploadStatus(null), 6000);
    } catch (err) {
      console.error('Failed to upload resume to Firestore:', err);
      soundManager.playClick();
      setUploadStatus('Error saving resume to database. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearUploadedFile = async () => {
    soundManager.playClick();
    try {
      await deleteResumeFromFirestore();
    } catch (err) {
      console.warn('Error clearing resume doc:', err);
    }
    updateHero({
      resumeFile: '',
      resumeFileName: '',
      resume: {
        ...hero.resume,
        url: '#resume',
        link: '#resume',
      },
    });
  };

  const handleExternalUrlChange = (val: string) => {
    const formatted = formatGoogleDriveUrl(val, 'document');
    updateHero({
      resume: {
        ...hero.resume,
        url: formatted,
        link: formatted,
      },
    });
  };

  const handleTestDownload = async () => {
    soundManager.playClick();
    setIsDownloading(true);
    try {
      await downloadOrOpenResume(hero.resumeFileName || 'Resume.pdf', activeResumeUrl);
    } catch (err) {
      console.error('Download test error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const activeResumeUrl = hero.resumeFile || hero.resume.url || hero.resume.link;
  const hasActiveResume = Boolean(activeResumeUrl && activeResumeUrl !== '#resume');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-1">
          Resume & Document Management
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload your resume directly from your local computer into Firebase Database, or paste a Google Drive public link.
        </p>
      </div>

      {/* Visibility & Label Settings */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <Eye className="w-4 h-4 text-emerald-500" />
            <span>Display Resume Button in Header & Hero</span>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={hero.resume?.show ?? true}
              onChange={(e) =>
                updateHero({
                  resume: { ...hero.resume, show: e.target.checked },
                })
              }
              className="w-4 h-4 rounded accent-emerald-500"
            />
            <span>Show on Portfolio</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
            BUTTON DISPLAY TEXT
          </label>
          <input
            type="text"
            value={hero.resume?.label || 'Download Resume'}
            onChange={(e) =>
              updateHero({
                resume: { ...hero.resume, label: e.target.value },
              })
            }
            className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
            placeholder="e.g. Download Resume, View CV"
          />
        </div>
      </div>

      {/* Option 1: Direct File Upload from Computer / Local Drive */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <HardDrive className="w-4 h-4" />
            Option 1: Upload Resume from Local Computer (PDF / Word)
          </h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
            <Database className="w-3 h-3" />
            <span>Synced to Database</span>
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Select your resume file (up to 10 MB). It is automatically saved and synced into Firebase Cloud Database so anyone on desktop, tablet, or phone can download it instantly!
        </p>

        {hero.resumeFileName && (
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-cyan-800 dark:text-cyan-200 truncate">
              <FileText className="w-5 h-5 text-cyan-500 shrink-0" />
              <div className="truncate">
                <span className="font-bold block truncate">{hero.resumeFileName}</span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">
                  Saved in Firebase Database
                </span>
              </div>
            </div>
            <button
              onClick={handleClearUploadedFile}
              className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-xs flex items-center gap-1"
              title="Remove uploaded resume"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="font-medium">Remove</span>
            </button>
          </div>
        )}

        <label className={`w-full py-3.5 rounded-xl text-xs font-bold bg-white dark:bg-black/30 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-white flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-cyan-500 cursor-pointer transition-all shadow-xs ${
          isUploading ? 'opacity-60 pointer-events-none' : ''
        }`}>
          {isUploading ? (
            <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 text-cyan-500" />
          )}
          <span>{isUploading ? 'Uploading to Database...' : hero.resumeFileName ? 'Replace Resume File from Computer' : 'Choose Local PDF Resume from Computer'}</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {uploadStatus && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
            <Check className="w-3.5 h-3.5" />
            <span>{uploadStatus}</span>
          </div>
        )}
      </div>

      {/* Option 2: Google Drive / Cloud Link */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3">
        <h4 className="text-xs font-mono text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
          <ExternalLink className="w-4 h-4" />
          Option 2: Google Drive or External Cloud Link
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Alternatively, paste a public share link from Google Drive. It is automatically converted to a direct document preview.
        </p>

        <div>
          <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
            GOOGLE DRIVE / CLOUD RESUME LINK
          </label>
          <input
            type="text"
            placeholder="https://drive.google.com/file/d/... or https://..."
            value={hero.resumeFile ? '' : hero.resume?.url || ''}
            disabled={!!hero.resumeFile}
            onChange={(e) => handleExternalUrlChange(e.target.value)}
            className={`w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 ${
              hero.resumeFile ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-white/5' : ''
            }`}
          />
          {hero.resumeFile ? (
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
              Note: Using local resume file above. Click "Remove" above if you prefer an external Google Drive link.
            </p>
          ) : (
            hero.resume?.url?.includes('drive.google.com') && (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3" />
                <span>Google Drive link active!</span>
              </p>
            )
          )}
        </div>
      </div>

      {/* Test / Preview Action */}
      {hasActiveResume && (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleTestDownload}
            disabled={isDownloading}
            className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isDownloading ? 'Opening Resume...' : 'Test Open / Download Active Resume from Database'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
