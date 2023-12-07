/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,cjs,pug}", "./public/js/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mono: ["CaskaydiaCoveNerdFont", "monospace"],
      },
      colors: {
        nightfall: {
          background: "#1c1e26",
          foreground: "#d5d8da",
          highlight: "#2f3341",
          comment: "#5c6e7f",
          function: "#d99264",
          keyword: "#b877db",
          string: "#64d1a9",
          variable: "#d56770",
        },
      },
    },
  },
  plugins: [],
};
