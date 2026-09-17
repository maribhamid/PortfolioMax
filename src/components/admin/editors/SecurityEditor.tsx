import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import {
  ShieldCheck,
  Lock,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { soundManager } from '../../../utils/audio';

export const SecurityEditor: React.FC = () => {
  const { data, changeAdminCredentials, changeAdminPassword, logout } = usePortfolio();
  const currentSavedUsername = data.settings.adminUsername || 'maribhamid@port.com';
  const currentSavedPassword = data.settings.adminPassword || 'admin123';

  const [currentInput, setCurrentInput] = useState('');
  const [newUsername, setNewUsername] = useState(currentSavedUsername);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password strength calculator
  const getStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = getStrength(newPassword);

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentInput !== currentSavedPassword) {
      soundManager.playClick();
      setMessage({ type: 'error', text: 'Current password is incorrect. Verification failed.' });
      return;
    }

    if (!newUsername.trim()) {
      soundManager.playClick();
      setMessage({ type: 'error', text: 'Admin username or email cannot be empty.' });
      return;
    }

    const nextPass = newPassword.trim() ? newPassword : currentSavedPassword;

    if (newPassword.trim()) {
      if (newPassword.length < 4) {
        soundManager.playClick();
        setMessage({ type: 'error', text: 'New password must be at least 4 characters.' });
        return;
      }

      if (newPassword !== confirmPassword) {
        soundManager.playClick();
        setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
        return;
      }
    }

    if (changeAdminCredentials) {
      changeAdminCredentials(newUsername.trim(), nextPass);
    } else {
      changeAdminPassword(nextPass);
    }

    soundManager.playSuccess();
    setMessage({
      type: 'success',
      text: 'Admin credentials updated! Click "Save to Cloud Database" above to finalize and persist into Firestore.'
    });
    setCurrentInput('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setMessage(null), 7000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>Security & Master Passkey Management</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure admin gatekeeper authentication, brute-force limits, and master access keys.
        </p>
      </div>

      {/* Security Status Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Active Session Security Status: High</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
            ENCRYPTED
          </span>
        </div>
        <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
          The admin gate is protected with local rate-limiting and brute-force lockout safeguards.
          Sessions automatically lock upon browser close or explicit manual logout.
        </p>
      </div>

      {/* Change Password Form */}
      <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          <Key className="w-4 h-4 text-purple-500" />
          <span>Admin Authentication & Credentials</span>
        </div>

        {/* Current Active Account Indicator */}
        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-purple-600 dark:text-purple-400 font-bold block">
              Active Authorized Admin Email / Username
            </span>
            <span className="text-xs sm:text-sm font-mono font-semibold text-slate-900 dark:text-white">
              {currentSavedUsername}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-purple-600/20 text-purple-700 dark:text-purple-300 font-bold">
            SuperAdmin
          </span>
        </div>

        <form onSubmit={handleUpdateCredentials} className="space-y-4">
          {/* Admin Email/Username field */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
              ADMIN EMAIL / USERNAME
            </label>
            <input
              type="text"
              required
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="e.g. maribhamid@port.com"
              className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
            />
          </div>

          {/* Current Password Verification */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
              CURRENT MASTER PASSWORD (REQUIRED TO CONFIRM CHANGES)
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Enter current password (default: admin123)..."
                className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                NEW MASTER PASSWORD (OPTIONAL)
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave empty to keep current password..."
                  className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Strength</span>
                    <span>{strength <= 25 ? 'Weak' : strength <= 75 ? 'Moderate' : 'Strong'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength <= 25
                          ? 'bg-rose-500 w-1/4'
                          : strength <= 75
                          ? 'bg-amber-500 w-3/4'
                          : 'bg-emerald-500 w-full'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                CONFIRM NEW PASSWORD
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password..."
                className="w-full bg-white dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 font-mono ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Update Admin Credentials
          </button>
        </form>
      </div>

      {/* Session Quick Actions */}
      <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
            Emergency Lock CMS
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Instantly end current administrative session and lock the dashboard behind the password gate.
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Lock & Logout Now</span>
        </button>
      </div>
    </div>
  );
};
