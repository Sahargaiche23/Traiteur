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
          50: '#fef7ed',
          100: '#fdecd4',
          200: '#fad5a8',
          300: '#f6b871',
          400: '#f19038',
          500: '#ee7413',
          600: '#df5a09',
          700: '#b9420a',
          800: '#933510',
          900: '#772e10',
          950: '#401406',
        },
        secondary: {
          50: '#f6f5f4',
          100: '#e7e5e2',
          200: '#d1cdc7',
          300: '#b5aea4',
          400: '#9a917f',
          500: '#857a67',
          600: '#756a59',
          700: '#5f564a',
          800: '#514a41',
          900: '#47413a',
          950: '#27231f',
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'arabic': ['Amiri', 'serif'],
      }
    },
  },
  plugins: [],
}
