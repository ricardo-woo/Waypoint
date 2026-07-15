/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      fontFamily: {
        sans: ["PlusJakartaSans_400Regular"],
        medium: ["PlusJakartaSans_500Medium"],
        semibold: ["PlusJakartaSans_600SemiBold"],
        bold: ["PlusJakartaSans_700Bold"],
      },
      colors: {
        primary: "#2563EB",

        background: "#F8FAFC",

        surface: "#FFFFFF",

        text: "#111827",

        muted: "#6B7280",
      },

      borderRadius: {
        card: "20px",
      },
    },
  },

  plugins: [],
};
