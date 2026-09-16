import React, { useEffect, useState } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { ParticlesBackground } from './components/ui/ParticlesBackground';
import { Meteors } from './components/ui/Meteors';
import { RetroGrid } from './components/ui/RetroGrid';
import { InteractiveCursor } from './components/ui/InteractiveCursor';
import { CursorSpotlight } from './components/ui/CursorSpotlight';
import { Hero } from './components/portfolio/Hero';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { Dock } from './components/ui/Dock';
import { TopHeader } from './components/portfolio/TopHeader';
import { DesktopTitlebar } from './components/ui/DesktopTitlebar';
import { InquiryNotificationToast } from './components/ui/InquiryNotificationToast';
import { initCapacitorNativeMobile } from './utils/capacitorMobile';
import { soundManager } from './utils/audio';

/**
 * Resilient lazy loader with automatic retry on cellular network drop.
 * Gracefully resolves to a null component if all retries fail, preventing blank-screen crashes.
 */
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 2,
  interval = 1000
): React.LazyExoticComponent<T> {
  return React.lazy(() =>
    new Promise<{ default: T }>((resolve) => {
      const attempt = (remainingRetries: number) => {
        factory()
          .then(resolve)
          .catch((error) => {
            if (remainingRetries <= 0) {
              console.warn('Chunk load error after retries (preventing app crash):', error);
              // Gracefully return empty component so the app stays functional
              resolve({ default: (() => null) as unknown as T });
              return;
            }
            setTimeout(() => attempt(remainingRetries - 1), interval);
          });
      };
      attempt(retries);
    })
  );
}

// Section Error Boundary to isolate below-the-fold component failures
class SectionErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('Caught section render exception:', error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// Lazy-load below-the-fold sections with retry protection
const About = lazyWithRetry(() =>
  import('./components/portfolio/About').then((m) => ({ default: m.About }))
);
const Projects = lazyWithRetry(() =>
  import('./components/portfolio/Projects').then((m) => ({ default: m.Projects }))
);
const Skills = lazyWithRetry(() =>
  import('./components/portfolio/Skills').then((m) => ({ default: m.Skills }))
);
const Experience = lazyWithRetry(() =>
  import('./components/portfolio/Experience').then((m) => ({ default: m.Experience }))
);
const Testimonials = lazyWithRetry(() =>
  import('./components/portfolio/Testimonials').then((m) => ({ default: m.Testimonials }))
);
const Contact = lazyWithRetry(() =>
  import('./components/portfolio/Contact').then((m) => ({ default: m.Contact }))
);
const Footer = lazyWithRetry(() =>
  import('./components/portfolio/Footer').then((m) => ({ default: m.Footer }))
);

// Lazy-load Admin CMS components (only fetched when opened)
const AdminDashboard = lazyWithRetry(() =>
  import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminLoginModal = lazyWithRetry(() =>
  import('./components/admin/AdminLoginModal').then((m) => ({ default: m.AdminLoginModal }))
);

const PortfolioContent: React.FC = () => {
  const {
    data,
    isAdminOpen,
    setIsAdminOpen,
    adminView,
    openAdmin,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isAuthenticated,
  } = usePortfolio();
  const { settings } = data;
  const { visibleSections } = settings;
  const bgConfig = settings.effectsConfig?.interactiveBackground;

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcut Ctrl+E or Cmd+E to toggle Admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        soundManager.playSuccess();
        if (isAdminOpen) {
          setIsAdminOpen(false);
        } else {
          openAdmin();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminOpen, setIsAdminOpen, openAdmin]);

  useEffect(() => {
    initCapacitorNativeMobile({
      onBackButton: () => {
        if (isLoginModalOpen) {
          setIsLoginModalOpen(false);
          return true;
        }
        if (isAdminOpen) {
          setIsAdminOpen(false);
          return true;
        }
        return false;
      },
    });
  }, [isLoginModalOpen, isAdminOpen, setIsLoginModalOpen, setIsAdminOpen]);

  const showGrid = bgConfig?.retroGrid ?? settings.showRetroGrid;
  const showMeteors = bgConfig?.meteors ?? settings.showMeteors;
  const showParticles = bgConfig?.particles ?? (settings.particleDensity !== 'off');

  const isElectron = typeof window !== 'undefined' && !!window.electronAPI?.isElectron;

  return (
    <div className={`relative min-h-screen bg-slate-50 dark:bg-[#090a0f] text-slate-900 dark:text-slate-100 selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden transition-colors duration-300 ${isElectron ? 'pt-9' : ''}`}>
      {/* Native Desktop Titlebar (Rendered strictly inside Electron runtime) */}
      <DesktopTitlebar />

      {/* Desktop-only Interactive Cursors (0 CPU/GPU overhead on touch phones) */}
      {!isMobile && <CursorSpotlight />}
      {!isMobile && <InteractiveCursor />}

      {/* Scroll Progress Bar at top */}
      <ScrollProgress />

      {/* Magic UI Retro Cyber Grid (smoothly adapted for mobile in RetroGrid) */}
      {showGrid && <RetroGrid />}

      {/* Magic UI Meteors Shooting Stars */}
      {showMeteors && <Meteors number={isMobile ? 4 : 25} />}

      {/* Particles canvas - run strictly on desktop to save mobile battery and avoid GPU thrash */}
      {showParticles && !isMobile && <ParticlesBackground />}

      {/* Main Portfolio Layout with Top Brand Header & Bottom Dock Navigation */}
      <div
        className={`transition-all duration-300 relative z-10 ${
          isAdminOpen && adminView === 'split' ? 'md:ml-[50%] md:w-1/2' : 'w-full'
        }`}
      >
        {!isAdminOpen && <TopHeader />}
        <main>
          {visibleSections?.hero !== false && <Hero />}
          <SectionErrorBoundary>
            <React.Suspense fallback={null}>
              {visibleSections?.about !== false && <About />}
              {visibleSections?.projects !== false && <Projects />}
              {visibleSections?.skills !== false && <Skills />}
              {visibleSections?.experience !== false && <Experience />}
              {visibleSections?.testimonials !== false && <Testimonials />}
              {visibleSections?.contact !== false && <Contact />}
              <Footer />
            </React.Suspense>
          </SectionErrorBoundary>
        </main>
      </div>

      {/* Bottom Floating Interactive Dock */}
      {!isAdminOpen && <Dock />}

      {/* Lazy-Loaded Admin Suite - Downloaded strictly on-demand when activated */}
      {(isLoginModalOpen || isAdminOpen) && (
        <React.Suspense fallback={null}>
          {isLoginModalOpen && <AdminLoginModal />}
          {isAdminOpen && isAuthenticated && <AdminDashboard />}
        </React.Suspense>
      )}

      {/* Floating Inquiry Notification Toast for Admin */}
      <InquiryNotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  );
}
