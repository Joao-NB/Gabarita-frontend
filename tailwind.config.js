/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F23054",
        secondary: "#0E2F56",
        tertiary: "#DB2A4B",
        background: "#1E1B4B",
        backgroundquestoes: "#103868",
        textinputcolor: "#797979",
        'custom-thumb': '#231B8C', 
        'custom-track': '#1E1B4B',
      },
      fontFamily: {
        sans: "Inter",
      },
      boxShadow: {
        shape:
          "0px 8px 8px rgba(0, 0, 0, 0.1), 0px 4px 4px rgba(0, 0, 0, 0.1), 0px 2px 2px rgba(0, 0, 0, 0.1), 0px 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px 0px 0px 1px rgba(255, 255, 255, 0.03), inset 0px 1px 0px rgba(255, 255, 255, 0.03)",
      },
      animation: {
        bounceLogo: 'bounceLogo 1.5s infinite ease-in-out',
        slide: 'slide 2s linear infinite',       // nova animação do loading
        fadeIn: 'fadeIn 0.5s ease-in-out',      // nova animação do fade do loading
      },
      keyframes: {
        bounceLogo: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        slide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
        },
        '.scrollbar-thumb-custom-thumb': {
          'scrollbar-color': '#231B8C #1E1B4B',
        },
        '.scrollbar-track-custom-track': {
          '--tw-scrollbar-track': '#1E1B4B',
        },
        '.scrollbar-no-buttons': {
          '&::-webkit-scrollbar-button': {
            display: 'none',
          },
        },
      });
    }),
    require('tailwind-scrollbar'),
  ],
};
