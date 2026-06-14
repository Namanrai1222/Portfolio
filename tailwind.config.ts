import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        surface2: 'var(--color-surface2)',
        border: 'var(--color-border)',
        accent: 'var(--color-accent)',
        accent2: 'var(--color-accent2)',
        accent3: 'var(--color-accent3)',
        text1: 'var(--color-text1)',
        text2: 'var(--color-text2)',
        text3: 'var(--color-text3)',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        dm: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['96px', { lineHeight: '1', letterSpacing: '-0.05em', fontWeight: '800' }],
        'display-xl': ['72px', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '800' }],
        'display-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'body-lg': ['18px', { lineHeight: '1.8' }],
        body: ['16px', { lineHeight: '1.75' }],
        mono: ['13px', { lineHeight: '1.6' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '128': '32rem',
      },
      maxWidth: {
        container: '1200px',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'orbit-1': 'orbit 6s linear infinite',
        'orbit-2': 'orbit 9s linear infinite',
        'orbit-3': 'orbit 12s linear infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'shimmer-text': 'shimmerText 3s linear infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.8)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        shimmerText: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      boxShadow: {
        'glow-accent': '0 0 40px var(--color-accent-glow)',
        'glow-accent2': '0 0 40px var(--color-accent2-glow)',
        'glow-sm': '0 0 20px var(--color-accent-glow-sm)',
      },
    },
  },
  plugins: [],
};

export default config;


