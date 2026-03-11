/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          DEFAULT: '#3B7A57',
        },
        earth: {
          DEFAULT: '#8B5A2B',
        },
        sand: {
          DEFAULT: '#F5E6C8',
        },
        turmeric: {
          DEFAULT: '#FFC94A',
        },
      },
      fontFamily: {
        display: ['system-ui', 'sans-serif'],
        body: ['system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 45px rgba(0,0,0,0.08)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
      },
    },
  },
  plugins: [],
};

