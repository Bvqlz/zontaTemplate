/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          zonta: {
            burgundy: '#802528',
            'burgundy-light': '#9A3A3D',
            'burgundy-dark': '#661D20',
            gold: '#F5BD47',
            'gold-light': '#F7CD6B',
            'gold-dark': '#E0A820',
            navy: '#1B3A5F',
            'navy-light': '#2B4A6F',
            'navy-dark': '#0B2A4F',
          },
          primary: '#802528', // Zonta Burgundy
          secondary: '#F5BD47', // Zonta Gold
        },
        fontFamily: {
          heading: ['Playfair Display', 'serif'],
          body: ['Montserrat', 'sans-serif'],
        },
        boxShadow: {
          'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    plugins: [],
  }
  