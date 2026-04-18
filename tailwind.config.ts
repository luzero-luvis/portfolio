import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#E6FFF0',
          100: '#B3FFD9',
          500: '#00FF41',
          700: '#00CC33',
          900: '#008F26',
          DEFAULT: '#00FF41',
        },
        accent: {
          500: '#FFB800',
          700: '#FF9500',
          DEFAULT: '#FFB800',
        },
        neutral: {
          50:  '#F5F7FA',
          100: '#E8EDF2',
          200: '#C5CDD3',
          300: '#A2ADB6',
          400: '#7A8894',
          500: '#5A6873',
          600: '#2D3841',
          700: '#1E272E',
          800: '#141B20',
          900: '#0A0E11',
          950: '#000000',
        },
        bg: {
          page:     '#000000',
          surface:  '#0A0E11',
          elevated: '#141B20',
        },
      },
      boxShadow: {
        sm:          '0 1px 2px rgba(0,255,65,0.05)',
        card:        '0 4px 16px rgba(0,0,0,0.4)',
        'card-hover':'0 8px 32px rgba(0,0,0,0.5)',
        modal:       '0 24px 48px rgba(0,0,0,0.7)',
        glow:        '0 0 16px rgba(0,255,65,0.3)',
      },
      animation: {
        'pulse-dot':   'pulse-dot 2s ease-in-out infinite',
        'scroll-line': 'scroll-line 2s ease-in-out infinite',
        'blink':       'blink 1s infinite',
        'typewriter':  'typewriter 2s steps(40, end)',
        'glitch':      'glitch 0.3s ease-in-out',
        'scanline':    'scanline 8s linear infinite',
        'grid-move':   'gridMove 20s linear infinite',
        'shimmer':     'shimmer 2s infinite',
        'float':       'float 6s ease-in-out infinite',
        'spin-slow':   'spin 15s linear infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { boxShadow: '0 0 0 2px rgba(0,255,65,0.2)' },
          '50%':       { boxShadow: '0 0 0 6px rgba(0,255,65,0.05)' },
        },
        'scroll-line': {
          '0%':   { opacity: '1', transform: 'scaleY(1)',   transformOrigin: 'top' },
          '100%': { opacity: '0', transform: 'scaleY(0.1)', transformOrigin: 'top' },
        },
        'blink': {
          '0%, 50%':   { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        'typewriter': {
          from: { width: '0' },
          to:   { width: '100%' },
        },
        'glitch': {
          '0%':   { transform: 'translate(0)' },
          '20%':  { transform: 'translate(-2px, 2px)' },
          '40%':  { transform: 'translate(-2px, -2px)' },
          '60%':  { transform: 'translate(2px, 2px)' },
          '80%':  { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'scanline': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'gridMove': {
          '0%':   { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
        'shimmer': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.3' },
          '50%':       { transform: 'translateY(-20px) rotate(180deg)', opacity: '0.8' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} satisfies Config
