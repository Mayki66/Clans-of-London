/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vampire: {
          darkest: '#07080a',
          dark: '#0e1015',
          cardBg: '#14171f',
          surface: '#1c202b',
          border: '#2a3040',
          blood: '#8b0000',
          crimson: '#c9182b',
          neonRed: '#ff2a4b',
          gold: '#d4af37',
          goldDark: '#997d25',
          goldLight: '#f3e5ab',
          accent: '#7b1113',
          purple: '#6b21a8',
          emerald: '#065f46',
          mist: '#8a99ad',
        }
      },
      fontFamily: {
        gothic: ['Cinzel', 'Trajan Pro', 'Georgia', 'serif'],
        sans: ['Inter', 'Exo 2', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'blood': '0 0 15px rgba(201, 24, 43, 0.45)',
        'blood-lg': '0 0 30px rgba(201, 24, 43, 0.7)',
        'gold': '0 0 15px rgba(212, 175, 55, 0.4)',
        'card': '0 8px 24px -4px rgba(0, 0, 0, 0.8), 0 2px 6px rgba(0,0,0,0.6)',
        'foil': '0 0 20px rgba(243, 229, 171, 0.3), inset 0 0 15px rgba(255,255,255,0.2)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'fog': 'fog 20s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fog: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-20px)' },
          '100%': { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}
