/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#00A3E0',
          dark: '#0082B3',
          light: '#99CBEB',
        },
        accent: '#00A3E0',
        secondary: '#99CBEB',
        light: {
          DEFAULT: '#F5F5F5',
          card: '#FFFFFF',
          border: '#E0E0E0',
        },
        dark: {
          DEFAULT: '#000034',
          muted: '#4a4a6a',
          subtle: '#6b6b8a',
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
