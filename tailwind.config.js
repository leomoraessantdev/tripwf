/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#E7F0F2',
          100: '#C2DBDF',
          200: '#94BFC6',
          300: '#5F9DA8',
          400: '#357C8A',
          500: '#0F4C5C',
          600: '#0C3E4B',
          700: '#0A323D',
          800: '#08272F',
          900: '#051A20'
        },
        accent: {
          50:  '#FDEFE3',
          100: '#FBD9BD',
          200: '#F8B985',
          300: '#F2944D',
          400: '#EB7822',
          500: '#E36414',
          600: '#C0530F',
          700: '#9B430C',
          800: '#76330A',
          900: '#4F2206'
        },
        cream: {
          50: '#FDFCF9',
          100: '#FBF8F3',
          200: '#F4ECE0',
          300: '#EADEC8'
        },
        success: '#5F8B4C',
        warning: '#D9A441',
        danger:  '#B23A3A'
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(15, 76, 92, 0.08)',
        hover: '0 12px 40px -8px rgba(15, 76, 92, 0.18)',
        glow: '0 0 0 4px rgba(227, 100, 20, 0.15)'
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(15,76,92,0.85) 0%, rgba(15,76,92,0.45) 50%, rgba(227,100,20,0.35) 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)'
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 }
        }
      }
    }
  },
  plugins: []
}
