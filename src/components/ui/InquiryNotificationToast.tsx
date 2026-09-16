import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Inbox, X, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { soundManager } from '../../utils/audio';

export const InquiryNotificationToast: React.FC = () => {
  const { inquiryAlert, dismissInquiryAlert, openAdmin, isAuthenticated } = usePortfolio();

  // Auto-dismiss after 8 seconds unless urgent
  useEffect(() => {
    if (!inquiryAlert) return;
    const timeoutDuration = inquiryAlert.priority === 'urgent' ? 12000 : 8000;
    const timer = setTimeout(() => {
      dismissInquiryAlert();
    }, timeoutDuration);

    return () => clearTimeout(timer);
  }, [inquiryAlert, dismissInquiryAlert]);

  if (!inquiryAlert || !isAuthenticated) {
    return null;
  }

  const handleOpenInbox = () => {
    soundManager.playClick();
    dismissInquiryAlert();
    openAdmin();
  };

  const getPriorityStyle = () => {
    switch (inquiryAlert.priority) {
      case 'urgent':
        return {
          border: 'border-rose-500/60 shadow-rose-500/20',
          badge: 'bg-rose-500 text-white',
          iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          glow: 'shadow-lg shadow-rose-500/10',
          label: 'URGENT PRIORITY',
        };
      case 'high':
        return {
          border: 'border-amber-500/60 shadow-amber-500/20',
          badge: 'bg-amber-500 text-white',
          iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          glow: 'shadow-lg shadow-amber-500/10',
          label: 'HIGH PRIORITY',
        };
      case 'low':
        return {
          border: 'border-slate-500/40 shadow-slate-500/10',
          badge: 'bg-slate-500 text-white',
          iconBg: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          glow: 'shadow-lg shadow-slate-500/5',
          label: 'LOW PRIORITY',
        };
      case 'medium':
      default:
        return {
          border: 'border-purple-500/50 shadow-purple-500/20',
          badge: 'bg-purple-500 text-white',
          iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          glow: 'shadow-lg shadow-purple-500/10',
          label: 'STANDARD PRIORITY',
        };
    }
  };

  const style = getPriorityStyle();

  return (
    <AnimatePresence>
      <motion.div
        key={inquiryAlert.id}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`fixed bottom-6 right-6 z-[10000] max-w-sm sm:max-w-md w-[calc(100vw-3rem)] rounded-2xl bg-[#0d111d]/95 backdrop-blur-xl border ${style.border} ${style.glow} p-4 shadow-2xl select-none`}
      >
        <div className="flex items-start gap-3">
          {/* Animated Notification Icon */}
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${style.iconBg} relative`}>
            {inquiryAlert.priority === 'urgent' ? (
              <ShieldAlert className="w-5 h-5 text-rose-500 animate-bounce" />
            ) : (
              <Bell className="w-5 h-5 text-purple-400 animate-pulse" />
            )}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${inquiryAlert.priority === 'urgent' ? 'bg-rose-400' : 'bg-purple-400'}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${inquiryAlert.priority === 'urgent' ? 'bg-rose-500' : 'bg-purple-500'}`} />
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="text-xs sm:text-sm font-bold text-white font-display truncate">
                {inquiryAlert.title}
              </h4>
              <button
                onClick={() => {
                  soundManager.playClick();
                  dismissInquiryAlert();
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                title="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {inquiryAlert.priority && (
              <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider mb-1.5 ${style.badge}`}>
                {style.label}
              </span>
            )}

            <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed whitespace-pre-wrap font-sans">
              {inquiryAlert.body}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/10">
              <button
                onClick={handleOpenInbox}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/20 active:scale-95"
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Open Inbox</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  dismissInquiryAlert();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
