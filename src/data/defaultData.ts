import { PortfolioData } from '../types/portfolio';

export const defaultPortfolioData: PortfolioData = {
  hero: {
    name: "Alex Vance",
    roles: [
      "Creative Technologist",
      "Full-Stack Architect",
      "UI/UX Engineer"
    ],
    tagline: "Building hyper-scalable digital experiences with cutting-edge design & intelligent systems.",
    bio: "I craft clean code, futuristic interfaces, and high-performance software. Update my details directly from the Admin Panel.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    status: "Available for select freelance & consulting",
    location: "San Francisco, CA (Open to Remote)",
    ctaPrimary: {
      label: "Explore Projects",
      link: "#projects",
      show: true,
    },
    ctaSecondary: {
      label: "Get in Touch",
      link: "#contact",
      show: true,
    },
    resume: {
      label: "Download Resume",
      link: "#resume",
      url: "#resume",
      show: true,
    },
    resumeFile: "",
    resumeFileName: "",
    stats: [
      { id: "1", label: "Years Experience", value: "8+", icon: "Clock" },
      { id: "2", label: "Production Apps", value: "40+", icon: "Layers" },
      { id: "3", label: "Users Reached", value: "1M+", icon: "Users" },
      { id: "4", label: "GitHub Stars", value: "5k+", icon: "Star" },
    ]
  },
  about: {
    badge: "ENGINEERING PHILOSOPHY",
    title: "Architecting the Future of Web & AI",
    subtitle: "A blend of clean architectural boundaries, intuitive ergonomics, and cinematic polish.",
    missionBadge: "ORIGIN & MISSION",
    storyHeading: "Building software that feels instantaneous, intelligent, and alive.",
    storyParagraph1: "I have spent years navigating the rapid evolution of full-stack engineering—from early monolithic architectures to modern edge-deployed serverless applications and autonomous agentic workflows.",
    storyParagraph2: "Whether designing distributed data pipelines or tuning framer-motion physics to perfection, I believe software should not only be technically robust—it should evoke delight on every click.",
    terminalCmd: "npx start-developer --profile=\"Alex Vance\"",
    terminalOutputs: [
      "✓ Core modules: React 19, TypeScript, Next.js, Node.js [READY]",
      "✓ MCP Agent server: active on stdio:7890",
      "ℹ Status: Available for new opportunities"
    ],
    highlights: [
      {
        id: "h1",
        title: "High-Performance First",
        desc: "Obsessed with sub-second LCP, zero layout shifts, and 60fps physics-driven micro-interactions.",
        icon: "Zap",
      },
      {
        id: "h2",
        title: "AI & Agentic Systems",
        desc: "Integrating autonomous LLM workflows, MCP server tools, and real-time streaming interfaces.",
        icon: "Cpu",
      },
      {
        id: "h3",
        title: "Enterprise Rigor",
        desc: "Strict type safety, end-to-end testing, modular design systems, and cloud resilience.",
        icon: "ShieldCheck",
      },
      {
        id: "h4",
        title: "Product Craftsmanship",
        desc: "Bridging design, engineering, and product vision to create memorable human experiences.",
        icon: "HeartHandshake",
      },
    ]
  },
  projects: [],
  skills: [],
  experience: [],
  testimonials: [],
  contact: {
    badge: "LET'S COLLABORATE",
    title: "Initiate a Dialogue",
    subtitle: "Have an ambitious concept, architectural advisory requirement, or engineering challenge? Let's build something extraordinary.",
    directHeading: "Direct Contact",
    directDesc: "Feel free to email me directly or copy the address to your clipboard. I typically respond within 24 hours.",
    email: "alex.vance.dev@gmail.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA (Open to Remote)",
    responseTime: "< 24 hours",
    statusText: "Open to exciting projects",
    socials: [
      { id: "soc-1", platform: "GitHub", url: "https://github.com" },
      { id: "soc-2", platform: "LinkedIn", url: "https://linkedin.com" },
      { id: "soc-3", platform: "Twitter", url: "https://twitter.com" },
    ],
    projectTypes: [
      "Full-Stack Web App",
      "AI / Agentic Integration",
      "Design System & UI/UX",
      "Architectural Advisory",
      "Mobile App"
    ],
    budgets: [
      "< $5k",
      "$5k - $15k",
      "$15k - $40k",
      "$40k+"
    ]
  },
  footer: {
    brandText: "AV",
    timezoneCity: "San Francisco",
    statusText: "All Systems Normal",
    copyrightText: "All rights reserved.",
    creditText: "Built with React 19, Vite, Tailwind & Magic UI"
  },
  settings: {
    colorMode: "dark", // Default dark mode!
    accentTheme: "violet",
    customPrimaryColor: "#8b5cf6",
    customAccentColor: "#06b6d4",
    soundEffects: true,
    particleDensity: "medium",
    showMeteors: true,
    showRetroGrid: true,
    showAvailabilityBadge: true,
    adminPassword: "admin123",
    visibleSections: {
      hero: true,
      about: true,
      projects: true,
      skills: true,
      experience: true,
      testimonials: true,
      contact: true,
    },
    effectsConfig: {
      customCursor: {
        enabled: true,
        style: 'neon-ring',
        size: 34,
        glowIntensity: 0.7,
      },
      magneticButtons: {
        enabled: true,
        strength: 0.35,
      },
      cursorSpotlight: {
        enabled: true,
        radius: 450,
        opacity: 0.16,
      },
      interactiveBackground: {
        particles: true,
        retroGrid: true,
        meteors: true,
        particleDensity: 'medium',
      },
      floating3D: {
        enabled: true,
        shape: 'icosahedron',
        speed: 1.0,
        scale: 1.0,
      },
      scrollAnimations: {
        enabled: true,
        intensity: 'standard',
      },
    }
  }
};
