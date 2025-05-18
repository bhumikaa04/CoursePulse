/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all files with relevant extensions
    "./public/index.html",       // Include HTML files in public folder
  ],
  theme: {
    extend: {}, // Customize your theme here if needed
  },
  plugins: [],
};
