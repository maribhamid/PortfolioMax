export interface StatItem {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  icon: string;
}

export interface ButtonCTA {
  label: string;
  link: string;
  url?: string;
  show: boolean;
}

export interface AvatarAdjustments {
  scale?: number; // 1 to 2.5
  offsetX?: number; // -50 to 50
  offsetY?: number; // -50 to 50
  brightness?: number; // 70 to 150
  contrast?: number; // 70 to 150
  saturation?: number; // 0 to 200
  shape?: 'squircle' | 'circle' | 'rounded';
}

export interface HeroData {
  name: string;
  roles: string[];
  tagline: string;
  bio: string;
  avatarUrl: string;
  avatarAdjustments?: AvatarAdjustments;
  status: string;
  location: string;
  ctaPrimary: ButtonCTA;
  ctaSecondary: ButtonCTA;
  resume: ButtonCTA;
  resumeFile?: string; // Base64 data URI of uploaded resume PDF
  resumeFileName?: string;
  stats: StatItem[];
}

export interface HighlightItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface AboutData {
  badge: string;
  title: string;
  subtitle: string;
  missionBadge: string;
  storyHeading: string;
  storyParagraph1: string;
  storyParagraph2: string;
  terminalCmd: string;
  terminalOutputs: string[];
  highlights: HighlightItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
  demoUrl: string;
  githubUrl: string;
  metrics?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'AI & Cloud' | 'Tools & Design';
  level: number;
  icon: string;
  highlight?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface ContactData {
  badge: string;
  title: string;
  subtitle: string;
  directHeading: string;
  directDesc: string;
  email: string;
  phone: string;
  location: string;
  responseTime: string;
  statusText: string;
  socials: SocialLink[];
  projectTypes: string[];
  budgets: string[];
}

export interface FooterData {
  brandText: string;
  timezoneCity: string;
  statusText: string;
  copyrightText: string;
  creditText: string;
}

export type AccentTheme = 'violet' | 'cyan' | 'emerald' | 'rose' | 'amber' | 'custom';
export type ColorMode = 'dark' | 'light';

export interface VisibleSections {
  hero: boolean;
  about: boolean;
  projects: boolean;
  skills: boolean;
  experience: boolean;
  testimonials: boolean;
  contact: boolean;
}

export type CursorStyle = 'neon-ring' | 'cyber-crosshair' | 'glow-orb' | 'minimal-dot';
export type Shape3D = 'icosahedron' | 'cube' | 'torus';
export type ScrollIntensity = 'subtle' | 'standard' | 'energetic';

export interface MotionEffectsConfig {
  customCursor: {
    enabled: boolean;
    style: CursorStyle;
    size: number; // 20 to 60px
    glowIntensity: number; // 0.2 to 1.0
  };
  magneticButtons: {
    enabled: boolean;
    strength: number; // 0.1 to 0.6
  };
  cursorSpotlight: {
    enabled: boolean;
    radius: number; // 200 to 800px
    opacity: number; // 0.05 to 0.4
  };
  interactiveBackground: {
    particles: boolean;
    retroGrid: boolean;
    meteors: boolean;
    particleDensity: 'low' | 'medium' | 'high' | 'off';
  };
  floating3D: {
    enabled: boolean;
    shape: Shape3D;
    speed: number; // 0.5 to 3.0
    scale: number; // 0.6 to 1.5
  };
  scrollAnimations: {
    enabled: boolean;
    intensity: ScrollIntensity;
  };
}

export interface SiteSettings {
  colorMode: ColorMode; // 'dark' (default) or 'light'
  accentTheme: AccentTheme;
  customPrimaryColor?: string;
  customAccentColor?: string;
  soundEffects: boolean;
  particleDensity: 'low' | 'medium' | 'high' | 'off';
  showMeteors: boolean;
  showRetroGrid: boolean;
  showAvailabilityBadge: boolean;
  visibleSections: VisibleSections;
  adminUsername?: string;
  adminPassword?: string;
  effectsConfig?: MotionEffectsConfig;
}

export interface PortfolioData {
  _updatedAt?: number;
  hero: HeroData;
  about: AboutData;
  projects: ProjectItem[];
  skills: SkillItem[];
  experience: ExperienceItem[];
  testimonials: TestimonialItem[];
  contact: ContactData;
  footer: FooterData;
  settings: SiteSettings;
}

export type MessagePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  projectType: string;
  priority: MessagePriority;
  budget?: string;
  message: string;
  createdAt: number; // timestamp in ms
  read: boolean;
}

