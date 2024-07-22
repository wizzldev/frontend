/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        main: '#121318',
        secondary: '#1d1d27',
        'secondary-hover': '#22222e',
        'secondary-focus': '#272733',
        tertiary: '#272733',
        'tertiary-hover': '#2d2d3b',
        'tertiary-focus': '#363647',
      }
    },
  },
  plugins: [],
  darkMode: "class"
}

