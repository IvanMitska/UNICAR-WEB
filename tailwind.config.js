/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        dark: {
          50: '#f6f6f7',
          100: '#e2e3e5',
          200: '#c5c7cb',
          300: '#a0a4aa',
          400: '#7b8088',
          500: '#60656d',
          600: '#4c5057',
          700: '#3f4246',
          800: '#35373b',
          900: '#2e3033',
          950: '#0a0a0b',
        },
        accent: {
          gold: '#FFD700',
          goldLight: '#FFED4E',
          goldDark: '#B8860B',
          silver: '#C0C0C0',
          silverLight: '#E5E5E5',
          silverDark: '#808080',
        },
        shiba: {
          light: '#fbbf24',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Porsche Design', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Porsche Design', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-premium': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-dark': 'linear-gradient(to bottom, #0a0a0b, #1a1a1b)',
        'gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(28,100%,74%,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.2) 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(234, 179, 8, 0.3)',
        'glow-lg': '0 0 40px rgba(234, 179, 8, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(234, 179, 8, 0.1)',
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.5)',
        'premium-lg': '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
}