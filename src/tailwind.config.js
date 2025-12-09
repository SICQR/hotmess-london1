/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // HOTMESS Brand Colors - Aligned with CSS custom properties
        hot: '#FF0080',              // Primary hot pink (--color-hot)
        'hot-bright': '#FF1694',     // Bright hot pink (--color-hot-bright)
        'hot-dark': '#E70F3C',       // Deep hot pink/red (--color-hot-dark)
        'hotmess-red': '#E70F3C',    // Legacy alias for hot-dark (--hotmess-red)
        heat: '#FF622D',
        'neon-lime': '#B2FF52',
        'cyan-static': '#29E2FF',
        charcoal: '#0E0E0F',
        'wet-black': '#000000',
        steel: '#9BA1A6',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 0, 128, 0.5)',              // Hot pink glow
        'glow-intense': '0 0 40px rgba(255, 0, 128, 0.8), 0 0 80px rgba(255, 0, 128, 0.4)',
        'hard': '0 4px 12px rgba(0, 0, 0, 0.8)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'beacon-flare': 'beacon-flare 2s ease-in-out infinite',
        'powder-burst': 'powder-burst 1s ease-out forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            textShadow: '0 0 20px rgba(255, 0, 128, 0.6)',    // Hot pink glow
            opacity: '1'
          },
          '50%': { 
            textShadow: '0 0 40px rgba(255, 0, 128, 0.8), 0 0 80px rgba(255, 0, 128, 0.4)',
            opacity: '0.9'
          },
        },
        'beacon-flare': {
          '0%, 100%': { 
            transform: 'scale(1)',
            opacity: '1'
          },
          '50%': { 
            transform: 'scale(1.2)',
            opacity: '0.6'
          },
        },
        'powder-burst': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0',
            filter: 'blur(20px)'
          },
          '50%': {
            opacity: '1',
            filter: 'blur(0)'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
            filter: 'blur(0)'
          },
        },
      },
    },
  },
  plugins: [],
}
