/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "selector",
  theme: {
    extend: {
      backgroundImage: {
        'dark': 'linear-gradient(to top right, #1E1E1E 0%, #353434 71%, #282828 87%)',
        'login-button': 'linear-gradient(105deg, #BEA41C 6%, #FFDC26 45%, #FDE460 69%, #998417 96%)',
      },
      colors: {
        'gray': '#4A4A4A',
        'yellow': "#FFDC26",
      },
      dropShadow: {
        'logo': "0px 4px 4px rgba(255,211,94,0.5)"
      },
      fontFamily: {
        alexbrush: ['Alex Brush', 'cursive'],
        arsenal: ['Arsenal', 'sans-serif'],
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
}

