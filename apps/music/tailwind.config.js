/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        // HOTMESS Brand Colors
        hot: '#E70F3C',
        heat: '#FF622D',
        'neon-lime': '#B2FF52',
        'cyan-static': '#29E2FF',
        charcoal: '#0E0E0F',
        'wet-black': '#000000',
        steel: '#9BA1A6',
        // Additional HOTMESS design tokens
        hotmess: {
          purple: '#FF00F5',
          blue: '#00D9FF',
          pink: '#FF69F5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(231, 15, 60, 0.6)',
        'glow-intense': '0 0 40px rgba(231, 15, 60, 0.8), 0 0 80px rgba(231, 15, 60, 0.4)',
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
            textShadow: '0 0 20px rgba(231, 15, 60, 0.6)',
            opacity: '1'
          },
          '50%': { 
            textShadow: '0 0 40px rgba(231, 15, 60, 0.8), 0 0 80px rgba(231, 15, 60, 0.4)',
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
  plugins: [require('tailwindcss-animate')],
}
