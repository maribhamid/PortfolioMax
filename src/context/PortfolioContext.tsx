import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { isFirebaseConfigured } from '../lib/firebaseConfig';
import {
  PortfolioData,
  HeroData,
  AboutData,
  ContactData,
  FooterData,
  ProjectItem,
  SkillItem,
  ExperienceItem,
  TestimonialItem,
  SiteSettings,
  AccentTheme,
  ColorMode,
  VisibleSections,
  MotionEffectsConfig,
  ContactMessage
} from '../types/portfolio';
import { defaultPortfolioData } from '../data/defaultData';
import { soundManager } from '../utils/audio';
import {
  getLocalMessages,
  subscribeToMessages,
  saveMessageToStorage,
  deleteMessageFromStorage,
  markMessageReadInStorage,
  clearAllMessagesFromStorage
} from '../lib/messagesStorage';

const STORAGE_KEY = 'portfolio_cms_v3_data';
const AUTH_SESSION_KEY = 'portfolio_admin_auth';

// Helper to sanitize undefined properties before saving to Firestore
function cleanUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined) as unknown as T;
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = cleanUndefined(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

interface PortfolioContextType {
  data: PortfolioData;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminView: 'full' | 'split';
  setAdminView: (view: 'full' | 'split') => void;

  // Cloud Sync
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncedAt: Date | null;
  isCloudConnected: boolean;
  forceSyncToCloud: () => Promise<void>;
  uploadLocalStorageToDatabase: () => Promise<boolean>;
  downloadResumeFile: (fileName?: string) => Promise<boolean>;

  // Contact Inquiries & Messages
  messages: ContactMessage[];
  unreadMessagesCount: number;
  sendMessage: (msg: { name: string; email: string; projectType: string; budget: string; message: string }) => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;
  markMessageRead: (id: string, read: boolean) => Promise<boolean>;
  clearAllMessages: () => Promise<boolean>;

  // Authentication
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  openAdmin: () => void;
  login: (password: string) => boolean;
  logout: () => void;
  changeAdminPassword: (newPass: string) => void;

  // Theme & Mode
  colorMode: ColorMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
  setAccentTheme: (theme: AccentTheme) => void;
  setCustomColors: (primary: string, accent: string) => void;
  toggleSectionVisibility: (section: keyof VisibleSections) => void;
  toggleSound: () => void;

  // Section updates
  updateHero: (hero: Partial<HeroData>) => void;
  updateAbout: (about: Partial<AboutData>) => void;
  updateContact: (contact: Partial<ContactData>) => void;
  updateFooter: (footer: Partial<FooterData>) => void;
  updateSettings: (settings: Partial<SiteSettings>) => void;
  updateEffectsConfig: (effects: Partial<MotionEffectsConfig>) => void;

  // Projects CRUD
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, project: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;

  // Skills CRUD
  addSkill: (skill: Omit<SkillItem, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<SkillItem>) => void;
  deleteSkill: (id: string) => void;

  // Experience CRUD
  addExperience: (exp: Omit<ExperienceItem, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;

  // Testimonials CRUD
  addTestimonial: (item: Omit<TestimonialItem, 'id'>) => void;
  updateTestimonial: (id: string, item: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultPortfolioData,
          ...parsed,
          hero: {
            ...defaultPortfolioData.hero,
            ...(parsed.hero || {}),
            resume: {
              ...defaultPortfolioData.hero.resume,
              ...(parsed.hero?.resume || {})
            },
            ctaPrimary: {
              ...defaultPortfolioData.hero.ctaPrimary,
              ...(parsed.hero?.ctaPrimary || {})
            },
            ctaSecondary: {
              ...defaultPortfolioData.hero.ctaSecondary,
              ...(parsed.hero?.ctaSecondary || {})
            }
          },
          about: { ...defaultPortfolioData.about, ...(parsed.about || {}) },
          contact: {
            ...defaultPortfolioData.contact,
            ...(parsed.contact || {}),
            projectTypes: parsed.contact?.projectTypes?.length ? parsed.contact.projectTypes : defaultPortfolioData.contact.projectTypes,
            budgets: parsed.contact?.budgets?.length ? parsed.contact.budgets : defaultPortfolioData.contact.budgets,
          },
          footer: { ...defaultPortfolioData.footer, ...(parsed.footer || {}) },
          settings: {
            ...defaultPortfolioData.settings,
            ...(parsed.settings || {}),
            colorMode: parsed.settings?.colorMode || 'dark', // default dark
            adminPassword: parsed.settings?.adminPassword || 'admin123',
            visibleSections: {
              ...defaultPortfolioData.settings.visibleSections,
              ...(parsed.settings?.visibleSections || {})
            },
            effectsConfig: {
              ...defaultPortfolioData.settings.effectsConfig!,
              ...(parsed.settings?.effectsConfig || {}),
              customCursor: {
                ...defaultPortfolioData.settings.effectsConfig!.customCursor,
                ...(parsed.settings?.effectsConfig?.customCursor || {})
              },
              magneticButtons: {
                ...defaultPortfolioData.settings.effectsConfig!.magneticButtons,
                ...(parsed.settings?.effectsConfig?.magneticButtons || {})
              },
              cursorSpotlight: {
                ...defaultPortfolioData.settings.effectsConfig!.cursorSpotlight,
                ...(parsed.settings?.effectsConfig?.cursorSpotlight || {})
              },
              interactiveBackground: {
                ...defaultPortfolioData.settings.effectsConfig!.interactiveBackground,
                ...(parsed.settings?.effectsConfig?.interactiveBackground || {})
              },
              floating3D: {
                ...defaultPortfolioData.settings.effectsConfig!.floating3D,
                ...(parsed.settings?.effectsConfig?.floating3D || {})
              },
              scrollAnimations: {
                ...defaultPortfolioData.settings.effectsConfig!.scrollAnimations,
                ...(parsed.settings?.effectsConfig?.scrollAnimations || {})
              }
            }
          }
        };
      }
    } catch (e) {
      console.error('Failed to load portfolio data from storage:', e);
    }
    return defaultPortfolioData;
  });

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [adminView, setAdminView] = useState<'full' | 'split'>('full');

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Cloud sync status
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>(() => {
    return isFirebaseConfigured ? 'syncing' : 'offline';
  });
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const isRemoteUpdate = useRef<boolean>(false);

  // Contact messages state
  const [messages, setMessages] = useState<ContactMessage[]>(() => getLocalMessages());
  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  useEffect(() => {
    const unsub = subscribeToMessages((updated) => {
      setMessages(updated);
    });
    return () => unsub();
  }, []);

  // Real-time Firestore Cloud listener with Intelligent Local Preservation
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setCloudSyncStatus('offline');
      return;
    }

    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    const setupSync = async () => {
      try {
        setCloudSyncStatus('syncing');
        const [{ doc, onSnapshot, setDoc }, { getDb }, { saveResumeDataUrlToFirestore }] = await Promise.all([
          import('firebase/firestore'),
          import('../lib/firebase'),
          import('../lib/resumeStorage')
        ]);

        if (!isMounted) return;
        const firestoreDb = getDb();
        if (!firestoreDb) {
          setCloudSyncStatus('offline');
          return;
        }

        const portfolioDocRef = doc(firestoreDb, 'portfolio', 'data');

        unsubscribe = onSnapshot(
          portfolioDocRef,
          (snapshot) => {
            if (!isMounted) return;
            if (snapshot.exists()) {
              const remoteData = snapshot.data() as Partial<PortfolioData>;
              isRemoteUpdate.current = true;
              setData((prev) => {
                // Intelligent Merge: Don't wipe local customized avatar or resume if remote only has default placeholders!
                const isDefaultAvatar = (url?: string) =>
                  !url || (url.includes('unsplash.com') && url.includes('photo-1534528741775'));

                const isDefaultResume = (hero?: HeroData) => {
                  if (!hero) return true;
                  if (hero.resumeFile && hero.resumeFile !== '') return false;
                  const link = hero.resume?.url || hero.resume?.link;
                  return !link || link === '#resume' || link === '';
                };

                // Avatar resolution
                let resolvedAvatar = remoteData.hero?.avatarUrl || prev.hero.avatarUrl;
                let shouldSyncAvatarToCloud = false;
                if (!isDefaultAvatar(prev.hero.avatarUrl) && isDefaultAvatar(remoteData.hero?.avatarUrl)) {
                  // Local state has custom photo, but remote only has default template! Preserve local!
                  resolvedAvatar = prev.hero.avatarUrl;
                  shouldSyncAvatarToCloud = true;
                }

                // Resume resolution
                let resolvedResumeFile = remoteData.hero?.resumeFile || prev.hero.resumeFile;
                let resolvedResumeFileName = remoteData.hero?.resumeFileName || prev.hero.resumeFileName;
                let resolvedResume = {
                  ...defaultPortfolioData.hero.resume,
                  ...prev.hero.resume,
                  ...(remoteData.hero?.resume || {}),
                };
                let shouldSyncResumeToCloud = false;

                if (!isDefaultResume(prev.hero) && isDefaultResume(remoteData.hero as HeroData)) {
                  // Local has custom resume, remote doesn't! Preserve local!
                  resolvedResumeFile = prev.hero.resumeFile;
                  resolvedResumeFileName = prev.hero.resumeFileName;
                  resolvedResume = { ...prev.hero.resume };
                  shouldSyncResumeToCloud = true;
                }

                // Auto-migrate preserved local data to Firestore in the background
                if (shouldSyncAvatarToCloud || shouldSyncResumeToCloud) {
                  setTimeout(async () => {
                    try {
                      const updates: Record<string, any> = {};
                      if (shouldSyncAvatarToCloud && resolvedAvatar) {
                        updates['hero.avatarUrl'] = resolvedAvatar;
                      }
                      if (shouldSyncResumeToCloud) {
                        if (resolvedResumeFile && resolvedResumeFile.startsWith('data:')) {
                          const res = await saveResumeDataUrlToFirestore(
                            resolvedResumeFile,
                            resolvedResumeFileName || 'Resume.pdf'
                          );
                          updates['hero.resumeFile'] = res.url;
                          updates['hero.resumeFileName'] = res.fileName;
                          updates['hero.resume.url'] = res.url;
                          updates['hero.resume.link'] = res.url;
                        } else if (resolvedResumeFile) {
                          updates['hero.resumeFile'] = resolvedResumeFile;
                          updates['hero.resumeFileName'] = resolvedResumeFileName;
                        }
                      }
                      if (Object.keys(updates).length > 0) {
                        await setDoc(portfolioDocRef, updates, { merge: true });
                      }
                    } catch (e) {
                      console.warn('Auto-migration to Firestore notice:', e);
                    }
                  }, 800);
                }

                return {
                  ...defaultPortfolioData,
                  ...prev,
                  ...remoteData,
                  hero: {
                    ...defaultPortfolioData.hero,
                    ...prev.hero,
                    ...(remoteData.hero || {}),
                    avatarUrl: resolvedAvatar,
                    resumeFile: resolvedResumeFile,
                    resumeFileName: resolvedResumeFileName,
                    resume: resolvedResume,
                    ctaPrimary: {
                      ...defaultPortfolioData.hero.ctaPrimary,
                      ...prev.hero.ctaPrimary,
                      ...(remoteData.hero?.ctaPrimary || {}),
                    },
                    ctaSecondary: {
                      ...defaultPortfolioData.hero.ctaSecondary,
                      ...prev.hero.ctaSecondary,
                      ...(remoteData.hero?.ctaSecondary || {}),
                    },
                  },
                  about: { ...defaultPortfolioData.about, ...prev.about, ...(remoteData.about || {}) },
                  projects: Array.isArray(remoteData.projects) ? remoteData.projects : prev.projects,
                  skills: Array.isArray(remoteData.skills) ? remoteData.skills : prev.skills,
                  experience: Array.isArray(remoteData.experience) ? remoteData.experience : prev.experience,
                  testimonials: Array.isArray(remoteData.testimonials) ? remoteData.testimonials : prev.testimonials,
                  contact: {
                    ...defaultPortfolioData.contact,
                    ...prev.contact,
                    ...(remoteData.contact || {}),
                    projectTypes: remoteData.contact?.projectTypes?.length ? remoteData.contact.projectTypes : prev.contact.projectTypes,
                    budgets: remoteData.contact?.budgets?.length ? remoteData.contact.budgets : prev.contact.budgets,
                  },
                  footer: { ...defaultPortfolioData.footer, ...prev.footer, ...(remoteData.footer || {}) },
                  settings: {
                    ...defaultPortfolioData.settings,
                    ...prev.settings,
                    ...(remoteData.settings || {}),
                    visibleSections: {
                      ...defaultPortfolioData.settings.visibleSections,
                      ...prev.settings.visibleSections,
                      ...(remoteData.settings?.visibleSections || {}),
                    },
                    effectsConfig: {
                      ...defaultPortfolioData.settings.effectsConfig!,
                      ...prev.settings.effectsConfig,
                      ...(remoteData.settings?.effectsConfig || {}),
                    },
                  },
                };
              });
              setCloudSyncStatus('synced');
              setLastSyncedAt(new Date());
            } else {
              // Document does not exist yet; initialize cloud document with default data
              setDoc(portfolioDocRef, cleanUndefined(defaultPortfolioData), { merge: true })
                .then(() => {
                  if (isMounted) {
                    setCloudSyncStatus('synced');
                    setLastSyncedAt(new Date());
                  }
                })
                .catch((err) => {
                  console.warn('Initial Firestore write warning:', err);
                  if (isMounted) setCloudSyncStatus('error');
                });
            }
          },
          (error) => {
            console.warn('Firestore subscription notice (using offline local mode):', error.message || error);
            if (isMounted) setCloudSyncStatus('offline');
          }
        );
      } catch (err) {
        console.warn('Could not initialize Firebase live sync:', err);
        if (isMounted) setCloudSyncStatus('offline');
      }
    };

    // Defer cloud subscription slightly (150ms) so DOM paint and interactive state are 100% instant on phones
    const initTimer = setTimeout(() => {
      if (isMounted) setupSync();
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      unsubscribe?.();
    };
  }, []);

  // Sync to local storage & Cloud Firestore with debouncing
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist portfolio data locally:', e);
    }

    // Skip cloud write if this update was triggered by the remote Firestore snapshot
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    if (!isFirebaseConfigured) return;

    setCloudSyncStatus('syncing');
    const timer = setTimeout(async () => {
      try {
        const [{ doc, setDoc }, { getDb }, { saveResumeDataUrlToFirestore }] = await Promise.all([
          import('firebase/firestore'),
          import('../lib/firebase'),
          import('../lib/resumeStorage')
        ]);
        const firestoreDb = getDb();
        if (!firestoreDb) return;

        let payloadToSave = { ...data };

        // Safeguard: If resumeFile is large raw Base64 (> 250 KB), offload to chunked storage
        if (payloadToSave.hero?.resumeFile && payloadToSave.hero.resumeFile.startsWith('data:') && payloadToSave.hero.resumeFile.length > 250000) {
          try {
            const uploadRes = await saveResumeDataUrlToFirestore(
              payloadToSave.hero.resumeFile,
              payloadToSave.hero.resumeFileName || 'Resume.pdf'
            );
            payloadToSave = {
              ...payloadToSave,
              hero: {
                ...payloadToSave.hero,
                resumeFile: uploadRes.url,
                resume: {
                  ...payloadToSave.hero.resume,
                  url: uploadRes.url,
                  link: uploadRes.url,
                }
              }
            };
          } catch (storageErr) {
            console.warn('Failed to offload large resume to chunked storage:', storageErr);
          }
        }

        await setDoc(doc(firestoreDb, 'portfolio', 'data'), cleanUndefined(payloadToSave), { merge: true });
        setCloudSyncStatus('synced');
        setLastSyncedAt(new Date());
      } catch (e) {
        console.error('Failed to sync changes to Firebase:', e);
        setCloudSyncStatus('error');
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [data]);

  const forceSyncToCloud = async () => {
    if (!isFirebaseConfigured) return;
    setCloudSyncStatus('syncing');
    try {
      const [{ doc, setDoc }, { getDb }] = await Promise.all([
        import('firebase/firestore'),
        import('../lib/firebase')
      ]);
      const firestoreDb = getDb();
      if (!firestoreDb) return;

      await setDoc(doc(firestoreDb, 'portfolio', 'data'), cleanUndefined(data), { merge: true });
      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date());
      soundManager.playSuccess();
    } catch (e) {
      console.error('Manual sync to Firebase failed:', e);
      setCloudSyncStatus('error');
    }
  };

  /**
   * One-click upload from Local Storage to Cloud Database.
   * Reads local storage directly, uploads any avatar or resume, and persists to Firestore.
   */
  const uploadLocalStorageToDatabase = async (): Promise<boolean> => {
    if (!isFirebaseConfigured) return false;
    setCloudSyncStatus('syncing');

    try {
      const [{ doc, setDoc }, { getDb }, { saveResumeDataUrlToFirestore }] = await Promise.all([
        import('firebase/firestore'),
        import('../lib/firebase'),
        import('../lib/resumeStorage')
      ]);
      const firestoreDb = getDb();
      if (!firestoreDb) return false;

      let localData: PortfolioData = data;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          localData = {
            ...defaultPortfolioData,
            ...parsed,
            hero: {
              ...defaultPortfolioData.hero,
              ...(parsed.hero || {}),
              resume: {
                ...defaultPortfolioData.hero.resume,
                ...(parsed.hero?.resume || {})
              }
            }
          };
        }
      } catch {}

      let finalResumeFile = localData.hero?.resumeFile;
      let finalResumeFileName = localData.hero?.resumeFileName || 'Resume.pdf';
      let finalResumeUrl = localData.hero?.resume?.url || localData.hero?.resume?.link;

      // If local resume is Base64 data, store cleanly in chunked Firestore storage
      if (finalResumeFile && finalResumeFile.startsWith('data:')) {
        const res = await saveResumeDataUrlToFirestore(finalResumeFile, finalResumeFileName);
        finalResumeFile = res.url;
        finalResumeUrl = res.url;
      }

      // If avatar is Base64, mirror to portfolio/avatar
      if (localData.hero?.avatarUrl && localData.hero.avatarUrl.startsWith('data:')) {
        try {
          await setDoc(doc(firestoreDb, 'portfolio', 'avatar'), {
            avatarUrl: localData.hero.avatarUrl,
            updatedAt: Date.now(),
          }, { merge: true });
        } catch {}
      }

      const payload: PortfolioData = {
        ...localData,
        hero: {
          ...localData.hero,
          avatarUrl: localData.hero.avatarUrl,
          resumeFile: finalResumeFile,
          resumeFileName: finalResumeFileName,
          resume: {
            ...localData.hero.resume,
            url: finalResumeUrl,
            link: finalResumeUrl,
          }
        }
      };

      await setDoc(doc(firestoreDb, 'portfolio', 'data'), cleanUndefined(payload), { merge: true });
      setData(payload);
      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date());
      soundManager.playSuccess();
      return true;
    } catch (err) {
      console.error('Failed to upload local storage to database:', err);
      setCloudSyncStatus('error');
      soundManager.playClick();
      return false;
    }
  };

  /**
   * Universal Resume download helper.
   */
  const downloadResumeFile = async (fallbackName?: string): Promise<boolean> => {
    const { downloadOrOpenResume } = await import('../lib/resumeStorage');
    return downloadOrOpenResume(
      fallbackName || data.hero.resumeFileName || 'Resume.pdf',
      data.hero.resumeFile || data.hero.resume?.url || data.hero.resume?.link
    );
  };

  /**
   * Send a new contact inquiry message.
   */
  const sendMessage = async (msg: {
    name: string;
    email: string;
    projectType: string;
    budget: string;
    message: string;
  }): Promise<boolean> => {
    try {
      const saved = await saveMessageToStorage(msg);
      setMessages((prev) => [saved, ...prev.filter((m) => m.id !== saved.id)]);
      soundManager.playSuccess();
      return true;
    } catch (e) {
      console.error('Failed to send message:', e);
      return false;
    }
  };

  /**
   * Delete a contact inquiry message.
   */
  const deleteMessage = async (id: string): Promise<boolean> => {
    try {
      await deleteMessageFromStorage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      soundManager.playClick();
      return true;
    } catch (e) {
      console.error('Failed to delete message:', e);
      return false;
    }
  };

  /**
   * Mark message as read or unread.
   */
  const markMessageRead = async (id: string, read: boolean): Promise<boolean> => {
    try {
      await markMessageReadInStorage(id, read);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
      return true;
    } catch (e) {
      console.error('Failed to update message read status:', e);
      return false;
    }
  };

  /**
   * Clear all contact messages.
   */
  const clearAllMessages = async (): Promise<boolean> => {
    try {
      await clearAllMessagesFromStorage();
      setMessages([]);
      soundManager.playClick();
      return true;
    } catch (e) {
      console.error('Failed to clear all messages:', e);
      return false;
    }
  };

  // Sync Light / Dark Mode & Theme on documentElement & body
  useEffect(() => {
    const isDark = data.settings.colorMode !== 'light';
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }

    const { accentTheme, customPrimaryColor, customAccentColor, soundEffects } = data.settings;
    soundManager.enabled = soundEffects ?? true;

    if (accentTheme === 'custom' && customPrimaryColor && customAccentColor) {
      document.body.removeAttribute('data-theme');
      document.documentElement.style.setProperty('--primary-color', customPrimaryColor);
      document.documentElement.style.setProperty('--primary-glow', `${customPrimaryColor}66`);
      document.documentElement.style.setProperty('--accent-color', customAccentColor);
      document.documentElement.style.setProperty('--accent-glow', `${customAccentColor}66`);
    } else {
      document.body.setAttribute('data-theme', accentTheme || 'violet');
      document.documentElement.style.removeProperty('--primary-color');
      document.documentElement.style.removeProperty('--primary-glow');
      document.documentElement.style.removeProperty('--accent-color');
      document.documentElement.style.removeProperty('--accent-glow');
    }
  }, [data.settings.colorMode, data.settings.accentTheme, data.settings.customPrimaryColor, data.settings.customAccentColor, data.settings.soundEffects]);

  // Auth Functions
  const openAdmin = () => {
    if (isAuthenticated) {
      soundManager.playSuccess();
      setIsAdminOpen(true);
    } else {
      soundManager.playClick();
      setIsLoginModalOpen(true);
    }
  };

  const login = (password: string): boolean => {
    const correctPassword = data.settings.adminPassword || 'admin123';
    if (password === correctPassword) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      } catch { }
      setIsLoginModalOpen(false);
      setIsAdminOpen(true);
      soundManager.playSuccess();
      return true;
    }
    soundManager.playClick();
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    } catch { }
    setIsAdminOpen(false);
    soundManager.playClick();
  };

  const changeAdminPassword = (newPass: string) => {
    updateSettings({ adminPassword: newPass });
    soundManager.playSuccess();
  };

  // Mode & Themes
  const colorMode = data.settings.colorMode || 'dark';

  const toggleColorMode = () => {
    const nextMode: ColorMode = colorMode === 'dark' ? 'light' : 'dark';
    updateSettings({ colorMode: nextMode });
    soundManager.playClick();
  };

  const setColorMode = (mode: ColorMode) => {
    updateSettings({ colorMode: mode });
    soundManager.playClick();
  };

  const setAccentTheme = (theme: AccentTheme) => {
    updateSettings({ accentTheme: theme });
    soundManager.playClick();
  };

  const setCustomColors = (primary: string, accent: string) => {
    updateSettings({
      accentTheme: 'custom',
      customPrimaryColor: primary,
      customAccentColor: accent
    });
    soundManager.playClick();
  };

  const toggleSectionVisibility = (section: keyof VisibleSections) => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        visibleSections: {
          ...prev.settings.visibleSections,
          [section]: !prev.settings.visibleSections[section]
        }
      }
    }));
    soundManager.playClick();
  };

  const toggleSound = () => {
    const next = !(data.settings.soundEffects ?? true);
    updateSettings({ soundEffects: next });
    soundManager.enabled = next;
    if (next) soundManager.playSuccess();
  };

  // Section Updates
  const updateHero = (heroUpdates: Partial<HeroData>) => {
    setData(prev => ({
      ...prev,
      hero: { ...prev.hero, ...heroUpdates }
    }));
  };

  const updateAbout = (aboutUpdates: Partial<AboutData>) => {
    setData(prev => ({
      ...prev,
      about: { ...prev.about, ...aboutUpdates }
    }));
  };

  const updateContact = (contactUpdates: Partial<ContactData>) => {
    setData(prev => ({
      ...prev,
      contact: { ...prev.contact, ...contactUpdates }
    }));
  };

  const updateFooter = (footerUpdates: Partial<FooterData>) => {
    setData(prev => ({
      ...prev,
      footer: { ...prev.footer, ...footerUpdates }
    }));
  };

  const updateSettings = (updates: Partial<SiteSettings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  };

  const updateEffectsConfig = (effectsUpdate: Partial<MotionEffectsConfig>) => {
    setData(prev => {
      const current = prev.settings.effectsConfig || defaultPortfolioData.settings.effectsConfig!;
      return {
        ...prev,
        settings: {
          ...prev.settings,
          effectsConfig: {
            ...current,
            ...effectsUpdate,
          }
        }
      };
    });
  };

  // Projects
  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    const newProject: ProjectItem = {
      ...project,
      id: 'proj-' + Date.now()
    };
    setData(prev => ({
      ...prev,
      projects: [newProject, ...prev.projects]
    }));
    soundManager.playSuccess();
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => (p.id === id ? { ...p, ...updates } : p))
    }));
  };

  const deleteProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
    soundManager.playClick();
  };

  // Skills
  const addSkill = (skill: Omit<SkillItem, 'id'>) => {
    const newSkill: SkillItem = {
      ...skill,
      id: 'skill-' + Date.now()
    };
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
    soundManager.playSuccess();
  };

  const updateSkill = (id: string, updates: Partial<SkillItem>) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(s => (s.id === id ? { ...s, ...updates } : s))
    }));
  };

  const deleteSkill = (id: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
    soundManager.playClick();
  };

  // Experience
  const addExperience = (exp: Omit<ExperienceItem, 'id'>) => {
    const newExp: ExperienceItem = {
      ...exp,
      id: 'exp-' + Date.now()
    };
    setData(prev => ({
      ...prev,
      experience: [newExp, ...prev.experience]
    }));
    soundManager.playSuccess();
  };

  const updateExperience = (id: string, updates: Partial<ExperienceItem>) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e => (e.id === id ? { ...e, ...updates } : e))
    }));
  };

  const deleteExperience = (id: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id)
    }));
    soundManager.playClick();
  };

  // Testimonials
  const addTestimonial = (item: Omit<TestimonialItem, 'id'>) => {
    const newTestimonial: TestimonialItem = {
      ...item,
      id: 'test-' + Date.now()
    };
    setData(prev => ({
      ...prev,
      testimonials: [newTestimonial, ...prev.testimonials]
    }));
    soundManager.playSuccess();
  };

  const updateTestimonial = (id: string, updates: Partial<TestimonialItem>) => {
    setData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => (t.id === id ? { ...t, ...updates } : t))
    }));
  };

  const deleteTestimonial = (id: string) => {
    setData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(t => t.id !== id)
    }));
    soundManager.playClick();
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isAdminOpen,
        setIsAdminOpen,
        adminView,
        setAdminView,
        cloudSyncStatus,
        lastSyncedAt,
        isCloudConnected: isFirebaseConfigured,
        forceSyncToCloud,
        uploadLocalStorageToDatabase,
        downloadResumeFile,
        messages,
        unreadMessagesCount,
        sendMessage,
        deleteMessage,
        markMessageRead,
        clearAllMessages,
        isAuthenticated,
        isLoginModalOpen,
        setIsLoginModalOpen,
        openAdmin,
        login,
        logout,
        changeAdminPassword,
        colorMode,
        toggleColorMode,
        setColorMode,
        setAccentTheme,
        setCustomColors,
        toggleSectionVisibility,
        toggleSound,
        updateHero,
        updateAbout,
        updateContact,
        updateFooter,
        updateSettings,
        updateEffectsConfig,
        addProject,
        updateProject,
        deleteProject,
        addSkill,
        updateSkill,
        deleteSkill,
        addExperience,
        updateExperience,
        deleteExperience,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
