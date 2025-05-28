/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:'class',
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        body : ["DM Sans","sans-serif"]
      },
      colors: {
        primary : "#1DC071",
        secondary: "#6F49FD",
        text1: "#171725",
        text2: "#4B5264",
        text3: "#808191",
        icon: "#A2A2A8",
        text4: "#B2B3BD",
        white: "#FFFFFF",
        whiteSoft: "#FCFBFF",
        graySoft : "#FCFCFC",
        strock: "#F1F1F3",
        lite: "#FCFCFD",
        error:  "#EB5757",
        darkbg: "#13131A",
        darkSecondary: "#1C1C24",
        softDark : "#22222C",
        darkSoft : "#24242C",
        darkStroke: "#3A3A43",
        datkRed :"#422C32"

      },
      boxShadow: {
        sdprimary: "10px_10px_20px_rgba(218,_213,_213,_0.15)",
      }
    },
  },
  plugins: [],
}