import React, { createContext, useContext, useState, useEffect } from 'react';
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
  MotionEffectsConfig
} from '../types/portfolio';
import { defaultPortfolioData } from '../data/defaultData';
import { soundManager } from '../utils/audio';

const STORAGE_KEY = 'portfolio_cms_v3_data';
const AUTH_SESSION_KEY = 'portfolio_admin_auth';

interface PortfolioContextType {
  data: PortfolioData;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminView: 'full' | 'split';
  setAdminView: (view: 'full' | 'split') => void;

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

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist portfolio data:', e);
    }
  }, [data]);

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
