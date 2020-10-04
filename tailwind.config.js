  
module.exports = {
  purge: {
    enabled: false, // Enable true to purge (production) and disable false to not purge (development)
    content: ['./**/*.html','./**/*.js',], // Add you files in this array instead of the purge array. 
  },
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#62AAA3',
          200: '#34626F',
          300: '#2E4247',
        },
        secondary: {
          'light': '#ECEDC8',
          'acc': '#E75C1C',
        }
      },
      fontFamily: {
          'Lato': ['Lato', 'sans-serif'],
                  // font-family: 'Lato', sans-serif;
          'Monstserrat': ['nunito', 'sans-serif'],
                  // font-family: 'Montserrat', sans-serif;
      }
    },
  },
  variants: {},
  plugins: [],
}