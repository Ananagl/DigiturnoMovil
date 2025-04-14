/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        moradoOscuro: '#661B70',
        moradoClaro: '#B272BC',
        grisClaro: '#A1A1A1',
      },
      backgroundImage: {
        'gradient-morado': 'linear-gradient(to right, #661B70, #B272BC)',
      },
      fontFamily: {
        'open-sans': ['"Open Sans"', 'sans-serif'],
        'manrope': ['Manrope', 'sans-serif']
      }
    }
  },
  plugins: [],
}

