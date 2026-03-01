import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'scroll-line': 'scroll-line 2s ease-in-out infinite',
        'blink': 'blink 0.75s step-end infinite',
        'orb': 'orb 10s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 15s linear infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { boxShadow: '0 0 0 2px rgba(45,212,191,0.2)' },
          '50%':       { boxShadow: '0 0 0 6px rgba(45,212,191,0.05)' },
        },
        'scroll-line': {
          '0%':   { opacity: '1', transform: 'scaleY(1)',   transformOrigin: 'top' },
          '100%': { opacity: '0', transform: 'scaleY(0.1)', transformOrigin: 'top' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        'orb': {
          '0%':   { transform: 'translate(0px, 0px) scale(1) rotate(0deg)' },
          '100%': { transform: 'translate(50px, -40px) scale(1.1) rotate(45deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
} satisfies Config
