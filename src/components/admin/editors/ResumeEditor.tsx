import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { FileText, Upload, Check, ExternalLink, Download, Trash2, Eye, Sparkles, HardDrive, Loader2, AlertCircle } from 'lucide-react';
import { soundManager } from '../../../utils/audio';
import { formatGoogleDriveUrl } from '../../../utils/driveHelper';
import { uploadFileToStorage } from '../../../lib/firebase';

export const ResumeEditor: React.FC = () => {
  const { data, updateHero } = usePortfolio();
  const { hero } = data;
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(`Uploading "${file.name}" to Cloud Storage...`);

    try {
      // 1. Attempt uploading directly to Firebase Storage first (gets permanent HTTPS URL)
      const storageUrl = await uploadFileToStorage('resumes', file);
      if (storageUrl) {
        updateHero({
          resumeFile: storageUrl,
          resumeFileName: `${file.name} (${Math.round(file.size / 1024)} KB)`,
          resume: {
            ...hero.resume,
            url: storageUrl,
            link: storageUrl,
            show: true,
          },
        });
        soundManager.playSuccess();
        setUploadStatus(`Uploaded "${file.name}" to Firebase Cloud Storage!`);
        setIsUploading(false);
        setTimeout(() => setUploadStatus(null), 5000);
        return;
      }

      // 2. If storage is not configured, check file size for Firestore base64 limits
      if (file.size > 500 * 1024) {
        soundManager.playClick();
        setUploadStatus(
          `Notice: File is ${Math.round(file.size / 1024)} KB (exceeds 500 KB Firestore single-document limit). Please use a compressed PDF or paste a Google Drive public share link below!`
        );
        setIsUploading(false);
        return;
      }

      // 3. Under 500 KB: safe to store as base64 in Firestore
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        if (base64Data) {
          updateHero({
            resumeFile: base64Data,
            resumeFileName: `${file.name} (${Math.round(file.size / 1024)} KB)`,
            resume: {
              ...hero.resume,
              url: base64Data,
              link: base64Data,
              show: true,
            },
          });
          soundManager.playSuccess();
          setUploadStatus(`Loaded "${file.name}" into database successfully!`);
          setTimeout(() => setUploadStatus(null), 5000);
        }
        setIsUploading(false);
      };
      reader.onerror = () => {
        setIsUploading(false);
        setUploadStatus('Failed to read file from disk.');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to upload resume:', err);
      setIsUploading(false);
      setUploadStatus('Error uploading resume.');
    }
  };

  const handleClearUploadedFile = () => {
    soundManager.playClick();
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

  const activeResumeUrl = hero.resumeFile || hero.resume.url || hero.resume.link;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-1">
          Resume & Document Management
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload your resume directly from your local hard drive or paste a Google Drive public share link.
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

      {/* Option 1: Direct File Upload from Computer / Hard Drive */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <HardDrive className="w-4 h-4" />
            Option 1: Upload Resume from Local Hard Drive (PDF / DOCX)
          </h4>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Select any PDF or Word document from your computer. It is encoded directly into application state as a data URI so visitors can immediately download or inspect it!
        </p>

        {hero.resumeFileName && (
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-cyan-800 dark:text-cyan-200 truncate">
              <FileText className="w-4 h-4 text-cyan-500 shrink-0" />
              <span className="font-semibold truncate">{hero.resumeFileName}</span>
            </div>
            <button
              onClick={handleClearUploadedFile}
              className="p-1 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded transition-colors text-xs flex items-center gap-1"
              title="Remove uploaded file"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
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
          <span>{isUploading ? 'Uploading to Database...' : hero.resumeFileName ? 'Replace Resume File from Drive' : 'Choose Local PDF File from Drive'}</span>
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
          Paste a public share link from Google Drive, Dropbox, or OneDrive. Google Drive links are automatically converted into direct preview URLs.
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
              Note: Using local drive file above. Click "Remove" above if you prefer an external Google Drive link.
            </p>
          ) : (
            hero.resume?.url?.includes('drive.google.com') && (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3" />
                <span>Google Drive link detected and active in state!</span>
              </p>
            )
          )}
        </div>
      </div>

      {/* Test / Preview Action */}
      {activeResumeUrl && activeResumeUrl !== '#resume' && (
        <div className="pt-2">
          <a
            href={activeResumeUrl}
            target="_blank"
            rel="noreferrer"
            download={hero.resumeFileName || (hero.resumeFile ? 'Resume.pdf' : undefined)}
            className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Download className="w-4 h-4" />
            <span>Test Open / Download Active Resume in State</span>
          </a>
        </div>
      )}
    </div>
  );
};
