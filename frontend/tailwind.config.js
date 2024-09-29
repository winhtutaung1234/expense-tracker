import { transform } from 'typescript';

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
        'light-nav-background': "linear-gradient(45deg, #FFFFFF 0%, #F2F2F2 5%, #F5F5F5 6%, #F2F2F2 10%, #FFFFFF 21%)",
        'nav-border': "linear-gradient(105deg, #FFDC26, #998417)",
        'login-button': 'linear-gradient(105deg, #BEA41C 6%, #FFDC26 45%, #FDE460 69%, #998417 96%)',
      },
      colors: {
        'light-gray': "#757575",
        'gray': '#4A4A4A',
        'dark-gray': "#393939",
        'yellow': "#FFDC26",
        'light-yellow': "#FDE460",
        'dark-yellow': "#BB9D01",
        'light-red': "#FF5649",
        'light-green': "#05CE73",
        'success': "#009652",
        'primary': "#2196F3",
        'danger': "#F44336",
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
      keyframes: {
        opacityAppear: {
          '50%': { opacity: "0" },  // Initial color (gray)
          '100%': { opacity: "1" }, // Final color (yellow)
        },
        opacityAppearHalf: {
          '50%': { opacity: "0" },  // Initial color (gray)
          '100%': { opacity: "1" }, // Final color (yellow)
        },
        moveLeft: {
          '0%': { opacity: "0" },
          '30%': { left: "50%" },
          '50%': { opacity: "1" },
          '100%': { left: "15%", opacity: "1" }
        },
        takeFullWidth: {
          '50%': { width: "0%", border: "none" },
          '100%': { width: "100%", border: "1px solid #FDE460" }
        },
        openDropDown: {
          '0%': { transform: "translateY(-8px)", opacity: 0, display: "none" },
          '100%': { transform: "translateY(0)", opacity: 1, display: "flex" }
        },
        closeDropDown: {
          '0%': { transform: "translateY(0)", opacity: 1 },
          '100%': { transform: "translateY(-8px)", opacity: 0, display: "none" }
        },
        openNav: {
          '0%': { opacity: 0, display: "none" },
          '100%': { opacity: 1 }
        },
        closeNav: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0, display: "none" }
        },
        openBalance: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1, zIndex: 1 }
        },
        closeBalance: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0, zIndex: -1 }
        }
      },
      animation: {
        opacityAppear: 'opacityAppear 2s ease-in-out forwards',
        opacityAppearHalf: 'opacityAppearHalf 1.5s ease-in forwards',
        moveLeft: "moveLeft 1.5s ease-in-out forwards",
        takeFullWidth: "takeFullWidth 1.5s ease-in-out forwards",
        openDropDown: "openDropDown .25s ease-in-out forwards",
        closeDropDown: "closeDropDown .25s ease-in-out forwards",
        openNav: "openNav .25s ease-in-out forwards",
        closeNav: "closeNav .25s ease-in-out forwards",
        openBalance: "openBalance .25s ease-in-out forwards",
        closeBalance: "closeBalance .25s ease-in-out forwards",
      },
    },
  },
  plugins: [],
}

