/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          dark: '#0E0E0E',
          surface: '#1A1A1A',
          surfaceLight: '#252525',
          accent: '#A64B28',
          accentLight: '#C66B3D',
          text: '#F8F6F0',
          muted: '#8B8680',
          border: 'rgba(248,246,240,0.08)',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
}