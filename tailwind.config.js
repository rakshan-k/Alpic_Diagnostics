/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#000000',
          lighter: '#121212',
          light: '#1E1E1E',
          accent: '#2D2D2D'
        }
      }
    },
  },
  plugins: [],
};