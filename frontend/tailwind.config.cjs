/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E201E',
          50: '#777F77',
          100: '#6D746D',
          200: '#595F59',
          300: '#454A45',
          400: '#323532',
          500: '#1E201E',
          600: '#030303',
          700: '#000000',
        },
        secondary: {
          DEFAULT: '#3C3D37',
          50: '#999B90',
          100: '#909286',
          200: '#7B7D71',
          300: '#66685E',
          400: '#51524A',
          500: '#3C3D37',
          600: '#1F1F1C',
          700: '#020202',
          800: '#000000',
        },
        tertiary: {
          DEFAULT: '#677D6A',
          50: '#C9D3CA',
          100: '#BEC9BF',
          200: '#A8B7AA',
          300: '#91A494',
          400: '#7B927E',
          500: '#677D6A',
          600: '#4E5E50',
          700: '#343F36',
          800: '#1B211C',
          900: '#020202',
          950: '#000000',
        },
        accent: {
          DEFAULT: '#D6BD98',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#F9F5F0',
          300: '#EDE2D2',
          400: '#E2D0B5',
          500: '#D6BD98',
          600: '#C6A370',
          700: '#B68948',
          800: '#8D6B38',
          900: '#654D28',
          950: '#513E20'
        },
        altText: {
          DEFAULT: '#181C14',
          50: '#748761',
          100: '#6A7B58',
          200: '#556347',
          300: '#414C36',
          400: '#2C3425',
          500: '#181C14',
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
          950: '#000000'
        },
      },
      backgroundImage: (theme) => ({
        "mobile-home": "url('./assets/HomePageGraphic.png')"
      }),
      fontFamily: {
        dmsans: ["DM Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"]
      },
      content: {
        titleText: "url('./assets/nsxtext.png",
        squares: "url(./assets/squares.png",

      }
    },
    screens: {
      xs: "480px",
      sm: "768px",
      md: "1060px"
    }
  },
  plugins: [],
}