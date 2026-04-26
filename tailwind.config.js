/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  '#e6f9fd',
          100: '#b3edf8',
          200: '#80e1f3',
          300: '#4dd5ee',
          400: '#26cce8',
          500: '#00B4D8',
          600: '#009ab8',
          700: '#007f98',
          800: '#006478',
          900: '#004a58',
        },
        coral: {
          400: '#ff8585',
          500: '#FF6B6B',
          600: '#e55555',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
