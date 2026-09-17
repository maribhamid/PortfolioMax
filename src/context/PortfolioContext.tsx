import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
  ContactMessage,
  MessagePriority
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
const AUTH_SESSION_KEY = 'portfolio_admin_auth_v2';

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

export interface ActiveInquiryAlert {
  id: string;
  title: string;
  body: string;
  priority?: MessagePriority;
  timestamp: number;
}

export type SaveStatus = 'saved' | 'saving' | 'unsaved';

interface PortfolioContextType {
  data: PortfolioData;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminView: 'full' | 'split';
  setAdminView: (view: 'full' | 'split') => void;

  // Cloud Sync & Real-Time Save State
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncedAt: Date | null;
  isCloudConnected: boolean;
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  saveAllChanges: () => Promise<boolean>;
  discardChanges: () => void;
  forceSyncToCloud: () => Promise<void>;
  uploadLocalStorageToDatabase: () => Promise<boolean>;
  downloadResumeFile: (fileName?: string) => Promise<boolean>;

  // Contact Inquiries & Messages
  messages: ContactMessage[];
  unreadMessagesCount: number;
  inquiryAlert: ActiveInquiryAlert | null;
  dismissInquiryAlert: () => void;
  sendMessage: (msg: { name: string; email: string; projectType: string; priority: MessagePriority; message: string; budget?: string }) => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;
  markMessageRead: (id: string, read: boolean) => Promise<boolean>;
  clearAllMessages: () => Promise<boolean>;

  // Authentication & Authorization
  isAuthenticated: boolean;
  adminUser: { email: string; role: string } | null;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  openAdmin: () => void;
  // Install App Modal
  isInstallModalOpen: boolean;
  setIsInstallModalOpen: (open: boolean) => void;
  openInstallModal: () => void;

  login: (username: string, password: string) => boolean;
  logout: () => void;
  changeAdminPassword: (newPass: string) => void;
  changeAdminCredentials?: (newUsername: string, newPass: string) => void;

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
  // Initialize state from localStorage with fallback & legacy upgrade
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);

        // Upgrade legacy "Alex Vance" template default to "Marib Hamid"
        const resolvedName =
          parsed.hero?.name && parsed.hero.name !== 'Alex Vance'
            ? parsed.hero.name
            : defaultPortfolioData.hero.name;

        const resolvedProjects =
          Array.isArray(parsed.projects) && parsed.projects.length > 0
            ? parsed.projects
            : defaultPortfolioData.projects;

        const resolvedSkills =
          Array.isArray(parsed.skills) && parsed.skills.length > 0
            ? parsed.skills
            : defaultPortfolioData.skills;

        const resolvedExperience =
          Array.isArray(parsed.experience) && parsed.experience.length > 0
            ? parsed.experience
            : defaultPortfolioData.experience;

        const resolvedTestimonials =
          Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0
            ? parsed.testimonials
            : defaultPortfolioData.testimonials;

        return {
          ...defaultPortfolioData,
          ...parsed,
          _updatedAt: parsed._updatedAt || Date.now(),
          hero: {
            ...defaultPortfolioData.hero,
            ...(parsed.hero || {}),
            name: resolvedName,
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
          about: {
            ...defaultPortfolioData.about,
            ...(parsed.about || {}),
            terminalCmd:
              parsed.about?.terminalCmd && !parsed.about.terminalCmd.includes('Alex Vance')
                ? parsed.about.terminalCmd
                : defaultPortfolioData.about.terminalCmd
          },
          projects: resolvedProjects,
          skills: resolvedSkills,
          experience: resolvedExperience,
          testimonials: resolvedTestimonials,
          contact: {
            ...defaultPortfolioData.contact,
            ...(parsed.contact || {}),
            email:
              parsed.contact?.email && !parsed.contact.email.includes('alex.vance')
                ? parsed.contact.email
                : defaultPortfolioData.contact.email,
            projectTypes: parsed.contact?.projectTypes?.length
              ? parsed.contact.projectTypes
              : defaultPortfolioData.contact.projectTypes,
            budgets: parsed.contact?.budgets?.length
              ? parsed.contact.budgets
              : defaultPortfolioData.contact.budgets,
          },
          footer: {
            ...defaultPortfolioData.footer,
            ...(parsed.footer || {}),
            brandText:
              parsed.footer?.brandText && parsed.footer.brandText !== 'AV'
                ? parsed.footer.brandText
                : defaultPortfolioData.footer.brandText
          },
          settings: {
            ...defaultPortfolioData.settings,
            ...(parsed.settings || {}),
            colorMode: parsed.settings?.colorMode || 'dark',
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

  // Authentication state & admin user info
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(() => {
    try {
      const saved = sessionStorage.getItem(AUTH_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.authenticated && parsed?.email) {
          return { email: parsed.email, role: parsed.role || 'superadmin' };
        }
      }
    } catch { }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(adminUser));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  const openInstallModal = () => {
    soundManager.playClick();
    setIsInstallModalOpen(true);
  };

  // Cloud sync & Save status
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>(() => {
    return isFirebaseConfigured ? 'syncing' : 'offline';
  });
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(() => new Date());

  // Refs for bulletproof concurrency and conflict resolution
  const saveStatusRef = useRef<SaveStatus>('saved');
  saveStatusRef.current = saveStatus;
  const lastSavedRemoteDataRef = useRef<PortfolioData>(data);
  const localLastEditedAtRef = useRef<number>(0);
  const lastSyncedJsonRef = useRef<string>('');
  const isSavingRef = useRef<boolean>(false);
  const currentDataRef = useRef<PortfolioData>(data);
  currentDataRef.current = data;

  // Contact messages state & real-time notification engine
  const [messages, setMessages] = useState<ContactMessage[]>(() => getLocalMessages());
  const unreadMessagesCount = messages.filter((m) => !m.read).length;
  const [inquiryAlert, setInquiryAlert] = useState<ActiveInquiryAlert | null>(null);

  const knownMessageIdsRef = useRef<Set<string>>(new Set());
  const isInitialMessagesLoadRef = useRef<boolean>(true);
  const hasNotifiedInitialUnreadRef = useRef<boolean>(false);

  const dismissInquiryAlert = () => {
    setInquiryAlert(null);
  };

  /**
   * Universal notification dispatcher
   */
  const triggerNotification = (title: string, body: string, priority?: MessagePriority, id?: string) => {
    soundManager.playNotification();

    setInquiryAlert({
      id: id || Date.now().toString(),
      title,
      body,
      priority,
      timestamp: Date.now(),
    });

    try {
      if (typeof window !== 'undefined' && window.electronAPI?.showNotification) {
        window.electronAPI.showNotification(title, body);
      } else if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          const n = new Notification(title, {
            body,
            icon: '/favicon.ico',
          });
          n.onclick = () => {
            window.focus();
            setIsAdminOpen(true);
          };
        } else if (Notification.permission === 'default') {
          Notification.requestPermission().then((perm) => {
            if (perm === 'granted') {
              const n = new Notification(title, {
                body,
                icon: '/favicon.ico',
              });
              n.onclick = () => {
                window.focus();
                setIsAdminOpen(true);
              };
            }
          }).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Native notification error:', e);
    }
  };

  // Subscribe to contact messages
  useEffect(() => {
    const unsub = subscribeToMessages((updated) => {
      if (isInitialMessagesLoadRef.current) {
        updated.forEach((m) => knownMessageIdsRef.current.add(m.id));
        isInitialMessagesLoadRef.current = false;
        setMessages(updated);
        return;
      }

      const newMessages = updated.filter((m) => !knownMessageIdsRef.current.has(m.id));
      updated.forEach((m) => knownMessageIdsRef.current.add(m.id));
      setMessages(updated);

      if (newMessages.length > 0 && isAuthenticated) {
        const latest = newMessages[0];
        const extraCount = newMessages.length > 1 ? ` (+${newMessages.length - 1} more)` : '';
        const priorityLabel = (latest.priority || 'medium').toUpperCase();
        triggerNotification(
          `🔔 New Inquiry: ${latest.name}${extraCount}`,
          `[${priorityLabel} PRIORITY] ${latest.projectType}\n"${latest.message.slice(0, 80)}${latest.message.length > 80 ? '...' : ''}"`,
          latest.priority,
          latest.id
        );
      }
    });
    return () => unsub();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !hasNotifiedInitialUnreadRef.current && !isInitialMessagesLoadRef.current) {
      const unread = messages.filter((m) => !m.read);
      if (unread.length > 0) {
        hasNotifiedInitialUnreadRef.current = true;
        setTimeout(() => {
          triggerNotification(
            `📬 Unread Inquiries Waiting`,
            `You have ${unread.length} unread ${unread.length === 1 ? 'message' : 'messages'} in your inbox. Click to review.`,
            unread.some((m) => m.priority === 'urgent') ? 'urgent' : 'medium'
          );
        }, 600);
      }
    }
  }, [isAuthenticated, messages]);

  /**
   * Primary Firestore write executor
   */
  const persistToFirestore = useCallback(async (dataToPersist: PortfolioData, isExplicitSave = false): Promise<boolean> => {
    if (!isFirebaseConfigured) {
      setCloudSyncStatus('offline');
      setSaveStatus('saved');
      saveStatusRef.current = 'saved';
      return true;
    }

    // Strictly require authentication to write to Firestore
    if (!isAuthenticated) {
      console.warn('Blocked unauthorized write to Firestore');
      setCloudSyncStatus('offline');
      setSaveStatus('saved');
      saveStatusRef.current = 'saved';
      return false;
    }

    const payloadString = JSON.stringify(cleanUndefined(dataToPersist));
    // Avoid redundant network write if already synchronized
    if (!isExplicitSave && payloadString === lastSyncedJsonRef.current) {
      setSaveStatus('saved');
      saveStatusRef.current = 'saved';
      setCloudSyncStatus('synced');
      return true;
    }

    setCloudSyncStatus('syncing');
    setSaveStatus('saving');
    saveStatusRef.current = 'saving';
    isSavingRef.current = true;

    try {
      const [{ doc, setDoc }, { getDb }, { saveResumeDataUrlToFirestore }] = await Promise.all([
        import('firebase/firestore'),
        import('../lib/firebase'),
        import('../lib/resumeStorage')
      ]);

      const firestoreDb = getDb();
      if (!firestoreDb) {
        setCloudSyncStatus('offline');
        setSaveStatus('saved');
        return false;
      }

      let payload: PortfolioData = { ...dataToPersist };

      // Offload large Base64 resume to chunked Firestore storage
      if (
        payload.hero?.resumeFile &&
        payload.hero.resumeFile.startsWith('data:') &&
        payload.hero.resumeFile.length > 250000
      ) {
        try {
          const uploadRes = await saveResumeDataUrlToFirestore(
            payload.hero.resumeFile,
            payload.hero.resumeFileName || 'Resume.pdf'
          );
          payload = {
            ...payload,
            hero: {
              ...payload.hero,
              resumeFile: uploadRes.url,
              resume: {
                ...payload.hero.resume,
                url: uploadRes.url,
                link: uploadRes.url,
              }
            }
          };
        } catch (storageErr) {
          console.warn('Failed to offload large resume to chunked storage:', storageErr);
        }
      }

      const cleaned = cleanUndefined(payload);
      await setDoc(doc(firestoreDb, 'portfolio', 'data'), cleaned, { merge: true });

      lastSyncedJsonRef.current = JSON.stringify(cleaned);
      setCloudSyncStatus('synced');
      setSaveStatus('saved');
      const now = new Date();
      setLastSyncedAt(now);
      setLastSavedAt(now);
      return true;
    } catch (e) {
      console.error('Failed to sync changes to Firebase:', e);
      setCloudSyncStatus('error');
      setSaveStatus('unsaved');
      return false;
    } finally {
      isSavingRef.current = false;
    }
  }, []);

  /**
   * Centralized State Updater:
   * 1. Updates state and stamps _updatedAt.
   * 2. Immediately writes synchronously to localStorage.
   * 3. Sets saveStatus to 'unsaved'.
   * 4. Debounces write to Firestore (400ms).
   */
  const updateData = useCallback((updater: (prev: PortfolioData) => PortfolioData) => {
    localLastEditedAtRef.current = Date.now();
    setSaveStatus('unsaved');
    saveStatusRef.current = 'unsaved';

    setData((prev) => {
      const next = updater(prev);
      const withTimestamp: PortfolioData = {
        ...next,
        _updatedAt: Date.now()
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(withTimestamp));
      } catch (e) {
        console.error('Failed to persist portfolio data locally:', e);
      }

      currentDataRef.current = withTimestamp;
      return withTimestamp;
    });
  }, []);

  // Save drafts locally on edit without touching Firestore
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist portfolio data locally:', e);
    }

    const json = JSON.stringify(cleanUndefined(data));
    if (json === lastSyncedJsonRef.current) {
      setSaveStatus('saved');
      saveStatusRef.current = 'saved';
    } else {
      setSaveStatus('unsaved');
      saveStatusRef.current = 'unsaved';
    }
  }, [data]);

  // Real-time Firestore Cloud listener: STRICTLY READ-ONLY for reliable multi-client viewing
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
        const [{ doc, onSnapshot }, { getDb }] = await Promise.all([
          import('firebase/firestore'),
          import('../lib/firebase')
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

            // 1. Ignore echo of local writes that haven't been committed yet
            if (snapshot.metadata.hasPendingWrites) {
              return;
            }

            if (snapshot.exists()) {
              const remoteData = snapshot.data() as Partial<PortfolioData>;
              const remoteUpdatedAt = remoteData._updatedAt || 0;

              setData((prev) => {
                // If the user has active unsaved draft edits in progress, preserve their draft!
                if (saveStatusRef.current === 'unsaved') {
                  return prev;
                }

                // Construct clean merged portfolio data from Firestore
                const merged: PortfolioData = {
                  ...defaultPortfolioData,
                  ...remoteData,
                  _updatedAt: remoteUpdatedAt,
                  hero: {
                    ...defaultPortfolioData.hero,
                    ...(remoteData.hero || {}),
                    resume: {
                      ...defaultPortfolioData.hero.resume,
                      ...(remoteData.hero?.resume || {}),
                    },
                    ctaPrimary: {
                      ...defaultPortfolioData.hero.ctaPrimary,
                      ...(remoteData.hero?.ctaPrimary || {}),
                    },
                    ctaSecondary: {
                      ...defaultPortfolioData.hero.ctaSecondary,
                      ...(remoteData.hero?.ctaSecondary || {}),
                    },
                  },
                  about: {
                    ...defaultPortfolioData.about,
                    ...(remoteData.about || {}),
                  },
                  projects: Array.isArray(remoteData.projects) && remoteData.projects.length > 0
                    ? remoteData.projects
                    : defaultPortfolioData.projects,
                  skills: Array.isArray(remoteData.skills) && remoteData.skills.length > 0
                    ? remoteData.skills
                    : defaultPortfolioData.skills,
                  experience: Array.isArray(remoteData.experience) && remoteData.experience.length > 0
                    ? remoteData.experience
                    : defaultPortfolioData.experience,
                  testimonials: Array.isArray(remoteData.testimonials) && remoteData.testimonials.length > 0
                    ? remoteData.testimonials
                    : defaultPortfolioData.testimonials,
                  contact: {
                    ...defaultPortfolioData.contact,
                    ...(remoteData.contact || {}),
                    projectTypes: remoteData.contact?.projectTypes?.length ? remoteData.contact.projectTypes : defaultPortfolioData.contact.projectTypes,
                    budgets: remoteData.contact?.budgets?.length ? remoteData.contact.budgets : defaultPortfolioData.contact.budgets,
                  },
                  footer: {
                    ...defaultPortfolioData.footer,
                    ...(remoteData.footer || {}),
                  },
                  settings: {
                    ...defaultPortfolioData.settings,
                    adminUsername: remoteData.settings?.adminUsername || defaultPortfolioData.settings.adminUsername || 'maribhamid@port.com',
                    adminPassword: remoteData.settings?.adminPassword || defaultPortfolioData.settings.adminPassword || 'admin123',
                    ...(remoteData.settings || {}),
                    visibleSections: {
                      ...defaultPortfolioData.settings.visibleSections,
                      ...(remoteData.settings?.visibleSections || {}),
                    },
                    effectsConfig: {
                      ...defaultPortfolioData.settings.effectsConfig!,
                      ...(remoteData.settings?.effectsConfig || {}),
                    },
                  },
                };

                lastSyncedJsonRef.current = JSON.stringify(cleanUndefined(merged));
                lastSavedRemoteDataRef.current = merged;
                try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                } catch {}
                currentDataRef.current = merged;
                return merged;
              });

              setCloudSyncStatus('synced');
              setSaveStatus('saved');
              saveStatusRef.current = 'saved';
              setLastSyncedAt(new Date());
            } else {
              setCloudSyncStatus('synced');
            }
          },
          (error) => {
            console.warn('Firestore subscription notice (using offline mode):', error.message || error);
            if (isMounted) setCloudSyncStatus('offline');
          }
        );
      } catch (err) {
        console.warn('Could not initialize Firebase live sync:', err);
        if (isMounted) setCloudSyncStatus('offline');
      }
    };

    const handleReSync = () => {
      if (!isMounted) return;
      if (!unsubscribe) {
        setupSync();
      }
    };

    window.addEventListener('online', handleReSync);
    window.addEventListener('focus', handleReSync);

    const initTimer = setTimeout(() => {
      if (isMounted) setupSync();
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      window.removeEventListener('online', handleReSync);
      window.removeEventListener('focus', handleReSync);
      unsubscribe?.();
    };
  }, []);

  /**
   * Explicit Save All Changes action:
   * ONLY when this function is invoked does Firestore update!
   */
  const saveAllChanges = async (): Promise<boolean> => {
    if (!isAuthenticated) {
      console.warn('Unauthorized save attempt blocked');
      soundManager.playClick();
      return false;
    }

    setSaveStatus('saving');
    saveStatusRef.current = 'saving';
    isSavingRef.current = true;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentDataRef.current));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    const ok = await persistToFirestore(currentDataRef.current, true);
    if (ok) {
      lastSavedRemoteDataRef.current = currentDataRef.current;
      setSaveStatus('saved');
      saveStatusRef.current = 'saved';
      setLastSavedAt(new Date());
      soundManager.playSuccess();
    } else {
      setSaveStatus('unsaved');
      saveStatusRef.current = 'unsaved';
      soundManager.playClick();
    }
    return ok;
  };

  /**
   * Discard in-memory draft and revert to the saved Firestore state
   */
  const discardChanges = () => {
    if (lastSavedRemoteDataRef.current) {
      setData(lastSavedRemoteDataRef.current);
      currentDataRef.current = lastSavedRemoteDataRef.current;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lastSavedRemoteDataRef.current));
      } catch {}
    }
    setSaveStatus('saved');
    saveStatusRef.current = 'saved';
    soundManager.playClick();
  };

  const forceSyncToCloud = async () => {
    if (isAuthenticated && saveStatusRef.current === 'unsaved') {
      await saveAllChanges();
      return;
    }

    if (!isFirebaseConfigured) return;
    try {
      setCloudSyncStatus('syncing');
      const [{ doc, getDoc }, { getDb }] = await Promise.all([
        import('firebase/firestore'),
        import('../lib/firebase')
      ]);
      const firestoreDb = getDb();
      if (!firestoreDb) return;
      const snap = await getDoc(doc(firestoreDb, 'portfolio', 'data'));
      if (snap.exists()) {
        const remoteData = snap.data() as Partial<PortfolioData>;
        if (saveStatusRef.current !== 'unsaved') {
          setData((prev) => {
            const merged: PortfolioData = {
              ...defaultPortfolioData,
              ...remoteData,
              settings: {
                ...defaultPortfolioData.settings,
                ...(remoteData.settings || {}),
                visibleSections: {
                  ...defaultPortfolioData.settings.visibleSections,
                  ...(remoteData.settings?.visibleSections || {}),
                },
              },
            };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch {}
            currentDataRef.current = merged;
            return merged;
          });
        }
        setCloudSyncStatus('synced');
        setLastSyncedAt(new Date());
      }
    } catch (e) {
      console.warn('Failed to force sync from cloud:', e);
    }
  };

  /**
   * One-click upload from Local Storage to Cloud Database
   */
  const uploadLocalStorageToDatabase = async (): Promise<boolean> => {
    if (!isFirebaseConfigured) return false;
    setCloudSyncStatus('syncing');
    setSaveStatus('saving');

    try {
      const [{ doc, setDoc }, { getDb }, { saveResumeDataUrlToFirestore }] = await Promise.all([
        import('firebase/firestore'),
        import('../lib/firebase'),
        import('../lib/resumeStorage')
      ]);
      const firestoreDb = getDb();
      if (!firestoreDb) return false;

      let localData: PortfolioData = currentDataRef.current;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          localData = {
            ...defaultPortfolioData,
            ...parsed,
            _updatedAt: Date.now(),
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

      if (finalResumeFile && finalResumeFile.startsWith('data:')) {
        const res = await saveResumeDataUrlToFirestore(finalResumeFile, finalResumeFileName);
        finalResumeFile = res.url;
        finalResumeUrl = res.url;
      }

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
        _updatedAt: Date.now(),
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

      const cleaned = cleanUndefined(payload);
      await setDoc(doc(firestoreDb, 'portfolio', 'data'), cleaned, { merge: true });
      setData(payload);
      currentDataRef.current = payload;
      lastSyncedJsonRef.current = JSON.stringify(cleaned);
      setCloudSyncStatus('synced');
      setSaveStatus('saved');
      const now = new Date();
      setLastSyncedAt(now);
      setLastSavedAt(now);
      soundManager.playSuccess();
      return true;
    } catch (err) {
      console.error('Failed to upload local storage to database:', err);
      setCloudSyncStatus('error');
      setSaveStatus('unsaved');
      soundManager.playClick();
      return false;
    }
  };

  /**
   * Universal Resume download helper
   */
  const downloadResumeFile = async (fallbackName?: string): Promise<boolean> => {
    const { downloadOrOpenResume } = await import('../lib/resumeStorage');
    return downloadOrOpenResume(
      fallbackName || data.hero.resumeFileName || 'Resume.pdf',
      data.hero.resumeFile || data.hero.resume?.url || data.hero.resume?.link
    );
  };

  /**
   * Send a new contact inquiry message
   */
  const sendMessage = async (msg: {
    name: string;
    email: string;
    projectType: string;
    priority: MessagePriority;
    message: string;
    budget?: string;
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
   * Delete a contact inquiry message
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
   * Mark message as read or unread
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
   * Clear all contact messages
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

  const login = (usernameInput: string, passwordInput: string): boolean => {
    const configuredUsername = data.settings.adminUsername || 'maribhamid@port.com';
    const configuredPassword = data.settings.adminPassword || 'admin123';

    const isUserMatch = usernameInput.trim().toLowerCase() === configuredUsername.trim().toLowerCase();
    const isPassMatch = passwordInput === configuredPassword;

    if (isUserMatch && isPassMatch) {
      setIsAuthenticated(true);
      const user = { email: configuredUsername, role: 'superadmin' };
      setAdminUser(user);
      try {
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
          authenticated: true,
          email: configuredUsername,
          role: 'superadmin',
          timestamp: Date.now()
        }));
      } catch { }
      setIsLoginModalOpen(false);
      setIsAdminOpen(true);
      soundManager.playSuccess();

      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }

      const unread = messages.filter((m) => !m.read);
      if (unread.length > 0) {
        setTimeout(() => {
          triggerNotification(
            `📬 Unread Inquiries Waiting`,
            `You have ${unread.length} unread ${unread.length === 1 ? 'message' : 'messages'} in your inbox. Click to review.`,
            unread.some((m) => m.priority === 'urgent') ? 'urgent' : 'medium'
          );
        }, 500);
      }

      return true;
    }
    soundManager.playClick();
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
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

  const changeAdminCredentials = (newUsername: string, newPass: string) => {
    updateSettings({
      adminUsername: newUsername.trim(),
      adminPassword: newPass
    });
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
    updateData((prev) => ({
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

  // Section Updates with updateData wrapper
  const updateHero = (heroUpdates: Partial<HeroData>) => {
    updateData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...heroUpdates }
    }));
  };

  const updateAbout = (aboutUpdates: Partial<AboutData>) => {
    updateData((prev) => ({
      ...prev,
      about: { ...prev.about, ...aboutUpdates }
    }));
  };

  const updateContact = (contactUpdates: Partial<ContactData>) => {
    updateData((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...contactUpdates }
    }));
  };

  const updateFooter = (footerUpdates: Partial<FooterData>) => {
    updateData((prev) => ({
      ...prev,
      footer: { ...prev.footer, ...footerUpdates }
    }));
  };

  const updateSettings = (updates: Partial<SiteSettings>) => {
    updateData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  };

  const updateEffectsConfig = (effectsUpdate: Partial<MotionEffectsConfig>) => {
    updateData((prev) => {
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

  // Projects CRUD
  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    const newProject: ProjectItem = {
      ...project,
      id: 'proj-' + Date.now()
    };
    updateData((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects]
    }));
    soundManager.playSuccess();
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    updateData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p))
    }));
  };

  const deleteProject = (id: string) => {
    updateData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
    soundManager.playClick();
  };

  // Skills CRUD
  const addSkill = (skill: Omit<SkillItem, 'id'>) => {
    const newSkill: SkillItem = {
      ...skill,
      id: 'skill-' + Date.now()
    };
    updateData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
    soundManager.playSuccess();
  };

  const updateSkill = (id: string, updates: Partial<SkillItem>) => {
    updateData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...updates } : s))
    }));
  };

  const deleteSkill = (id: string) => {
    updateData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id)
    }));
    soundManager.playClick();
  };

  // Experience CRUD
  const addExperience = (exp: Omit<ExperienceItem, 'id'>) => {
    const newExp: ExperienceItem = {
      ...exp,
      id: 'exp-' + Date.now()
    };
    updateData((prev) => ({
      ...prev,
      experience: [newExp, ...prev.experience]
    }));
    soundManager.playSuccess();
  };

  const updateExperience = (id: string, updates: Partial<ExperienceItem>) => {
    updateData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, ...updates } : e))
    }));
  };

  const deleteExperience = (id: string) => {
    updateData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id)
    }));
    soundManager.playClick();
  };

  // Testimonials CRUD
  const addTestimonial = (item: Omit<TestimonialItem, 'id'>) => {
    const newTestimonial: TestimonialItem = {
      ...item,
      id: 'test-' + Date.now()
    };
    updateData((prev) => ({
      ...prev,
      testimonials: [newTestimonial, ...prev.testimonials]
    }));
    soundManager.playSuccess();
  };

  const updateTestimonial = (id: string, updates: Partial<TestimonialItem>) => {
    updateData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) => (t.id === id ? { ...t, ...updates } : t))
    }));
  };

  const deleteTestimonial = (id: string) => {
    updateData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id)
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
        saveStatus,
        lastSavedAt,
        saveAllChanges,
        discardChanges,
        forceSyncToCloud,
        uploadLocalStorageToDatabase,
        downloadResumeFile,
        messages,
        unreadMessagesCount,
        inquiryAlert,
        dismissInquiryAlert,
        sendMessage,
        deleteMessage,
        markMessageRead,
        clearAllMessages,
        isAuthenticated,
        adminUser,
        isLoginModalOpen,
        setIsLoginModalOpen,
        openAdmin,
        isInstallModalOpen,
        setIsInstallModalOpen,
        openInstallModal,
        login,
        logout,
        changeAdminPassword,
        changeAdminCredentials,
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
