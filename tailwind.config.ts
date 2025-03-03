import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'sans-serif'],
        display: ['Satoshi', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        slideUp: 'slideUp 0.5s ease-out forwards',
        shimmer: 'shimmer 2s infinite linear',
        pulse: 'pulse 2s infinite ease-in-out',
        float: 'float 3s infinite ease-in-out',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    animate,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function ({ addBase }: { addBase: (base: Record<string, any>) => void }) {
      addBase({
        ':root': {
          // Finance-specific colors that aren't in the theme system
          '--finance-positive': '#10B981',
          '--finance-negative': '#EF4444',
          '--finance-neutral': '#6B7280',
          '--finance-card': 'rgba(17, 19, 31, 0.8)',
          '--finance-card-hover': 'rgba(22, 24, 38, 0.9)',
          '--finance-accent': '#3B82F6',
          '--finance-accent-hover': '#2563EB',
          '--finance-chart-1': '#3B82F6',
          '--finance-chart-2': '#EC4899',
          '--finance-chart-3': '#10B981',
          '--finance-chart-4': '#F59E0B',

          // Primary solid colors
          '--primary-solid': '#11151f',
          '--primary-solid-light': '#1a2030',
          '--primary-solid-lighter': '#232940',
          '--primary-solid-dark': '#0d1119',
          '--primary-solid-darker': '#090c12',
        },
      });
    },
  ],
} satisfies Config;

export default config;
