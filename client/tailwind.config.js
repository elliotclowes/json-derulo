/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        '1200': '1200px',
        '1250': '1250px',
        '1300': '1300px',
        '1400': '1400px',
      },
    },
  },
}

