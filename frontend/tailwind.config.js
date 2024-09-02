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
        'dark-custom': 'linear-gradient(to top right, #1E1E1E 0%, #353434 71%, #282828 87%)',
        'white-custom': 'linear-gradient(to top right, #F6F6F6 0%, #FEFEFE 71%, #F2F2F2 87%)',
        'dark-nav-background': "linear-gradient(45deg, #2F2F2F 0%, #343434 5%, #3E3E3E 6%, #4C4C4C 10%, #2F2F2F 21%)",
        'nav-border': "linear-gradient(105deg, #FFDC26, #998417)",
        'login-button': 'linear-gradient(105deg, #BEA41C 6%, #FFDC26 45%, #FDE460 69%, #998417 96%)',
      },
      colors: {
        'gray': '#4A4A4A',
        'yellow': "#FFDC26",
        'light-yellow': "#FDE460",
        'dark-yellow': "#BB9D01",
      },
      dropShadow: {
        'logo': "0px 4px 4px rgba(255,211,94,1)"
      },
      fontFamily: {
        alexbrush: ['Alex Brush', 'cursive'],
        arsenal: ['Arsenal', 'sans-serif'],
        montserrat: ["Montserrat", "sans-serif"],
        inter: ["Inter", "sans-serif"]
      },
    },
  },
  plugins: [],
}

