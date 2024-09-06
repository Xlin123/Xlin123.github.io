/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: {
          100: "#d1d1d1",
          200: "#a2a2a2",
          300: "#747474",
          400: "#454545",
          500: "#171717",
          600: "#121212",
          700: "#0e0e0e",
          800: "#090909",
          900: "#050505"
        },
        secondary: {
          100: "#dadada",
          200: "#b4b4b4",
          300: "#8f8f8f",
          400: "#696969",
          500: "#444444",
          600: "#363636",
          700: "#292929",
          800: "#1b1b1b",
          900: "#0e0e0e"
        },
        redAccent: {
          100: "#f8ccd7",
          200: "#f099af",
          300: "#e96687",
          400: "#e1335f",
          500: "#da0037",
          600: "#ae002c",
          700: "#830021",
          800: "#570016",
          900: "#2c000b"
        },
        whiteAccent: {
          100: "#fbfbfb",
          200: "#f8f8f8",
          300: "#f4f4f4",
          400: "#f1f1f1",
          500: "#ededed",
          600: "#bebebe",
          700: "#8e8e8e",
          800: "#5f5f5f",
          900: "#2f2f2f"
},
      },
      backgroundImage: (theme) => ({
        "mobile-home": "url('./assets/HomePageGraphic.png')"
      }),
      fontFamily:{
        dmsans: ["DM Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"]
      },
      content:{
        titleText: "url('./assets/nsxtext.png",
        squares: "url(./assets/squares.png",
        
      }
    },
    screens:{
      xs: "480px",
      sm: "768px",
      md: "1060px"
    }
  },
  plugins: [],
}