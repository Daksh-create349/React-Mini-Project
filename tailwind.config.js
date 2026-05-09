/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        // Light & Skeuomorphic Palette
        background: '#e0e5ec', // Soft light gray for neuomorphism base
        cardBg: '#ffffff',
        textMain: '#2d3748',
        textMuted: '#718096',
        accentPrimary: '#4299e1', // Soft blue
      },
      boxShadow: {
        // Skeuomorphic / Neuomorphic shadows
        'skeuo-outer': '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
        'skeuo-inner': 'inset 6px 6px 10px 0 rgba(163,177,198, 0.5), inset -6px -6px 10px 0 rgba(255,255,255, 0.8)',
        'skeuo-card': '0 10px 20px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)',
        'skeuo-button': '5px 5px 10px rgba(163,177,198,0.5), -5px -5px 10px rgba(255,255,255,0.8)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'rain': 'rain 1s linear infinite',
        'snow': 'snow 3s linear infinite',
        'clouds': 'clouds 20s linear infinite',
        'lightning': 'lightning 5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        rain: {
          '0%': { transform: 'translateY(-10px) translateX(0)', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateY(100vh) translateX(-20px)', opacity: 0 },
        },
        snow: {
          '0%': { transform: 'translateY(-10px) translateX(0) rotate(0deg)', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateY(100vh) translateX(20px) rotate(360deg)', opacity: 0 },
        },
        clouds: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        lightning: {
          '0%, 95%, 98%': { opacity: 0 },
          '96%, 99%, 100%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}
