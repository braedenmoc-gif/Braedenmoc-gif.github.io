/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#101114',
        nearblack: '#090A0C',
        offwhite: '#F5F5F3',
        silver: {
          DEFAULT: '#A9ADB4',
          dark: '#6B6E75',
          light: '#C8CCD2',
        },
        electric: '#3B82F6',
        electricdark: '#1E5FD0',
        electricsoft: '#60A5FA',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        headline: ['"Oswald"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        wider2: '0.12em',
        widest2: '0.25em',
      },
      maxWidth: {
        'screen-xl2': '1320px',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(169,173,180,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(169,173,180,0.06) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
