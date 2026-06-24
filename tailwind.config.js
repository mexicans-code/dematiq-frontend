/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
      },
      colors: {
        primary: {
          50: '#eef3f8',
          100: '#d4e0ed',
          200: '#b3c8dd',
          300: '#8dabca',
          400: '#6a8fb5',
          500: '#1e3a5f',
          600: '#19314f',
          700: '#132840',
          800: '#0e1f32',
          900: '#091725',
        },
        secondary: {
          50: '#fcfcfc',
          100: '#f5f5f5',
          200: '#e8e8e8',
          300: '#d1d1d1',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        accent: {
          50: '#fff3eb',
          100: '#ffdcc2',
          200: '#ffb385',
          300: '#ff8a47',
          400: '#ff6614',
          500: '#e65100',
          600: '#c44600',
          700: '#a23a00',
          800: '#802e00',
          900: '#5e2200',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
