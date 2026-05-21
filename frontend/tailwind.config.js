/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0d0d0f",
        ivory: "#f8f5ef",
        sand: "#d7c4a4",
        leather: "#8b5e3c",
        bronze: "#b68a5f",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 18px 45px rgba(0, 0, 0, 0.28)",
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at 20% 20%, rgba(182,138,95,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.08), transparent 35%)",
      },
    },
  },
  plugins: [],
};
