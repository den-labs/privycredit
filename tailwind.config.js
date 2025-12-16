/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#64f8ce',
          dark: '#4c6bff',
          light: '#b7ffec',
        },
        accent: '#64f8ce',
        secondary: '#7f8bff',
        light: {
          DEFAULT: '#030711',
          card: '#0c1424',
          border: 'rgba(255,255,255,0.08)',
        },
        dark: {
          DEFAULT: '#f6f8ff',
          muted: '#a9b4d9',
          subtle: '#7f8cb8',
          card: '#131b2f',
          border: 'rgba(255,255,255,0.12)',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};
