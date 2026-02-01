/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        'page-sm': '1rem',
        'page-md': '4rem',
        'page-lg': '8rem',
        'page-xl': '12rem',
        'page-2xl': '20rem',
      },
      colors: {
        primary: '#152b44',
        // 'secondary': '#F0EDE4', light color option
        secondary: '#F2EDE9',
      },
    },
  },
  plugins: [],
};
