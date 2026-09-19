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
      transitionTimingFunction: {
        // The built-in easings are too soft to read as intentional. These are the
        // stronger variants: `out` for anything entering or responding to input,
        // `in-out` for things moving across the screen.
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('hover-capable', '@media (hover: hover)');
    },
  ],
};
