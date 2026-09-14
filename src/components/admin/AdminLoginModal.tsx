import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldCheck, X, ArrowRight, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { BorderBeam } from '../ui/BorderBeam';
import { ShimmerButton } from '../ui/ShimmerButton';
import { soundManager } from '../../utils/audio';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = usePortfolio();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const timer = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  // Check caps lock
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(e.getModifierState('CapsLock'));
  };

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    const success = login(password);
    if (!success) {
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      setError(true);
      setShake(true);
      soundManager.playClick();
      setTimeout(() => setShake(false), 600);

      if (nextFailed >= MAX_FAILED_ATTEMPTS) {
        setLockoutRemaining(LOCKOUT_SECONDS);
      }
    } else {
      setError(false);
      setPassword('');
      setFailedAttempts(0);
    }
  };

  const isLockedOut = lockoutRemaining > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsLoginModalOpen(false)}
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            x: shake ? [-12, 12, -8, 8, -4, 4, 0] : 0,
          }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-white dark:bg-[#0c0f1d] border border-slate-200 dark:border-white/20 rounded-3xl p-7 z-10 shadow-2xl overflow-hidden"
        >
          <BorderBeam size={180} duration={8} colorFrom="#8b5cf6" colorTo="#06b6d4" />

          {/* Close button */}
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Icon */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1.5px] mx-auto shadow-xl shadow-purple-500/20">
              <div className="w-full h-full bg-slate-50 dark:bg-black/90 rounded-[14px] flex items-center justify-center">
                <Lock className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Admin Access Gate
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Please authenticate to access the portfolio content management system.
            </p>
          </div>

          {/* Security Alert: Lockout state */}
          {isLockedOut ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-center space-y-2 mb-4">
              <ShieldAlert className="w-6 h-6 text-rose-500 mx-auto animate-bounce" />
              <div className="text-xs font-bold font-mono uppercase tracking-wider">
                Security Gate Locked
              </div>
              <p className="text-xs text-rose-600/90 dark:text-rose-300/90">
                Too many incorrect attempts. For security protection, please wait{' '}
                <span className="font-bold text-rose-700 dark:text-rose-200">{lockoutRemaining}s</span> before retrying.
              </p>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                    ADMIN PASSWORD / PASSKEY
                  </label>
                  {failedAttempts > 0 && failedAttempts < MAX_FAILED_ATTEMPTS && (
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                      {MAX_FAILED_ATTEMPTS - failedAttempts} attempts remaining
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    disabled={isLockedOut}
                    placeholder="Enter admin password..."
                    value={password}
                    onKeyUp={handleKeyUp}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    className={`w-full bg-slate-50 dark:bg-black/50 border rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 pr-11 focus:outline-none focus:bg-white dark:focus:bg-black/60 transition-all ${
                      error
                        ? 'border-rose-500 shadow-rose-500/20 shadow-lg'
                        : 'border-slate-300 dark:border-white/15 focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Caps lock warning */}
                {isCapsLockOn && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 mt-1.5 font-mono">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Warning: Caps Lock is active</span>
                  </div>
                )}

                {error && !isLockedOut && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-2 font-mono"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Incorrect password. Please try again.</span>
                  </motion.div>
                )}
              </div>

              <ShimmerButton type="submit" className="w-full mt-2" disabled={isLockedOut}>
                <span>Unlock Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </ShimmerButton>
            </form>
          )}

          {/* Security Badge Footer */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted Session Authentication Layer</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
