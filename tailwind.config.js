/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#090a0f',
        foreground: '#f8fafc',
        card: {
          DEFAULT: 'rgba(17, 24, 39, 0.75)',
          foreground: '#f8fafc',
          border: 'rgba(255, 255, 255, 0.08)'
        },
        primary: {
          DEFAULT: 'var(--primary-color, #8b5cf6)',
          foreground: '#ffffff',
          glow: 'var(--primary-glow, rgba(139, 92, 246, 0.4))'
        },
        accent: {
          DEFAULT: 'var(--accent-color, #06b6d4)',
          foreground: '#ffffff',
          glow: 'var(--accent-glow, rgba(6, 182, 212, 0.4))'
        },
        muted: {
          DEFAULT: 'rgba(255, 255, 255, 0.06)',
          foreground: '#94a3b8'
        }
      },
      animation: {
        'marquee': 'marquee var(--duration, 30s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--duration, 30s) linear infinite',
        'border-beam': 'border-beam calc(var(--duration, 8s) * 1) infinite linear',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'meteor-effect': 'meteor 5s linear infinite',
        'grid': 'grid 15s linear infinite',
        'gradient': 'gradient 8s linear infinite'
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap, 1rem)))' }
        },
        'marquee-reverse': {
          from: { transform: 'translateX(calc(-100% - var(--gap, 1rem)))' },
          to: { transform: 'translateX(0)' }
        },
        'border-beam': {
          '100%': {
            'offset-distance': '100%'
          }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' }
        },
        meteor: {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': {
            transform: 'rotate(215deg) translateX(-500px)',
            opacity: '0'
          }
        },
        grid: {
          '0%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(0)' }
        },
        gradient: {
          to: {
            backgroundPosition: 'var(--bg-size) 0'
          }
        }
      }
    },
  },
  plugins: [],
}
