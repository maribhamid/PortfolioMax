import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Copy, Check, Sparkles, MapPin, Clock, Phone, Globe, Loader2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../ui/SocialIcons';
import { usePortfolio } from '../../context/PortfolioContext';
import { MessagePriority } from '../../types/portfolio';
import { BorderBeam } from '../ui/BorderBeam';
import { ShimmerButton } from '../ui/ShimmerButton';
import { ScrollReveal } from '../ui/ScrollReveal';
import { MagneticButton } from '../ui/MagneticButton';
import { soundManager } from '../../utils/audio';

export const Contact: React.FC = () => {
  const { data, sendMessage } = usePortfolio();
  const { contact } = data;

  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mailtoTriggerUrl, setMailtoTriggerUrl] = useState('');
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    projectType: string;
    priority: MessagePriority;
    message: string;
  }>({
    name: '',
    email: '',
    projectType: contact.projectTypes[0] || 'Full-Stack Web App',
    priority: 'medium',
    message: '',
  });

  const handleCopyEmail = async () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    soundManager.playSuccess();
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // Confetti fallback
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    soundManager.playClick();

    try {
      // 1. Save directly to Cloud Firestore & Local Cache in real time
      await sendMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        projectType: formData.projectType,
        priority: formData.priority,
        message: formData.message.trim(),
      });

      // 2. Prepare optional mailto fallback URL
      const recipientEmail = contact.email || 'maribhamid@gmail.com';
      const subject = encodeURIComponent(`[${formData.priority.toUpperCase()} PRIORITY] Inquiry: ${formData.projectType} from ${formData.name}`);
      const body = encodeURIComponent(
        `Hi,\n\nYou have received a new inquiry from your portfolio website:\n\n` +
        `• Name: ${formData.name}\n` +
        `• Email: ${formData.email}\n` +
        `• Project Type: ${formData.projectType}\n` +
        `• Priority: ${formData.priority.toUpperCase()}\n\n` +
        `Message:\n${formData.message}\n\n` +
        `Sent on: ${new Date().toLocaleString()}\n`
      );
      const mailUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
      setMailtoTriggerUrl(mailUrl);

      soundManager.playSuccess();
      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.7 },
          colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
        });
      } catch {
        // Confetti fallback
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {contact.badge}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            {contact.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
            {contact.subtitle}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info & Quick Copy */}
          <ScrollReveal direction="left" className="lg:col-span-5 space-y-6">
            <div className="glass-card border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
              <BorderBeam size={180} duration={10} colorFrom="#f43f5e" colorTo="#8b5cf6" />
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
                {contact.directHeading}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {contact.directDesc}
              </p>

              {/* Copy Email Box */}
              {contact.email && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 mb-6 shadow-sm">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-mono text-slate-900 dark:text-white truncate font-medium">
                      {contact.email}
                    </span>
                  </div>
                  <MagneticButton strength={0.25}>
                    <button
                      onClick={handleCopyEmail}
                      onMouseEnter={() => soundManager.playHover()}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-xs font-semibold text-slate-800 dark:text-white border border-slate-200 dark:border-transparent flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </MagneticButton>
                </div>
              )}

              {/* Status details */}
              <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                {contact.location && (
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>{contact.location}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.responseTime && (
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <span>Response time: {contact.responseTime}</span>
                  </div>
                )}
                {contact.statusText && (
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                    <span>Status: {contact.statusText}</span>
                  </div>
                )}
              </div>

              {/* Social Channels */}
              {contact.socials && contact.socials.length > 0 && (
                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mr-1">PROFILES:</span>
                  {contact.socials.map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noreferrer"
                      onMouseEnter={() => soundManager.playHover()}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white border border-slate-200/80 dark:border-white/5 flex items-center gap-1.5 transition-colors font-mono shadow-sm"
                    >
                      {soc.platform.toLowerCase().includes('git') ? (
                        <GithubIcon className="w-3.5 h-3.5" />
                      ) : soc.platform.toLowerCase().includes('link') ? (
                        <LinkedinIcon className="w-3.5 h-3.5" />
                      ) : soc.platform.toLowerCase().includes('twit') ? (
                        <TwitterIcon className="w-3.5 h-3.5" />
                      ) : (
                        <Globe className="w-3.5 h-3.5" />
                      )}
                      <span>{soc.platform}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Right Column: Interactive Contact Form */}
          <ScrollReveal direction="right" className="lg:col-span-7">
            <div className="glass-card border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <Check className="w-7 h-7" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Real-Time Cloud Synced • Admin Notified</span>
                  </div>
                  <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                    Transmission Received & Logged!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-purple-600 dark:text-purple-300 font-semibold">{formData.name}</span>. Your inquiry has been instantly saved to the database and routed straight to my admin panel notification feed.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    {mailtoTriggerUrl && (
                      <a
                        href={mailtoTriggerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 rounded-full text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-2 transition-colors shadow-sm"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Also Send via Mail App (Optional)</span>
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          projectType: contact.projectTypes[0] || 'Full-Stack Web App',
                          priority: 'medium',
                          message: '',
                        });
                      }}
                      className="px-5 py-2 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white transition-colors"
                    >
                      Send Another Note
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1.5">
                        YOUR NAME
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jordan Hayes"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1.5">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="jordan@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/60 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1.5">
                        PROJECT TYPE
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full bg-white dark:bg-[#0e111d] border border-slate-200/80 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/60 transition-colors shadow-sm"
                      >
                        {contact.projectTypes.map((t, idx) => (
                          <option key={idx} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                        <span>PRIORITY LEVEL</span>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-sans font-semibold uppercase">
                          {formData.priority}
                        </span>
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as MessagePriority })}
                        className="w-full bg-white dark:bg-[#0e111d] border border-slate-200/80 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/60 transition-colors shadow-sm capitalize"
                      >
                        <option value="low">🟢 Low — Casual / Inquiring</option>
                        <option value="medium">🔵 Medium — Standard Timeline</option>
                        <option value="high">🟠 High — Important / Next Few Weeks</option>
                        <option value="urgent">🔴 Urgent — Critical / Immediate ASAP</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1.5">
                      PROJECT BRIEF / MESSAGE
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell me about your goals, timeline, and tech requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-50/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/60 transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <MagneticButton className="w-full">
                      <ShimmerButton
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full text-white disabled:opacity-75"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 text-white animate-spin" />
                            <span className="text-white">Transmitting Message...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-white" />
                            <span className="text-white">Transmit Message</span>
                          </>
                        )}
                      </ShimmerButton>
                    </MagneticButton>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
