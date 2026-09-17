import { PortfolioData } from '../types/portfolio';

export const defaultPortfolioData: PortfolioData = {
  _updatedAt: 1700000000000,
  hero: {
    name: "Marib Hamid",
    roles: [
      "Full-Stack Architect",
      "AI Systems Engineer",
      "Mobile & Web Specialist"
    ],
    tagline: "Building hyper-scalable digital experiences with cutting-edge design & intelligent systems.",
    bio: "I craft clean code, futuristic interfaces, and high-performance cross-platform software. Manage and customize every detail directly from the live Admin Panel.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    status: "Available for select freelance & consulting",
    location: "Global / Remote",
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
    storyParagraph1: "I have spent years navigating the rapid evolution of full-stack engineering—from early monolithic architectures to modern edge-deployed serverless applications, cross-platform mobile ecosystems, and autonomous agentic workflows.",
    storyParagraph2: "Whether designing distributed data pipelines or tuning framer-motion physics to perfection, I believe software should not only be technically robust—it should evoke delight on every click.",
    terminalCmd: "npx start-developer --profile=\"Marib Hamid\"",
    terminalOutputs: [
      "✓ Core modules: React 19, TypeScript, Vite, Node.js, Capacitor [READY]",
      "✓ Cloud & Sync: Firebase Firestore real-time persistence [ONLINE]",
      "ℹ Status: Available for ambitious new opportunities"
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
  projects: [
    {
      id: "proj-1",
      title: "PortfolioMax Studio & Mobile Suite",
      description: "Unified cross-platform portfolio and headless CMS studio running seamlessly across Web, Desktop (Electron), Android, and iOS.",
      longDescription: "Engineered with React 19, Vite, Tailwind CSS, Framer Motion, and Capacitor. Features real-time Firestore cloud synchronization, offline caching, and native safe area adaptation.",
      category: "Full-Stack",
      tags: ["React 19", "TypeScript", "Capacitor", "Firebase", "Tailwind CSS"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
      featured: true,
      demoUrl: "https://github.com/maribhamid/PortfolioMax",
      githubUrl: "https://github.com/maribhamid/PortfolioMax",
      metrics: "Sub-100ms sync & 4 platforms"
    },
    {
      id: "proj-2",
      title: "Agentic Intelligence Engine",
      description: "Autonomous LLM orchestrator leveraging Model Context Protocol (MCP) for automated workflows, code generation, and task execution.",
      longDescription: "Multi-agent architecture connecting local dev tools and remote models with real-time streaming interfaces and fault-tolerant tool scheduling.",
      category: "AI & Cloud",
      tags: ["TypeScript", "Node.js", "MCP", "LLM Agents", "Vector Search"],
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
      featured: true,
      demoUrl: "https://github.com/maribhamid",
      githubUrl: "https://github.com/maribhamid",
      metrics: "10x workflow acceleration"
    },
    {
      id: "proj-3",
      title: "Cyberpunk Design System & Motion UI",
      description: "Modern, high-performance UI library featuring physics-based spring animations, retro grid shaders, and dynamic theme switching.",
      longDescription: "A curated collection of accessible, glassmorphic UI components with fluid responsive layouts and dark-mode optimization.",
      category: "Design Systems",
      tags: ["Framer Motion", "Tailwind CSS", "Design Systems", "Web Audio"],
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80",
      featured: false,
      demoUrl: "https://github.com/maribhamid",
      githubUrl: "https://github.com/maribhamid",
      metrics: "60 FPS render performance"
    }
  ],
  skills: [
    { id: "sk-1", name: "React / Next.js", category: "Frontend", level: 95, icon: "Code2", highlight: true },
    { id: "sk-2", name: "TypeScript", category: "Frontend", level: 92, icon: "FileCode2", highlight: true },
    { id: "sk-3", name: "Tailwind CSS & Framer", category: "Frontend", level: 90, icon: "Palette", highlight: true },
    { id: "sk-4", name: "Node.js & Express", category: "Backend", level: 88, icon: "Server", highlight: true },
    { id: "sk-5", name: "Firebase & Firestore", category: "Backend", level: 88, icon: "Database", highlight: true },
    { id: "sk-6", name: "Capacitor & Mobile (iOS/Android)", category: "AI & Cloud", level: 85, icon: "Smartphone", highlight: true },
    { id: "sk-7", name: "AI Agents & LLM Integration", category: "AI & Cloud", level: 90, icon: "Cpu", highlight: true },
    { id: "sk-8", name: "Docker & CI/CD Pipelines", category: "Tools & Design", level: 82, icon: "Workflow", highlight: false },
  ],
  experience: [
    {
      id: "exp-1",
      role: "Lead Full-Stack Architect",
      company: "Voctrum Systems",
      period: "2022 - Present",
      location: "Remote",
      description: "Directing the architectural design of high-throughput web and mobile platforms, integrating agentic workflows and real-time cloud data pipelines.",
      achievements: [
        "Architected unified cross-platform applications reducing delivery cycles by 40%",
        "Implemented resilient distributed state synchronization with zero-downtime migration"
      ],
      technologies: ["React", "TypeScript", "Node.js", "Firebase", "Capacitor", "Docker"]
    },
    {
      id: "exp-2",
      role: "Senior Frontend Engineer",
      company: "Digital Innovations Lab",
      period: "2019 - 2022",
      location: "Remote",
      description: "Built scalable UI component architectures and interactive data visualization engines for enterprise software.",
      achievements: [
        "Spearheaded design system modernization serving 20+ internal client applications",
        "Optimized client bundle sizes and runtime performance achieving 99+ Lighthouse scores"
      ],
      technologies: ["React", "TypeScript", "GraphQL", "Tailwind CSS", "Webpack"]
    }
  ],
  testimonials: [
    {
      id: "test-1",
      name: "Sophia Martinez",
      role: "VP of Engineering",
      company: "TechNova Cloud",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      content: "Marib has an extraordinary ability to transform intricate architectural challenges into fluid, elegant user experiences. His dedication to craft and speed is unmatched.",
      rating: 5
    },
    {
      id: "test-2",
      name: "David Chen",
      role: "Product Director",
      company: "Apex Labs",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      content: "The level of engineering rigor and UI fluidity Marib brings to every project is remarkable. From real-time cloud sync to mobile packaging, everything was delivered flawlessly.",
      rating: 5
    }
  ],
  contact: {
    badge: "LET'S COLLABORATE",
    title: "Initiate a Dialogue",
    subtitle: "Have an ambitious concept, architectural advisory requirement, or engineering challenge? Let's build something extraordinary.",
    directHeading: "Direct Contact",
    directDesc: "Feel free to email me directly or copy the address to your clipboard. I typically respond within 24 hours.",
    email: "maribhamid@gmail.com",
    phone: "+1 (555) 019-2834",
    location: "Global (Open to Remote)",
    responseTime: "< 24 hours",
    statusText: "Open to exciting projects",
    socials: [
      { id: "soc-1", platform: "GitHub", url: "https://github.com/maribhamid" },
      { id: "soc-2", platform: "LinkedIn", url: "https://linkedin.com" },
      { id: "soc-3", platform: "Twitter", url: "https://twitter.com" },
    ],
    projectTypes: [
      "Full-Stack Web App",
      "AI / Agentic Integration",
      "Design System & UI/UX",
      "Architectural Advisory",
      "Mobile App (iOS & Android)"
    ],
    budgets: [
      "< $5k",
      "$5k - $15k",
      "$15k - $40k",
      "$40k+"
    ]
  },
  footer: {
    brandText: "MH",
    timezoneCity: "Global",
    statusText: "All Systems Operational",
    copyrightText: "All rights reserved.",
    creditText: "Built with React 19, Vite, Tailwind & Capacitor"
  },
  settings: {
    colorMode: "dark",
    accentTheme: "violet",
    customPrimaryColor: "#8b5cf6",
    customAccentColor: "#06b6d4",
    soundEffects: true,
    particleDensity: "medium",
    showMeteors: true,
    showRetroGrid: true,
    showAvailabilityBadge: true,
    adminUsername: "maribhamid@port.com",
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
