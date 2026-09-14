import React, { useEffect } from 'react';
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
import { soundManager } from './utils/audio';

// Lazy-load below-the-fold sections for instant mobile initial paint
const About = React.lazy(() =>
  import('./components/portfolio/About').then((m) => ({ default: m.About }))
);
const Projects = React.lazy(() =>
  import('./components/portfolio/Projects').then((m) => ({ default: m.Projects }))
);
const Skills = React.lazy(() =>
  import('./components/portfolio/Skills').then((m) => ({ default: m.Skills }))
);
const Experience = React.lazy(() =>
  import('./components/portfolio/Experience').then((m) => ({ default: m.Experience }))
);
const Testimonials = React.lazy(() =>
  import('./components/portfolio/Testimonials').then((m) => ({ default: m.Testimonials }))
);
const Contact = React.lazy(() =>
  import('./components/portfolio/Contact').then((m) => ({ default: m.Contact }))
);
const Footer = React.lazy(() =>
  import('./components/portfolio/Footer').then((m) => ({ default: m.Footer }))
);

// Lazy-load heavy Admin CMS components to dramatically speed up initial portfolio load
const AdminDashboard = React.lazy(() =>
  import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminLoginModal = React.lazy(() =>
  import('./components/admin/AdminLoginModal').then((m) => ({ default: m.AdminLoginModal }))
);

const PortfolioContent: React.FC = () => {
  const { data, isAdminOpen, setIsAdminOpen, adminView, openAdmin } = usePortfolio();
  const { settings } = data;
  const { visibleSections } = settings;
  const bgConfig = settings.effectsConfig?.interactiveBackground;

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

  const showGrid = bgConfig?.retroGrid ?? settings.showRetroGrid;
  const showMeteors = bgConfig?.meteors ?? settings.showMeteors;
  const showParticles = bgConfig?.particles ?? (settings.particleDensity !== 'off');

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#090a0f] text-slate-900 dark:text-slate-100 selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden transition-colors duration-300">
      {/* Interactive Cursor Spotlight Aura */}
      <CursorSpotlight />

      {/* Interactive Framer Motion Custom Cursor */}
      <InteractiveCursor />

      {/* Scroll Progress Bar at top */}
      <ScrollProgress />

      {/* Magic UI Retro Cyber Grid */}
      {showGrid && <RetroGrid />}

      {/* Magic UI Meteors Shooting Stars */}
      {showMeteors && <Meteors number={25} />}

      {/* Interactive Constellation Particles */}
      {showParticles && <ParticlesBackground />}

      {/* Main Portfolio Layout with Top Brand Header & Bottom Dock Navigation */}
      <div
        className={`transition-all duration-300 relative z-10 ${
          isAdminOpen && adminView === 'split' ? 'md:ml-[50%] md:w-1/2' : 'w-full'
        }`}
      >
        {!isAdminOpen && <TopHeader />}
        <main>
          {visibleSections?.hero !== false && <Hero />}
          <React.Suspense fallback={null}>
            {visibleSections?.about !== false && <About />}
            {visibleSections?.projects !== false && <Projects />}
            {visibleSections?.skills !== false && <Skills />}
            {visibleSections?.experience !== false && <Experience />}
            {visibleSections?.testimonials !== false && <Testimonials />}
            {visibleSections?.contact !== false && <Contact />}
            <Footer />
          </React.Suspense>
        </main>
      </div>

      {/* Bottom Floating Interactive Dock (The ONLY navigation bar) */}
      {!isAdminOpen && <Dock />}

      {/* Lazy-Loaded Admin Suite */}
      <React.Suspense fallback={null}>
        <AdminLoginModal />
        <AdminDashboard />
      </React.Suspense>
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
