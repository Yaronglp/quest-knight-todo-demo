/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fantasy theme colors
        primary: {
          50: '#fef3e7',
          100: '#fce4c4',
          200: '#f9d09d',
          300: '#f7bc76',
          400: '#f5ab58',
          500: '#f39a3b',
          600: '#e88a33',
          700: '#da7729',
          800: '#cc6520',
          900: '#b24710',
        },
        secondary: {
          50: '#e8f5f0',
          100: '#c6e5d9',
          200: '#a0d4c0',
          300: '#7ac3a7',
          400: '#5eb694',
          500: '#42a981',
          600: '#3c9a75',
          700: '#338865',
          800: '#2b7756',
          900: '#1d5839',
        },
        dark: {
          50: '#e6e7e8',
          100: '#c0c3c5',
          200: '#969b9f',
          300: '#6c7379',
          400: '#4d555c',
          500: '#2e373f',
          600: '#293139',
          700: '#232a31',
          800: '#1d2329',
          850: '#181c21',
          900: '#12161b',
          950: '#0d1014',
        },
      },
      fontFamily: {
        fantasy: ['"Cinzel"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
};

