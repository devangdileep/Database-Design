/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#090d16",
        card: "#0f172a",
        glass: "rgba(15, 23, 42, 0.75)",
        primaryBlue: "#3b82f6",
        primaryPurple: "#8b5cf6",
        accentCyan: "#06b6d4",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        glow: "0 0 25px rgba(59, 130, 246, 0.25)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
      }
    },
  },
  plugins: [],
};
