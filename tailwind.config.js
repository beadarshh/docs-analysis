/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        un: {
          light: '#60A5FA',
          DEFAULT: '#3B82F6',
          dark: '#1E3A8A',
        },
        g20: {
          light: '#4ADE80',
          DEFAULT: '#22C55E',
          dark: '#15803D',
        },
        accent: {
          light: '#818CF8',
          DEFAULT: '#6366F1',
          dark: '#4338CA',
        },
        highlight: '#FEF08A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
