/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
        animation: {
        'pulse-glow': 'pulseGlow 1.5s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
          },
          '50%': {
            transform: 'scale(1.1)',
            boxShadow: '0 0 20px rgba(255, 215, 0, 1)',
          },
        },
      },
    },
  },

  plugins: [],
}
