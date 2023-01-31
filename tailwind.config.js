/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        '3xl': '0px 15px 15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    
  }
}
