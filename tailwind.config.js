/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          bg: '#0d0d0d',
          surface: '#1a1717',
          surface2: '#231e1e',
          surface3: '#2e2626',
          border: '#3d2020',
          borderLight: '#5a3030',
        },
        blood: {
          dark: '#5a0000',
          DEFAULT: '#8B0000',
          bright: '#b22222',
          vivid: '#cc2222',
        },
        parchment: {
          DEFAULT: '#e8dcc8',
          muted: '#b8a898',
          dim: '#7a6a5a',
        },
        gold: {
          dark: '#8a6a1e',
          DEFAULT: '#b8962e',
          bright: '#d4aa40',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'Georgia', 'serif'],
        serif: ['"IM Fell English"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        blood: '0 0 20px rgba(139, 0, 0, 0.3)',
        'blood-sm': '0 0 8px rgba(139, 0, 0, 0.2)',
        inner: 'inset 0 2px 4px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
