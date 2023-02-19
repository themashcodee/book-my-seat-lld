/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "hsla(236, 87%, 59%,.2)",
          DEFAULT: "hsla(236, 87%, 59%,1)"
        },
        dark: {
          100: "#0d1116",
          200: "#14181d",
          300: "#20262d",
        }
      }
    },
  },
  plugins: [],
}
