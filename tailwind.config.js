module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      scrollbar: ['rounded'],
      colors: {
        primary: '#08fdd8',
      },
    },
  },
  darkMode: 'class',
  plugins: [
  require('tailwind-scrollbar'),
],
};
