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
        tertiary: '#272733'
      }
    },
  },
  plugins: [],
}

