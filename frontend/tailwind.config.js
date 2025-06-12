/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#111827', // A slightly softer black
        'brand-light': '#ffffff',
        'brand-gray': '#f3f4f6',  // Light gray for backgrounds
        'brand-accent': '#4f46e5', // A vibrant indigo
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
};