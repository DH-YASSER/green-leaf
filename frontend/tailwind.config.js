/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#282828',         // Hex Pens Dark Scheme Background
          surface: '#262524',    // Hex Pens Alt Dark
          surface2: '#403f3d',   // Hex Pens Alt L-10
          border: 'rgba(255, 255, 255, 0.2)', // Hex Pens border
          text: '#ffffff',       // Hex Pens Text
          muted: 'rgba(255, 255, 255, 0.6)', // Hex Pens Text muted
          accent: '#f79420',     // Hex Pens Red/Orange
          accentDark: '#f9ac51', // Hex Pens Red/Orange L-10
        }
      },
      backgroundImage: {
        'hex-pattern': "radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0)",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}