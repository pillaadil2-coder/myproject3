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
        brand: {
          dark: '#0b0e14',
          card: '#121824',
          border: '#1f293d',
          accent: '#00C78C',
          accentHover: '#00b37d',
          buy: '#00c087',
          sell: '#ff3b69',
          gold: '#f59e0b',
          blue: '#2563eb'
        }
      }
    },
  },
  plugins: [],
}
