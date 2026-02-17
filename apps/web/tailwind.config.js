/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0c0f14',
        surface: '#151921',
        'surface-elevated': '#1c2230',
        border: '#252d3b',
        'border-subtle': '#1e2636',
        'text-primary': '#f0f2f5',
        'text-secondary': '#8b95a8',
        'text-tertiary': '#5c6578',
        accent: '#2dd4a8',
        'accent-dim': '#1a9e7a',
        success: '#34d399',
        error: '#f87171',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
