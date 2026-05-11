module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Removed fontFamily as it is no longer needed
      // The extend object is now empty
      fontFamily: {},
    },
  },
  plugins: [],
};
