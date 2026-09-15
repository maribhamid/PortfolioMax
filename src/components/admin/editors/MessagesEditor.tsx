import React, { useState } from 'react';
import {
  Mail,
  Trash2,
  CheckCircle2,
  Eye,
  Reply,
  Copy,
  Check,
  Search,
  Clock,
  Sparkles,
  Inbox,
  AlertTriangle,
  Send,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { soundManager } from '../../../utils/audio';

export const MessagesEditor: React.FC = () => {
  const {
    messages,
    unreadMessagesCount,
    deleteMessage,
    markMessageRead,
    clearAllMessages
  } = usePortfolio();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'read' | 'urgent'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const urgentMessagesCount = messages.filter((m) => m.priority === 'urgent').length;

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    // Filter mode
    if (filterMode === 'unread' && msg.read) return false;
    if (filterMode === 'read' && !msg.read) return false;
    if (filterMode === 'urgent' && msg.priority !== 'urgent') return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      msg.message.toLowerCase().includes(q) ||
      msg.projectType.toLowerCase().includes(q) ||
      (msg.priority && msg.priority.toLowerCase().includes(q)) ||
      (msg.budget && msg.budget.toLowerCase().includes(q))
    );
  });

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    soundManager.playSuccess();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    soundManager.playClick();
    await markMessageRead(id, !currentRead);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteMessage(id);
    setDeletingId(null);
  };

  const handleClearAll = async () => {
    await clearAllMessages();
    setShowClearConfirm(false);
  };

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'Recently';
    }
  };

  const renderPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Urgent Priority
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            High Priority
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Low Priority
          </span>
        );
      case 'medium':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Medium Priority
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Inbox & Inquiries
              </h2>
              {unreadMessagesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">
                  {unreadMessagesCount} new
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live contact inquiries submitted through your portfolio contact form.
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setShowClearConfirm(true);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Clear All */}
      {showClearConfirm && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>Are you sure you want to permanently delete all {messages.length} messages?</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
            >
              Cancel
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
            >
              Confirm Clear
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Inquiries
            </span>
            <p className="text-xl font-bold font-display text-slate-900 dark:text-white mt-0.5">
              {messages.length}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Unread Messages
            </span>
            <p className="text-xl font-bold font-display text-rose-600 dark:text-rose-400 mt-0.5">
              {unreadMessagesCount}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Read / Handled
            </span>
            <p className="text-xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-0.5">
              {messages.length - unreadMessagesCount}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search sender, email, brief..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/60"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilterMode('unread')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === 'unread'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            Unread ({unreadMessagesCount})
          </button>
          {urgentMessagesCount > 0 && (
            <button
              onClick={() => setFilterMode('urgent')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                filterMode === 'urgent'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              Urgent ({urgentMessagesCount})
            </button>
          )}
          <button
            onClick={() => setFilterMode('read')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === 'read'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            Read ({messages.length - unreadMessagesCount})
          </button>
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
            {searchQuery.trim() || filterMode !== 'all' ? 'No Matching Inquiries Found' : 'No Inquiries Yet'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchQuery.trim() || filterMode !== 'all'
              ? 'Try changing your search query or switching to another filter.'
              : 'When visitors submit project inquiries via your contact form, they will be delivered and saved here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const isDeleting = deletingId === msg.id;
            const priorityText = (msg.priority || 'medium').toUpperCase();
            const replySubject = encodeURIComponent(`Re: Project Inquiry [${msg.projectType}]`);
            const replyBody = encodeURIComponent(
              `Hi ${msg.name},\n\nThank you for reaching out regarding your ${msg.projectType} inquiry (Priority: ${priorityText})!\n\nBest regards,\n`
            );
            const mailtoUrl = `mailto:${msg.email}?subject=${replySubject}&body=${replyBody}`;

            return (
              <div
                key={msg.id}
                className={`p-4 sm:p-5 rounded-2xl transition-all border ${
                  !msg.read
                    ? 'bg-white dark:bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-500/5 dark:shadow-rose-950/20'
                    : 'bg-white/80 dark:bg-white/5 border-slate-200/90 dark:border-white/10'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar Initial */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold uppercase shrink-0 ${
                        !msg.read
                          ? 'bg-rose-500 text-white'
                          : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                      }`}
                    >
                      {msg.name.charAt(0) || 'V'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white">
                          {msg.name}
                        </h4>
                        {!msg.read && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500 text-white">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                          {msg.email}
                        </span>
                        <button
                          onClick={() => handleCopyEmail(msg.email, msg.id)}
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                          title="Copy email address"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Date & Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:self-center">
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(msg.createdAt)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      {msg.projectType}
                    </span>
                    {renderPriorityBadge(msg.priority)}
                  </div>
                </div>

                {/* Message Body */}
                <div className="my-3 p-3.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.message}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    {/* Reply via email */}
                    <a
                      href={mailtoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        soundManager.playSuccess();
                        if (!msg.read) markMessageRead(msg.id, true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>

                    {/* Toggle read/unread */}
                    <button
                      onClick={() => handleToggleRead(msg.id, msg.read)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                    >
                      {msg.read ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Mark as Unread</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Mark as Handled</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Delete button */}
                  <button
                    disabled={isDeleting}
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
