/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        deep: '#0c0a09',
        card: '#1c1917',
        surface: '#292524',
        border: '#44403c',
        violet: '#4C2882',
        indigo: '#6F42C1',
        amber: '#d97706',
        emerald: '#10b981',
        text: '#fafaf9',
        textSecondary: '#a8a29e',
        textMuted: '#78716c',
      },
    },
  },
  plugins: [],
}
