import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          950: '#05080f',
          900: '#0a1020',
          800: '#111a2e',
          700: '#1a2742',
        },
        electric: {
          400: '#34d8ff',
          500: '#00c8ff',
          600: '#00a8e6',
        },
        zap: {
          400: '#c4ff4d',
          500: '#b4ff2e',
          600: '#9ae619',
        },
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, rgba(5,8,15,0) 0%, rgba(5,8,15,0.85) 40%, #05080f 100%), linear-gradient(rgba(52,216,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(52,216,255,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '64px 64px',
      },
      boxShadow: {
        glass: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px -20px rgba(0,200,255,0.15)',
        glow: '0 0 60px -10px rgba(0,200,255,0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
